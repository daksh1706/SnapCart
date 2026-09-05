import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Coupon from "@/models/coupon.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_for_build");

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { userId, items, paymentMethod, totalAmount, address, appliedCoupon } = await req.json();
        if (!items || !userId || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json(
                { message: "please send all credentials" },
                { status: 400 }
            );
        }
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 400 }
            );
        }
        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        });

        if (appliedCoupon) {
            await Coupon.findOneAndUpdate(
                { code: appliedCoupon.trim().toUpperCase() },
                { $addToSet: { usedBy: user._id } }
            );
        }

        const origin = req.nextUrl?.origin || process.env.NEXT_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${origin}/user/order-success`,
            cancel_url: `${origin}/user/order-success`,

            line_items: [{
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "SnapCart Order Payment",
                    },
                    unit_amount: Math.round(totalAmount * 100),
                },
                quantity: 1,
            }],
            metadata: { 
                orderId: newOrder._id.toString(),
                couponCode: appliedCoupon || ""
            }
        });
        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `order payment error ${error}` },
            { status: 500 }
        );
    }
}
