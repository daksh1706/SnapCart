import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import emitEventHandler from "@/lib/emitEventHandler";
import { mapDeliveryAssignment, mapUser } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const session = await auth();
        const deliveryBoyId = session?.user?.id;

        if (!deliveryBoyId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { data: assignment, error: assignError } = await supabase
            .from("delivery_assignments")
            .select("*")
            .eq("id", id)
            .single();

        if (assignError || !assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        if (assignment.status !== "brodcasted") {
            return NextResponse.json({ message: "Assignment expired or already taken" }, { status: 400 });
        }

        // Update assignment: assign to delivery boy
        const { error: updateAssignError } = await supabase
            .from("delivery_assignments")
            .update({ assigned_to: deliveryBoyId, status: "assigned", accepted_at: new Date().toISOString() })
            .eq("id", id);

        if (updateAssignError) throw updateAssignError;

        // Update order: set assigned delivery boy
        const { error: updateOrderError } = await supabase
            .from("orders")
            .update({ assigned_delivery_boy_id: deliveryBoyId, updated_at: new Date().toISOString() })
            .eq("id", assignment.order_id);

        if (updateOrderError) throw updateOrderError;

        // Fetch delivery boy user for event
        const { data: deliveryBoyUser } = await supabase.from("users").select("*").eq("id", deliveryBoyId).single();

        await emitEventHandler("order-assigned", {
            orderId: assignment.order_id,
            assignedDeliveryBoy: deliveryBoyUser ? mapUser(deliveryBoyUser) : null,
        });

        // Remove this delivery boy from other broadcasted assignments
        const { data: otherAssignments } = await supabase
            .from("delivery_assignments")
            .select("id, broadcasted_to")
            .neq("id", id)
            .contains("broadcasted_to", [deliveryBoyId])
            .eq("status", "brodcasted");

        for (const otherAssignment of otherAssignments ?? []) {
            const updated = (otherAssignment.broadcasted_to ?? []).filter((bid: string) => bid !== deliveryBoyId);
            await supabase.from("delivery_assignments").update({ broadcasted_to: updated }).eq("id", otherAssignment.id);
        }

        const { data: updatedAssignment } = await supabase
            .from("delivery_assignments")
            .select("*")
            .eq("id", id)
            .single();

        return NextResponse.json(
            { message: "Order accepted successfully", assignment: mapDeliveryAssignment(updatedAssignment) },
            { status: 200 }
        );
    } catch (error) {
        console.error("Accept assignment error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}