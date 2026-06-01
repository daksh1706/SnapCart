import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { mapGrocery } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
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

        console.log("Received data:", { name, category, size, unit, originalprice, sellingprice, hasFile: !!file, description });

        if (!name || !category || !size || !unit || !originalprice || !sellingprice) {
            return NextResponse.json(
                { message: "Missing required fields", received: { name, category, size, unit, originalprice, sellingprice } },
                { status: 400 }
            );
        }
        if (!file) {
            return NextResponse.json({ message: "Image is required" }, { status: 400 });
        }

        console.log("Uploading image to Cloudinary...");
        const imageUrl = await uploadOnCloudinary(file);
        console.log("Image uploaded:", imageUrl);

        const { data: grocery, error } = await supabase
            .from("groceries")
            .insert({ name, category, size, unit, originalprice, sellingprice, description: description || "", image: imageUrl })
            .select()
            .single();

        if (error) throw error;

        console.log("Grocery created successfully:", grocery.id);
        return NextResponse.json({ success: true, data: mapGrocery(grocery) }, { status: 201 });
    } catch (error: any) {
        console.error("❌ Add grocery error:", error);
        return NextResponse.json(
            { message: "Failed to add grocery item", error: error.message },
            { status: 500 }
        );
    }
}