import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const { data: existUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (existUser) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: user, error } = await supabase
            .from("users")
            .insert({ name, email, password: hashedPassword })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ ...user, _id: user.id }, { status: 200 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Registration failed" }, { status: 500 });
    }
}