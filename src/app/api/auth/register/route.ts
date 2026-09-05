import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const existUser = await User.findOne({ email: normalizedEmail });
        
        if (existUser) {
            return NextResponse.json(
                { message: "Email already exists. Please log in instead." },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
        });

        return NextResponse.json(user, { status: 200 });

    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error?.message || "Registration failed" },
            { status: 500 }
        );
    }
}