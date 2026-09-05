import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IDbCoupon {
    _id?: string;
    code: string;
    description: string;
    discountType: "flat" | "percentage" | "free_delivery";
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    isUsedByMe?: boolean;
    alreadyUsed?: boolean;
}

interface ICouponState {
    dbCoupons: IDbCoupon[];
    appliedCoupon: IDbCoupon | null;
    discountAmount: number;
    error: string | null;
    loading: boolean;
}

const initialState: ICouponState = {
    dbCoupons: [],
    appliedCoupon: null,
    discountAmount: 0,
    error: null,
    loading: false
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        setDbCoupons: (state, action: PayloadAction<IDbCoupon[]>) => {
            state.dbCoupons = action.payload;
        },
        setAppliedCouponSuccess: (
            state,
            action: PayloadAction<{ coupon: IDbCoupon; discountAmount: number }>
        ) => {
            state.appliedCoupon = action.payload.coupon;
            state.discountAmount = action.payload.discountAmount;
            state.error = null;
        },
        setCouponError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.appliedCoupon = null;
            state.discountAmount = 0;
        },
        removeCoupon: (state) => {
            state.appliedCoupon = null;
            state.discountAmount = 0;
            state.error = null;
        }
    }
});

export const {
    setDbCoupons,
    setAppliedCouponSuccess,
    setCouponError,
    removeCoupon
} = couponSlice.actions;

export default couponSlice.reducer;
