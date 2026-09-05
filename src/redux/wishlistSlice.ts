import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IWishlistItem {
    _id: string;
    name: string;
    category: string;
    size: string;
    description?: string;
    originalprice: string;
    sellingprice: string;
    unit: string;
    image: string;
}

interface IWishlistSlice {
    items: IWishlistItem[];
}

const initialState: IWishlistSlice = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlist: (state, action: PayloadAction<IWishlistItem>) => {
            const index = state.items.findIndex(i => i._id === action.payload._id);
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.push(action.payload);
            }
        },
        addToWishlist: (state, action: PayloadAction<IWishlistItem>) => {
            if (!state.items.some(i => i._id === action.payload._id)) {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i._id !== action.payload);
        },
        clearWishlist: (state) => {
            state.items = [];
        }
    }
});

export const { toggleWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
