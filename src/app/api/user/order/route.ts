import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Coupon from "@/models/coupon.model";
import { NextRequest, NextResponse } from "next/server";

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

        // If coupon was applied, mark it as used by this user in database
        if (appliedCoupon) {
            await Coupon.findOneAndUpdate(
                { code: appliedCoupon.trim().toUpperCase() },
                { $addToSet: { usedBy: user._id } }
            );
        }

        await emitEventHandler("new-order", newOrder);
        
        return NextResponse.json(
            { message: "Order placed successfully", order: newOrder },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `place order error ${error}` },
            { status: 500 }
        );
    }
}