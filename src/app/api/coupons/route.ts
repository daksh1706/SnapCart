import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Coupon from "@/models/coupon.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_COUPONS = [
    {
        code: "WELCOME50",
        description: "Flat ₹50 OFF on orders above ₹199",
        discountType: "flat",
        discountValue: 50,
        minOrderAmount: 199,
        maxDiscountAmount: 50,
        isActive: true
    },
    {
        code: "FRESH20",
        description: "20% OFF (up to ₹100) on all fresh groceries",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 149,
        maxDiscountAmount: 100,
        isActive: true
    },
    {
        code: "FREEDEL",
        description: "Zero delivery charges on any order above ₹99",
        discountType: "free_delivery",
        discountValue: 40,
        minOrderAmount: 99,
        maxDiscountAmount: 40,
        isActive: true
    }
];

// Seed default coupons in MongoDB if none exist
async function seedDefaultCoupons() {
    for (const coupon of DEFAULT_COUPONS) {
        const exists = await Coupon.findOne({ code: coupon.code });
        if (!exists) {
            await Coupon.create(coupon);
        }
    }
}

// GET /api/coupons -> returns all active coupons and marks if current user has already used them
export async function GET(req: NextRequest) {
    try {
        await connectDb();
        await seedDefaultCoupons();

        const session = await auth();
        let currentUserId: string | null = null;
        if (session?.user?.email) {
            const user = await User.findOne({ email: session.user.email }).lean();
            if (user) {
                currentUserId = (user as any)._id.toString();
            }
        }

        const coupons = await Coupon.find({ isActive: true }).lean();

        const formatted = coupons.map((c: any) => {
            const usedByStrings = (c.usedBy || []).map((id: any) => id.toString());
            const isUsed = currentUserId ? usedByStrings.includes(currentUserId) : false;
            return {
                _id: c._id.toString(),
                code: c.code,
                description: c.description,
                discountType: c.discountType,
                discountValue: c.discountValue,
                minOrderAmount: c.minOrderAmount,
                maxDiscountAmount: c.maxDiscountAmount,
                isUsedByMe: isUsed,
                alreadyUsed: isUsed
            };
        });

        return NextResponse.json({ coupons: formatted }, { status: 200 });
    } catch (error) {
        console.error("GET /api/coupons error:", error);
        return NextResponse.json({ message: `Failed to fetch coupons: ${error}` }, { status: 500 });
    }
}

// POST /api/coupons -> validate and calculate discount for a coupon code
export async function POST(req: NextRequest) {
    try {
        await connectDb();
        await seedDefaultCoupons();

        const { code, subTotal } = await req.json();

        if (!code || typeof code !== "string") {
            return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
        }

        const session = await auth();
        let currentUserId: string | null = null;
        if (session?.user?.email) {
            const user = await User.findOne({ email: session.user.email }).lean();
            if (user) {
                currentUserId = (user as any)._id.toString();
            }
        }

        const coupon = await Coupon.findOne({
            code: code.trim().toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return NextResponse.json({ message: "Invalid or expired promo code" }, { status: 400 });
        }

        // Check if this specific user has already used this coupon
        if (currentUserId) {
            const hasUsed = (coupon.usedBy || []).some(
                (id: any) => id.toString() === currentUserId
            );
            if (hasUsed) {
                return NextResponse.json(
                    { message: `You have already used code ${coupon.code}. This coupon is valid once per user.` },
                    { status: 400 }
                );
            }
        }

        // Check minimum order amount
        const amount = Number(subTotal) || 0;
        if (amount < coupon.minOrderAmount) {
            return NextResponse.json(
                { message: `Minimum order amount of ₹${coupon.minOrderAmount} required for ${coupon.code}` },
                { status: 400 }
            );
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === "flat") {
            discount = coupon.discountValue;
        } else if (coupon.discountType === "percentage") {
            discount = Math.round((amount * coupon.discountValue) / 100);
            if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
                discount = coupon.maxDiscountAmount;
            }
        } else if (coupon.discountType === "free_delivery") {
            discount = 40;
        }

        return NextResponse.json(
            {
                valid: true,
                coupon: {
                    code: coupon.code,
                    description: coupon.description,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                    minOrderAmount: coupon.minOrderAmount
                },
                discountAmount: discount
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("POST /api/coupons error:", error);
        return NextResponse.json({ message: `Failed to validate coupon: ${error}` }, { status: 500 });
    }
}
