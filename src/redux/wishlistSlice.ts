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

const persistWishlistToStorage = (items: IWishlistItem[]) => {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem("snapcart_wishlist", JSON.stringify(items));
        } catch (e) {
            console.error("Failed to save wishlist to localStorage:", e);
        }
    }
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        initWishlist: (state, action: PayloadAction<IWishlistItem[]>) => {
            state.items = action.payload || [];
        },
        toggleWishlist: (state, action: PayloadAction<IWishlistItem>) => {
            const index = state.items.findIndex(i => i._id === action.payload._id);
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.push(action.payload);
            }
            persistWishlistToStorage(state.items);
        },
        addToWishlist: (state, action: PayloadAction<IWishlistItem>) => {
            if (!state.items.some(i => i._id === action.payload._id)) {
                state.items.push(action.payload);
                persistWishlistToStorage(state.items);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i._id !== action.payload);
            persistWishlistToStorage(state.items);
        },
        clearWishlist: (state) => {
            state.items = [];
            persistWishlistToStorage([]);
        }
    }
});

export const {
    initWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
