import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
import wishlistSlice from "./wishlistSlice";
import couponSlice from "./couponSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        cart: cartSlice,
        wishlist: wishlistSlice,
        coupon: couponSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;