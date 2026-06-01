import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { mapUser } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ message: "user is not authenticated" }, { status: 400 });
        }
        const { data: user, error } = await supabase
            .from("users")
            .select("id, name, email, mobile, role, image, location_lat, location_lng, socket_id, is_online, created_at, updated_at")
            .eq("email", session.user.email)
            .single();

        if (error || !user) {
            return NextResponse.json({ message: "user not found" }, { status: 400 });
        }
        return NextResponse.json(mapUser(user), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `get me error : ${error}` }, { status: 500 });
    }
}
