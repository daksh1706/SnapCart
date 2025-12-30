import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        
        if(session?.user?.role !== "admin"){
            return NextResponse.json(
                {message: "You are not authorized. Admin access required."},
                {status: 403}
            )
        }
        
        const formData = await req.formData()
        const name = formData.get("name") as string
        const category = formData.get("category") as string
        const size = formData.get("size") as string
        const unit = formData.get("unit") as string
        const description = formData.get("description") as string
        const originalprice = formData.get("originalprice") as string
        const sellingprice = formData.get("sellingprice") as string
        const file = formData.get("image") as Blob | null
        
        // ✅ Log received data
        console.log("Received data:", {
            name, category, size, unit, originalprice, sellingprice, 
            hasFile: !!file, description
        })
        
        // ✅ Validation
        if (!name || !category || !size || !unit || !originalprice || !sellingprice) {
            return NextResponse.json(
                {
                    message: "Missing required fields",
                    received: { name, category, size, unit, originalprice, sellingprice }
                },
                {status: 400}
            )
        }

        if (!file) {
            return NextResponse.json(
                {message: "Image is required"},
                {status: 400}
            )
        }
        
        console.log("Uploading image to Cloudinary...")
        const imageUrl = await uploadOnCloudinary(file)
        console.log("Image uploaded:", imageUrl)
        
        console.log("Creating grocery in database...")
        const grocery = await Grocery.create({
            name,
            category,
            size,
            unit,
            originalprice,
            sellingprice,
            description: description || "",
            image: imageUrl
        })
        
        console.log("Grocery created successfully:", grocery._id)
        
        return NextResponse.json(
            {success: true, data: grocery},
            {status: 201}
        )
    } catch (error: any) {
        console.error('❌ Add grocery error:', error)
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        
        // Log MongoDB validation errors
        if (error.errors) {
            console.error('Validation errors:', error.errors)
        }
        
        return NextResponse.json(
            {
                message: "Failed to add grocery item",
                error: error.message,
                errorName: error.name,
                validationErrors: error.errors
            },
            {status: 500}
        )
    }
}