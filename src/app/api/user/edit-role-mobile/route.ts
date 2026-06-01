import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { mapUser } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { role, mobile } = await req.json();
        const session = await auth();

        const { data: user, error } = await supabase
            .from("users")
            .update({ role, mobile: String(mobile) })
            .eq("email", session?.user?.email)
            .select()
            .single();

        if (error || !user) {
            return NextResponse.json({ message: "user not found" }, { status: 400 });
        }
        return NextResponse.json(mapUser(user), { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `edit role and mobile error ${error}` },
            { status: 500 }
        );
    }
}