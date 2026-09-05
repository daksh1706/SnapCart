import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import DeliveryAssignment from "@/models/deliveryAssignment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
        }

        await connectDb();

        // 1. Fetch Customers
        const customers = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean();
        const customerIds = customers.map((c: any) => c._id);

        // Fetch all orders for these customers
        const allOrders = await Order.find({ user: { $in: customerIds } }).lean();

        const enrichedCustomers = customers.map((customer: any) => {
            const userOrders = allOrders.filter(
                (o: any) => o.user?.toString() === customer._id.toString()
            );
            const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
            const lastOrder = userOrders.sort(
                (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];

            return {
                _id: customer._id.toString(),
                name: customer.name,
                email: customer.email,
                mobile: customer.mobile || "Not set",
                image: customer.image || null,
                totalOrders: userOrders.length,
                totalSpent: totalSpent,
                lastOrderDate: lastOrder ? lastOrder.createdAt : null,
                createdAt: customer.createdAt
            };
        });

        // 2. Fetch Delivery Partners
        const deliveryPartners = await User.find({ role: "deliveryBoy" }).sort({ createdAt: -1 }).lean();
        const partnerIds = deliveryPartners.map((p: any) => p._id);

        // Fetch completed orders for delivery partners
        const deliveredOrders = await Order.find({
            assignedDeliveryBoy: { $in: partnerIds },
            status: "delivered"
        }).lean();

        // Fetch active assignments
        const activeAssignments = await DeliveryAssignment.find({
            deliveryBoy: { $in: partnerIds },
            status: { $in: ["assigned", "accepted"] }
        }).lean();

        const enrichedPartners = deliveryPartners.map((partner: any) => {
            const completedCount = deliveredOrders.filter(
                (o: any) => o.assignedDeliveryBoy?.toString() === partner._id.toString()
            ).length;

            const activeCount = activeAssignments.filter(
                (a: any) => a.deliveryBoy?.toString() === partner._id.toString()
            ).length;

            return {
                _id: partner._id.toString(),
                name: partner.name,
                email: partner.email,
                mobile: partner.mobile || "Not set",
                image: partner.image || null,
                isOnline: !!partner.isOnline,
                completedDeliveries: completedCount,
                activeDeliveries: activeCount,
                createdAt: partner.createdAt
            };
        });

        return NextResponse.json({
            customers: enrichedCustomers,
            deliveryPartners: enrichedPartners
        }, { status: 200 });
    } catch (error) {
        console.error("Admin fetch users error:", error);
        return NextResponse.json({ message: `Failed to fetch users: ${error}` }, { status: 500 });
    }
}
