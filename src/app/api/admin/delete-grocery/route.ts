import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        
        if (session?.user?.role !== "admin") {
            return NextResponse.json(
                { message: "You are not authorized. Admin access required." },
                { status: 403 }
            );
        }
        const { groceryId } = await req.json();
        const grocery = await Grocery.findByIdAndDelete(groceryId);
        
        return NextResponse.json(
            grocery,
            { status: 200 }
        );
    } catch (error: any) {
        console.error('❌ Delete grocery error:', error);
        return NextResponse.json(
            {
                message: "Failed to delete grocery item",
            },
            { status: 500 }
        );
    }
}
