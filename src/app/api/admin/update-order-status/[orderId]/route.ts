import { supabase } from "@/lib/supabase";
import emitEventHandler from "@/lib/emitEventHandler";
import { mapDeliveryAssignment, haversineDistance } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ orderId: string }> }) {
    try {
        const { orderId } = await context.params;
        const { status } = await req.json();

        // Fetch order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*, user:users!user_id(*)")
            .eq("id", orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ message: "order not found" }, { status: 400 });
        }

        // Update status
        await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);

        let deliveryBoysPayload: any[] = [];

        if (status === "out for delivery" && !order.assignment_id) {
            const { latitude, longitude } = order.address;

            // Get all delivery boys
            const { data: allBoys } = await supabase
                .from("users")
                .select("*")
                .eq("role", "deliveryBoy");

            console.log("Total delivery boys in DB:", allBoys?.length ?? 0);

            // Filter nearby (within 10km) using Haversine
            const nearbyDeliveryBoys = (allBoys ?? []).filter((boy) => {
                const dist = haversineDistance(
                    Number(latitude),
                    Number(longitude),
                    boy.location_lat ?? 0,
                    boy.location_lng ?? 0
                );
                return dist <= 10000;
            });

            console.log("Nearby delivery boys:", nearbyDeliveryBoys.length);
            const nearbyIds = nearbyDeliveryBoys.map((b) => b.id);

            // Find busy delivery boys (currently assigned)
            const { data: busyAssignments } = await supabase
                .from("delivery_assignments")
                .select("assigned_to")
                .in("assigned_to", nearbyIds.length > 0 ? nearbyIds : ["none"])
                .eq("status", "assigned");

            const busyIdSet = new Set((busyAssignments ?? []).map((b) => b.assigned_to));
            const availableDeliveryBoys = nearbyDeliveryBoys.filter((b) => !busyIdSet.has(b.id));
            const candidates = availableDeliveryBoys.map((b) => b.id);

            if (candidates.length === 0) {
                await emitEventHandler("order-status-update", { orderId, status });
                return NextResponse.json({ message: "there is no delivery boy" }, { status: 200 });
            }

            // Create delivery assignment
            const { data: deliveryAssignment, error: assignError } = await supabase
                .from("delivery_assignments")
                .insert({ order_id: orderId, broadcasted_to: candidates, status: "brodcasted" })
                .select("*, order:orders!order_id(*)")
                .single();

            if (assignError || !deliveryAssignment) throw assignError;

            // Update order with assignment id
            await supabase.from("orders").update({ assignment_id: deliveryAssignment.id }).eq("id", orderId);

            // Notify delivery boys
            for (const boyId of candidates) {
                const boy = availableDeliveryBoys.find((b) => b.id === boyId);
                if (boy?.socket_id) {
                    await emitEventHandler("new-assignment", mapDeliveryAssignment(deliveryAssignment), boy.socket_id);
                }
            }

            deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
                id: b.id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location_lat,
                longitude: b.location_lng,
            }));

            await emitEventHandler("order-status-update", { orderId, status });
            return NextResponse.json(
                { assignment: deliveryAssignment.id, availableBoys: deliveryBoysPayload },
                { status: 200 }
            );
        }

        await emitEventHandler("order-status-update", { orderId, status });
        return NextResponse.json({ assignment: order.assignment_id, availableBoys: deliveryBoysPayload }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `update status error ${error}` }, { status: 500 });
    }
}