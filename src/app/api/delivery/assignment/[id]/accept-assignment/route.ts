import { auth } from "@/auth";
import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context:{params:Promise<{id:string}>;}) {
    try {
        await connectDb();
        const { id } = await context.params
        const session = await auth();
        const deliverBoyId = session?.user?.id;
        
        if (!deliverBoyId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 } 
            );
        }

        const assignment = await DeliveryAssignment.findById(id);
        
        if (!assignment) {
            return NextResponse.json(
                { message: "Assignment not found" },
                { status: 404 } 
            );
        }

        if (assignment.status !== "brodcasted") {
            return NextResponse.json(
                { message: "Assignment expired or already taken" },
                { status: 400 }
            );
        }

        assignment.assignedTo = deliverBoyId;
        assignment.status = "assigned";
        assignment.acceptedAt = new Date();
        await assignment.save();
        const order = await Order.findById(assignment.order);
        
        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        order.assignedDeliveryBoy = deliverBoyId;
        await order.save();
        await order.populate("assignedDeliveryBoy")

        await emitEventHandler("order-assigned",{orderId:order._id,assignedDeliveryBoy:order.assignedDeliveryBoy})

        await DeliveryAssignment.updateMany(
            {
                _id: { $ne: assignment._id },
                brodcastedTo: deliverBoyId,
                status: "brodcasted" 
            },
            {
                $pull: { brodcastedTo: deliverBoyId }
            }
        );

        return NextResponse.json(
            { 
                message: "Order accepted successfully",
                assignment 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Accept assignment error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}