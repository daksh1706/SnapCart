import { supabase } from "@/lib/supabase";
import emitEventHandler from "@/lib/emitEventHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { orderId, otp } = await req.json();
        if (!orderId || !otp) {
            return NextResponse.json({ message: "OrderId or OTP not found" }, { status: 400 });
        }

        const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single();

        if (error || !order) {
            return NextResponse.json({ message: "order not found" }, { status: 400 });
        }
        if (order.delivery_otp !== otp) {
            return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
        }

        await supabase.from("orders").update({
            status: "delivered",
            delivery_otp_verification: true,
            delivered_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }).eq("id", orderId);

        await emitEventHandler("order-status-update", { orderId, status: "delivered" });

        await supabase.from("delivery_assignments").update({
            assigned_to: null,
            status: "completed",
            updated_at: new Date().toISOString(),
        }).eq("order_id", orderId);

        return NextResponse.json({ message: "Delivery successfully completed" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `delivery otp verification failed ${error}` }, { status: 500 });
    }
}