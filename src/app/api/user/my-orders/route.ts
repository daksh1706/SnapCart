import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { mapOrder } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        const { data: orders, error } = await supabase
            .from("orders")
            .select(`
                *,
                user:users!user_id(*),
                assigned_delivery_boy:users!assigned_delivery_boy_id(*)
            `)
            .eq("user_id", session?.user?.id)
            .order("created_at", { ascending: false });

        if (error) throw error;
        if (!orders) {
            return NextResponse.json({ message: "order not found" }, { status: 400 });
        }

        return NextResponse.json(orders.map(mapOrder), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `get all orders error : ${error}` }, { status: 500 });
    }
}