import { supabase } from "@/lib/supabase";
import { mapGrocery } from "@/lib/mappers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { data: groceries, error } = await supabase
            .from("groceries")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(groceries.map(mapGrocery), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `get grocery error ${error}` }, { status: 500 });
    }
}