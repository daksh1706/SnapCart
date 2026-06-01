import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, socketId } = await req.json();
        const { data: user, error } = await supabase
            .from("users")
            .update({ socket_id: socketId, is_online: true, updated_at: new Date().toISOString() })
            .eq("id", userId)
            .select("id")
            .single();

        if (error || !user) {
            return NextResponse.json({ message: "user not found" }, { status: 400 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}