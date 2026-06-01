import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { mapDeliveryAssignment } from "@/lib/mappers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { data: assignments, error } = await supabase
            .from("delivery_assignments")
            .select(`
                *,
                order:orders!order_id(*)
            `)
            .contains("broadcasted_to", [session.user.id])
            .eq("status", "brodcasted");

        if (error) throw error;

        return NextResponse.json((assignments ?? []).map(mapDeliveryAssignment), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `get assignments error: ${error}` }, { status: 500 });
    }
}