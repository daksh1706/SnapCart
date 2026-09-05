import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const addressId = params.id;
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        user.savedAddresses = (user.savedAddresses || []).filter(
            (addr: any) => addr._id?.toString() !== addressId
        );

        await user.save();

        return NextResponse.json({
            message: "Address deleted successfully",
            addresses: user.savedAddresses
        }, { status: 200 });
    } catch (error) {
        console.error("Delete address error:", error);
        return NextResponse.json({ message: `Failed to delete address: ${error}` }, { status: 500 });
    }
}
