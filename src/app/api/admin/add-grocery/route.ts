import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
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
        
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const size = formData.get("size") as string;
        const unit = formData.get("unit") as string;
        const description = formData.get("description") as string;
        const originalprice = formData.get("originalprice") as string;
        const sellingprice = formData.get("sellingprice") as string;
        const file = formData.get("image") as Blob | null;
        
        if (!name || !category || !size || !unit || !originalprice || !sellingprice) {
            return NextResponse.json(
                {
                    message: "Missing required fields",
                    received: { name, category, size, unit, originalprice, sellingprice }
                },
                { status: 400 }
            );
        }

        if (!file) {
            return NextResponse.json(
                { message: "Image is required" },
                { status: 400 }
            );
        }
        
        const imageUrl = await uploadOnCloudinary(file);
        
        const grocery = await Grocery.create({
            name,
            category,
            size,
            unit,
            originalprice,
            sellingprice,
            description: description || "",
            image: imageUrl
        });
        
        return NextResponse.json(
            { success: true, data: grocery },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('❌ Add grocery error:', error);
        return NextResponse.json(
            {
                message: "Failed to add grocery item",
                error: error.message
            },
            { status: 500 }
        );
    }
}