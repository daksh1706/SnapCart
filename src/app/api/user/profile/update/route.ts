import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { name, mobile } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                name: name.trim(),
                mobile: mobile ? mobile.trim() : ""
            },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        }, { status: 200 });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: `Profile update failed: ${error}` }, { status: 500 });
    }
}
