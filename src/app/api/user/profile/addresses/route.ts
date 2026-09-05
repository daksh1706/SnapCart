import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/profile/addresses -> fetch saved addresses (also populates from recent order addresses if none saved yet)
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        let addresses = user.savedAddresses || [];

        // If user has no saved addresses yet, import recent addresses from past orders automatically
        if (addresses.length === 0) {
            const pastOrders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).lean();
            const uniqueAddressMap = new Map<string, any>();

            pastOrders.forEach((order: any) => {
                if (order.address && order.address.fullAddress) {
                    const key = `${order.address.fullAddress}-${order.address.pincode}`.toLowerCase();
                    if (!uniqueAddressMap.has(key)) {
                        uniqueAddressMap.set(key, {
                            fullName: order.address.fullName || user.name,
                            mobile: order.address.mobile || user.mobile || "",
                            city: order.address.city || "",
                            state: order.address.state || "",
                            pincode: order.address.pincode || "",
                            fullAddress: order.address.fullAddress,
                            isDefault: uniqueAddressMap.size === 0
                        });
                    }
                }
            });

            if (uniqueAddressMap.size > 0) {
                user.savedAddresses = Array.from(uniqueAddressMap.values());
                await user.save();
                addresses = user.savedAddresses;
            }
        }

        return NextResponse.json({ addresses }, { status: 200 });
    } catch (error) {
        console.error("Fetch addresses error:", error);
        return NextResponse.json({ message: `Failed to fetch addresses: ${error}` }, { status: 500 });
    }
}

// POST /api/user/profile/addresses -> add a new saved address
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { fullName, mobile, city, state, pincode, fullAddress, isDefault } = await req.json();

        if (!fullName || !mobile || !fullAddress || !city || !state || !pincode) {
            return NextResponse.json({ message: "All address fields are required" }, { status: 400 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.savedAddresses) {
            user.savedAddresses = [];
        }

        if (isDefault) {
            user.savedAddresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        user.savedAddresses.push({
            fullName: fullName.trim(),
            mobile: mobile.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            fullAddress: fullAddress.trim(),
            isDefault: isDefault || user.savedAddresses.length === 0
        });

        await user.save();

        return NextResponse.json({
            message: "Address saved successfully",
            addresses: user.savedAddresses
        }, { status: 201 });
    } catch (error) {
        console.error("Save address error:", error);
        return NextResponse.json({ message: `Failed to save address: ${error}` }, { status: 500 });
    }
}
