import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("id")
            .eq("role", "admin");

        if (error) throw error;

        return NextResponse.json(
            { adminExist: users && users.length > 0 },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `check for admin error ${error}` },
            { status: 500 }
        );
    }
}