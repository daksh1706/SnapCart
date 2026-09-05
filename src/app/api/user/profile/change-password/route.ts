import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { currentPassword, newPassword } = await req.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ message: "New password must be at least 6 characters long" }, { status: 400 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // If user already has a password set, verify current password
        if (user.password) {
            if (!currentPassword) {
                return NextResponse.json({ message: "Current password is required" }, { status: 400 });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ message: "Current password does not match" }, { status: 400 });
            }
        }

        // Hash and save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json({ message: `Failed to change password: ${error}` }, { status: 500 });
    }
}
