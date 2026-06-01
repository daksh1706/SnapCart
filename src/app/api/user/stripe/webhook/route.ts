import { supabase } from "@/lib/supabase";
import emitEventHandler from "@/lib/emitEventHandler";
import { mapOrder } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();
    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
        console.log("signature verification failed", error);
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    if (event?.type === "checkout.session.completed") {
        const session = event.data.object;
        const { data: updatedOrder, error } = await supabase
            .from("orders")
            .update({ is_paid: true, updated_at: new Date().toISOString() })
            .eq("id", session?.metadata?.orderId)
            .select("*, user:users!user_id(*)")
            .single();

        if (!error && updatedOrder) {
            await emitEventHandler("new-order", mapOrder(updatedOrder));
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}