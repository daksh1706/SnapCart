import mongoose from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    sellingPrice: string;
    size: string;
    unit: string;
    image: string;
    quantity: number;
}

export interface IOrder {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    isPaid: boolean;
    totalAmount: number;
    paymentMethod: "cod" | "online";
    address: {
        fullName: string;
        mobile: string;
        city: string;
        state: string;
        pincode: string;
        fullAddress: string;
        latitude: number;
        longitude: number;
    };
    assignment?: mongoose.Types.ObjectId | null;
    assignedDeliveryBoy?: mongoose.Types.ObjectId | null;
    status: "pending" | "out for delivery" | "delivered";
    createdAt?: Date;
    updatedAt?: Date;
    deliveryOtp: string | null;
    deliveryOtpVerification: boolean;
    deliveredAt?: Date | null;
}

const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Grocery",
                required: true
            },
            name: String,
            sellingPrice: String,
            size: String,
            unit: String,
            image: String,
            quantity: Number
        }
    ],
    isPaid: {
        type: Boolean,
        default: false
    },
    totalAmount: Number,
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        default: "cod"
    },
    address: {
        fullName: String,
        mobile: String,
        city: String,
        state: String,
        pincode: String,
        fullAddress: String,
        latitude: Number,
        longitude: Number
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        default: null
    },
    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "out for delivery", "delivered"],
        default: "pending"
    },
    deliveryOtp: {
        type: String,
        default: null
    },
    deliveryOtpVerification: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
