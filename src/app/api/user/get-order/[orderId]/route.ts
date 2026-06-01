import { supabase } from "@/lib/supabase";
import { mapOrder } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await context.params;
        console.log(orderId);

        const { data: order, error } = await supabase
            .from("orders")
            .select(`
                *,
                assigned_delivery_boy:users!assigned_delivery_boy_id(*)
            `)
            .eq("id", orderId)
            .single();

        if (error || !order) {
            return NextResponse.json({ message: "order not found" }, { status: 404 });
        }

        return NextResponse.json(mapOrder(order), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Internal server error ${error}` }, { status: 500 });
    }
}