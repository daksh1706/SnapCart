import mongoose, { Schema, Document } from "mongoose";

export interface ICouponDocument extends Document {
    code: string;
    description: string;
    discountType: "flat" | "percentage" | "free_delivery";
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    usedBy: mongoose.Types.ObjectId[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const couponSchema = new Schema<ICouponDocument>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        discountType: {
            type: String,
            enum: ["flat", "percentage", "free_delivery"],
            required: true
        },
        discountValue: {
            type: Number,
            required: true
        },
        minOrderAmount: {
            type: Number,
            default: 0
        },
        maxDiscountAmount: {
            type: Number,
            default: 0
        },
        usedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model<ICouponDocument>("Coupon", couponSchema);
export default Coupon;
