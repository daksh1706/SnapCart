import connectDb from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/models/order.model";
import "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { orderId } = await req.json();
        
        const order = await Order.findById(orderId).populate("user");
        
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        const userEmail = (order.user as any)?.email;
        if (!userEmail) {
            return NextResponse.json({ message: "Customer email not found" }, { status: 400 });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        order.deliveryOtp = otp;
        await order.save();

        await sendMail(
            userEmail,
            "Your Delivery OTP",
            `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>
                <p>Please share this OTP with the delivery person to confirm delivery.</p>
                <p>This OTP is valid for 10 minutes.</p>`
        );

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("DETAILED_ERROR:", error);
        return NextResponse.json(
            { message: "OTP send failed", error: error.message }, 
            { status: 500 }
        );
    }
}