import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery{
    _id : mongoose.Types.ObjectId,
    name: string,
    category : string,
    size :string,
    quantity : number,
    description ?: string,
    originalprice : string,
    sellingprice : string,
    unit : string,
    image : string,
    createdAt ?: Date,
    updatedAt ?: Date
}

interface ICartSlice{
    cartData :IGrocery[]
    subTotal : number,
    deliveryFee : number,
    finalTotal : number
}

const initialState:ICartSlice={
    cartData:[],
    subTotal :0,
    deliveryFee : 40,
    finalTotal : 40
}

const cartSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        addToCart:(state,action:PayloadAction<IGrocery>)=>{
            state.cartData.push(action.payload)
            cartSlice.caseReducers.calculateTotals(state)
        },
        increaseQunatity:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const item = state.cartData.find(i=>i._id==action.payload)
            if(item){
                item.quantity = item.quantity + 1
            }
            cartSlice.caseReducers.calculateTotals(state)
        },
        decreaseQunatity:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const item = state.cartData.find(i=>i._id==action.payload)
            if(item?.quantity && item.quantity>1){
                item.quantity = item.quantity - 1
            }else{
                state.cartData = state.cartData.filter(i=>i._id!==action.payload)
            }
            cartSlice.caseReducers.calculateTotals(state)
        },
        removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
            state.cartData = state.cartData.filter(
                item => item._id.toString() !== action.payload.toString()
            );
            cartSlice.caseReducers.calculateTotals(state)
        },

        calculateTotals:(state)=>{
            state.subTotal = state.cartData.reduce((sum,item)=>sum+ Number(item.sellingprice)*item.quantity,0)
            state.deliveryFee = state.subTotal>100?0 : 40
            state.finalTotal = state.subTotal + state.deliveryFee
        }
    }
})

export const {addToCart,increaseQunatity,decreaseQunatity,removeFromCart,calculateTotals} = cartSlice.actions
export default cartSlice.reducer
