import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "You are not authorized. Admin access required." }, { status: 403 });
        }
        const { groceryId } = await req.json();

        const { data: grocery, error } = await supabase
            .from("groceries")
            .delete()
            .eq("id", groceryId)
            .select()
            .single();

        if (error || !grocery) {
            return NextResponse.json({ message: "Grocery not found" }, { status: 404 });
        }

        console.log("Grocery deleted successfully:", grocery.id);
        return NextResponse.json({ ...grocery, _id: grocery.id }, { status: 201 });
    } catch (error: any) {
        console.error("❌ Delete grocery error:", error);
        return NextResponse.json({ message: "Failed to delete grocery item" }, { status: 500 });
    }
}
