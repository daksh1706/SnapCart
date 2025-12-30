import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {userId,location} = await req.json()
        if(!userId || !location){
            return NextResponse.json(
                {messgae:"missing userId or location"},
                {status:400}
            )
        }
        const user = await User.findByIdAndUpdate(userId,{location})
        if(!userId){
            return NextResponse.json(
                {messgae:"user not found"},
                {status:400}
            )
        }
        return NextResponse.json(
                {messgae:"location updated"},
                {status:200}
            )
    } catch (error) {
        return NextResponse.json(
                {messgae:`update location error ${error}`},
                {status:500}
            )
    }
}