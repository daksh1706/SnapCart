import { supabase } from "@/lib/supabase";
import { sendMail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        const { data: order, error } = await supabase
            .from("orders")
            .select("*, user:users!user_id(*)")
            .eq("id", orderId)
            .single();

        if (error || !order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        if (!order.user?.email) {
            return NextResponse.json({ message: "Customer email not found" }, { status: 400 });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        await supabase.from("orders").update({ delivery_otp: otp, updated_at: new Date().toISOString() }).eq("id", orderId);

        await sendMail(
            order.user.email,
            "Your Delivery OTP",
            `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>
                <p>Please share this OTP with the delivery person to confirm delivery.</p>
                <p>This OTP is valid for 10 minutes.</p>`
        );

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("DETAILED_ERROR:", error);
        return NextResponse.json({ message: "OTP send failed", error: error.message }, { status: 500 });
    }
}