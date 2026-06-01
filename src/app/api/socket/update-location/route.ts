import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, location } = await req.json();
        if (!userId || !location) {
            return NextResponse.json({ message: "missing userId or location" }, { status: 400 });
        }

        // location is: { type: "Point", coordinates: [latitude, longitude] }
        const lat = location.coordinates?.[0] ?? 0;
        const lng = location.coordinates?.[1] ?? 0;

        const { error } = await supabase
            .from("users")
            .update({ location_lat: lat, location_lng: lng, updated_at: new Date().toISOString() })
            .eq("id", userId);

        if (error) {
            return NextResponse.json({ message: "user not found" }, { status: 400 });
        }
        return NextResponse.json({ message: "location updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `update location error ${error}` }, { status: 500 });
    }
}