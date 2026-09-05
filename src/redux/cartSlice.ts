import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGroceryCartItem {
    _id: string;
    name: string;
    category: string;
    size: string;
    quantity: number;
    description?: string;
    originalprice: string;
    sellingprice: string;
    unit: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ICartSlice {
    cartData: IGroceryCartItem[];
    subTotal: number;
    deliveryFee: number;
    finalTotal: number;
}

const initialState: ICartSlice = {
    cartData: [],
    subTotal: 0,
    deliveryFee: 40,
    finalTotal: 40,
};

// Helper to persist cart state safely in localStorage
const persistCartToStorage = (cartData: IGroceryCartItem[]) => {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem("snapcart_cart", JSON.stringify(cartData));
        } catch (e) {
            console.error("Failed to save cart to localStorage:", e);
        }
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        initCart: (state, action: PayloadAction<IGroceryCartItem[]>) => {
            state.cartData = action.payload || [];
            cartSlice.caseReducers.calculateTotals(state);
        },
        addToCart: (state, action: PayloadAction<IGroceryCartItem>) => {
            const existingIndex = state.cartData.findIndex((i) => i._id === action.payload._id);
            if (existingIndex >= 0) {
                state.cartData[existingIndex].quantity += action.payload.quantity || 1;
            } else {
                state.cartData.push(action.payload);
            }
            cartSlice.caseReducers.calculateTotals(state);
            persistCartToStorage(state.cartData);
        },
        increaseQunatity: (state, action: PayloadAction<string>) => {
            const item = state.cartData.find((i) => i._id === action.payload);
            if (item) {
                item.quantity += 1;
            }
            cartSlice.caseReducers.calculateTotals(state);
            persistCartToStorage(state.cartData);
        },
        decreaseQunatity: (state, action: PayloadAction<string>) => {
            const item = state.cartData.find((i) => i._id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.cartData = state.cartData.filter((i) => i._id !== action.payload);
            }
            cartSlice.caseReducers.calculateTotals(state);
            persistCartToStorage(state.cartData);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartData = state.cartData.filter(
                (item) => item._id.toString() !== action.payload.toString()
            );
            cartSlice.caseReducers.calculateTotals(state);
            persistCartToStorage(state.cartData);
        },
        clearCart: (state) => {
            state.cartData = [];
            state.subTotal = 0;
            state.deliveryFee = 40;
            state.finalTotal = 40;
            persistCartToStorage([]);
        },
        calculateTotals: (state) => {
            state.subTotal = state.cartData.reduce(
                (sum, item) => sum + Number(item.sellingprice) * item.quantity,
                0
            );
            state.deliveryFee = state.subTotal >= 100 || state.subTotal === 0 ? 0 : 40;
            state.finalTotal = state.subTotal + state.deliveryFee;
        },
    },
});

export const {
    initCart,
    addToCart,
    increaseQunatity,
    decreaseQunatity,
    removeFromCart,
    clearCart,
    calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
