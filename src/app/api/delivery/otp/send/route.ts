import connectDb from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { orderId } = await req.json();
        
        // 1. Ensure User model is loaded for population
        const order = await Order.findById(orderId).populate("user");
        
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // 2. Safety check for user email
        if (!order.user?.email) {
            return NextResponse.json({ message: "Customer email not found" }, { status: 400 });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        order.deliveryOtp = otp;
        await order.save();

        // 3. Wrap mailer in a try-catch or ensure it's awaited properly
        await sendMail(
            order.user.email,
            "Your Delivery OTP",
            `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>
                <p>Please share this OTP with the delivery person to confirm delivery.</p>
                <p>This OTP is valid for 10 minutes.</p>`
        );

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("DETAILED_ERROR:", error); // Check your TERMINAL for this log
        return NextResponse.json(
            { message: "OTP send failed", error: error.message }, 
            { status: 500 }
        );
    }
}