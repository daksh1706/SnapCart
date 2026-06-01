import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { userId, items, paymentMethod, totalAmount, address } = await req.json();

        if (!items || !userId || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json({ message: "please send all credentials" }, { status: 400 });
        }

        const { data: user } = await supabase.from("users").select("id").eq("id", userId).single();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 400 });
        }

        const { data: newOrder, error } = await supabase
            .from("orders")
            .insert({ user_id: userId, items, payment_method: paymentMethod, total_amount: totalAmount, address })
            .select()
            .single();

        if (error) throw error;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
            cancel_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: { name: "SnapCart Order Payment" },
                        unit_amount: totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: { orderId: newOrder.id },
        });

        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `order payment error ${error}` }, { status: 500 });
    }
}
