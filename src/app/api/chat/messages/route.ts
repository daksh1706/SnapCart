import { supabase } from "@/lib/supabase";
import { mapMessage } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { roomId } = await req.json();

        const { data: room } = await supabase
            .from("orders")
            .select("id")
            .eq("id", roomId)
            .single();

        if (!room) {
            return NextResponse.json(
                { message: "room not found" },
                { status: 400 }
            );
        }

        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .eq("room_id", room.id)
            .order("created_at", { ascending: true });

        if (error) throw error;

        const mappedMessages = (messages || []).map(mapMessage);

        return NextResponse.json(mappedMessages, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `get messages error ${error}` },
            { status: 500 }
        );
    }
}