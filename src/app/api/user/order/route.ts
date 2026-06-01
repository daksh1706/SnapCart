import { supabase } from "@/lib/supabase";
import emitEventHandler from "@/lib/emitEventHandler";
import { mapOrder } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

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
            .select("*, user:users!user_id(*)")
            .single();

        if (error) throw error;

        await emitEventHandler("new-order", mapOrder(newOrder));

        return NextResponse.json(
            { message: "Order placed successfully", order: mapOrder(newOrder) },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: `place order error ${error}` }, { status: 500 });
    }
}