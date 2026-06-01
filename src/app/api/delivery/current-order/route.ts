import { supabase } from "@/lib/supabase";
import { mapDeliveryAssignment } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const deliveryBoyId = searchParams.get("deliveryBoyId");

        if (!deliveryBoyId) {
            return NextResponse.json({ message: "deliveryBoyId is required" }, { status: 400 });
        }

        const { data: activeAssignment, error } = await supabase
            .from("delivery_assignments")
            .select(`
                *,
                order:orders!order_id(*, user:users!user_id(*))
            `)
            .eq("assigned_to", deliveryBoyId)
            .eq("status", "assigned")
            .maybeSingle();

        if (error) throw error;

        if (!activeAssignment) {
            return NextResponse.json({ message: "no active assignment" }, { status: 404 });
        }

        return NextResponse.json(mapDeliveryAssignment(activeAssignment), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `get current order error: ${error}` }, { status: 500 });
    }
}