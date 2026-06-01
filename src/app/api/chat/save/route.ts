import { supabase } from "@/lib/supabase";
import { mapMessage } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { roomId, senderId, text, time } = await req.json();

        const { data: room } = await supabase.from("orders").select("id").eq("id", roomId).single();
        if (!room) {
            return NextResponse.json({ message: "room not found" }, { status: 400 });
        }

        const { data: message, error } = await supabase
            .from("messages")
            .insert({ room_id: roomId, sender_id: senderId, text, time })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(mapMessage(message), { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: `save message error ${error}` }, { status: 500 });
    }
}