import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICoupon {
    code: string;
    description: string;
    type: "flat" | "percentage" | "free_delivery";
    value: number;
    minOrder: number;
    maxDiscount?: number;
}

export const AVAILABLE_COUPONS: ICoupon[] = [
    {
        code: "WELCOME50",
        description: "Flat ₹50 OFF on orders above ₹199",
        type: "flat",
        value: 50,
        minOrder: 199
    },
    {
        code: "FRESH20",
        description: "20% OFF (up to ₹100) on all groceries",
        type: "percentage",
        value: 20,
        minOrder: 149,
        maxDiscount: 100
    },
    {
        code: "FREEDEL",
        description: "Zero delivery charges on any order",
        type: "free_delivery",
        value: 40,
        minOrder: 99
    }
];

interface ICouponState {
    appliedCoupon: ICoupon | null;
    discountAmount: number;
    error: string | null;
}

const initialState: ICouponState = {
    appliedCoupon: null,
    discountAmount: 0,
    error: null
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        applyCoupon: (state, action: PayloadAction<{ code: string; subTotal: number }>) => {
            const found = AVAILABLE_COUPONS.find(
                c => c.code.toUpperCase() === action.payload.code.trim().toUpperCase()
            );

            if (!found) {
                state.error = "Invalid promo code";
                state.appliedCoupon = null;
                state.discountAmount = 0;
                return;
            }

            if (action.payload.subTotal < found.minOrder) {
                state.error = `Minimum order value of ₹${found.minOrder} required for ${found.code}`;
                state.appliedCoupon = null;
                state.discountAmount = 0;
                return;
            }

            let discount = 0;
            if (found.type === "flat") {
                discount = found.value;
            } else if (found.type === "percentage") {
                discount = Math.round((action.payload.subTotal * found.value) / 100);
                if (found.maxDiscount && discount > found.maxDiscount) {
                    discount = found.maxDiscount;
                }
            } else if (found.type === "free_delivery") {
                discount = 40;
            }

            state.appliedCoupon = found;
            state.discountAmount = discount;
            state.error = null;
        },
        removeCoupon: (state) => {
            state.appliedCoupon = null;
            state.discountAmount = 0;
            state.error = null;
        }
    }
});

export const { applyCoupon, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;
