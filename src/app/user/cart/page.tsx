'use client'
import { ArrowLeft, ShoppingBasket, Minus, Plus, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { increaseQunatity, decreaseQunatity, removeFromCart } from '@/redux/cartSlice';
import Image from 'next/image';
import { useState } from 'react';
import mongoose from 'mongoose';
import { useRouter } from 'next/navigation';

interface IGrocery{
    _id: mongoose.Types.ObjectId;
    name: string;
    category: string;
    size: string;
    description?: string;
    originalprice: string;
    sellingprice: string;
    unit: string;
    image: string;
    quantity: number;
}

function CartPage() {
    const dispatch = useDispatch<AppDispatch>()
    const {cartData} = useSelector((state:RootState)=>state.cart)
    const [selectedItem, setSelectedItem] = useState<IGrocery | null>(null)
    const router = useRouter()
    
    // Calculate totals
    const total = cartData.reduce((sum, item) => sum + (Number(item.sellingprice) * item.quantity), 0)
    const originalTotal = cartData.reduce((sum, item) => sum + (Number(item.originalprice) * item.quantity), 0)
    const totalSavings = originalTotal - total
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0)
    
  return (
    <div className='w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 mb-24 relative'>
        <Link href={"/"} className='absolute -top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-all'>
            <ArrowLeft size={20} />
            <span className='hidden sm:inline'>Back to Home</span>
        </Link>
        
        <motion.h2
            initial={{opacity:0,y:10}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.3}}
            className='text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
        >
            Your Shopping Cart 🛒
        </motion.h2>
        
        {cartData.length==0 ?(
            <motion.div
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                transition={{duration:0.3}}
                className='text-center py-20 bg-white rounded-2xl shadow-md'
            >
                <ShoppingBasket className='w-16 h-16 text-gray-400 mx-auto mb-4'/>
                <p className='text-gray-600 text-lg mb-6'>Your cart is empty. Add some items to continue shopping!</p>
                <Link href={"/"} className='bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium'>
                    Continue Shopping
                </Link>
            </motion.div>
        ):(
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Cart Items */}
                <div className='lg:col-span-2 space-y-4'>
                    <AnimatePresence>
                        {cartData.map((item)=>{
                            const itemDiscount = Math.round(((Number(item.originalprice) - Number(item.sellingprice)) / Number(item.originalprice)) * 100)
                            
                            return (
                            <motion.div
                                key={item._id.toString()}
                                initial={{opacity:0,y:30}}
                                animate={{opacity:1,y:0}}
                                exit={{opacity:0,x:-100}}
                                transition={{duration:0.3}}
                                className='flex flex-row items-center gap-3 sm:gap-4 bg-white rounded-2xl shadow-md p-3 sm:p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 relative cursor-pointer'
                                onClick={() => setSelectedItem(item)}
                            >
                                {/* Product Image */}
                                <div className='relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50'>
                                    <Image 
                                        src={item.image} 
                                        alt={item.name} 
                                        fill 
                                        className='object-contain p-2 transition-transform duration-300 hover:scale-105'
                                    />
                                </div>
                                
                                {/* Product Info */}
                                <div className='flex-1 text-left'>
                                    <h3 className='text-sm sm:text-lg font-semibold text-gray-800 mb-1 line-clamp-1'>
                                        {item.name}
                                    </h3>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-0.5 mb-2 w-fit'>
                                        {item.size} {item.unit}
                                    </p>
                                    
                                    {/* Price Section */}
                                    <div className='flex flex-col gap-0.5'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray-400 line-through text-xs sm:text-sm'>
                                                ₹{Number(item.originalprice) * item.quantity}
                                            </span>
                                            <span className='text-green-700 font-bold text-base sm:text-lg'>
                                                ₹{Number(item.sellingprice) * item.quantity}
                                            </span>
                                            {/* Discount Badge next to price */}
                                            {itemDiscount > 0 && (
                                                <span className='bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                                                    {itemDiscount}% OFF
                                                </span>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2 text-xs flex-wrap'>
                                            <span className='text-gray-500'>₹{item.sellingprice} each</span>
                                            {itemDiscount > 0 && (
                                                <span className='text-green-600 font-medium'>
                                                    Save ₹{(Number(item.originalprice) - Number(item.sellingprice)) * item.quantity}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Quantity Controls & Remove Button */}
                                <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4' onClick={(e) => e.stopPropagation()}>
                                    <div className='flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-full py-1.5 px-2 sm:py-2 sm:px-3'>
                                        <motion.button 
                                            whileTap={{scale:0.9}}
                                            onClick={()=>dispatch(decreaseQunatity(item._id))}
                                            className='w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-all'
                                        >
                                            <Minus size={14} className='sm:w-4 sm:h-4' />
                                        </motion.button>
                                        
                                        <span className='text-sm font-bold text-gray-800 min-w-20px text-center'>
                                            {item.quantity}
                                        </span>
                                        
                                        <motion.button 
                                            whileTap={{scale:0.9}}
                                            onClick={()=>dispatch(increaseQunatity(item._id))}
                                            className='w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-all'
                                        >
                                            <Plus size={14} className='sm:w-4 sm:h-4' />
                                        </motion.button>
                                    </div>
                                    
                                    {/* Remove Button */}
                                    <motion.button
                                        whileTap={{scale:0.9}}
                                        onClick={()=>dispatch(removeFromCart(item._id))}
                                        className='w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all'
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} className='sm:w-[18px] sm:h-[18px]' />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )})}
                    </AnimatePresence>
                </div>
                
                {/* Order Summary */}
                <div className='lg:col-span-1'>
                    <motion.div
                        initial={{opacity:0,y:20}}
                        animate={{opacity:1,y:0}}
                        transition={{duration:0.4}}
                        className='bg-white rounded-2xl shadow-md p-6 sticky top-4'
                    >
                        <h3 className='text-xl font-bold text-gray-800 mb-4'>Order Summary</h3>
                        
                        <div className='space-y-3 mb-4'>
                            <div className='flex justify-between text-gray-600'>
                                <span>Items ({totalItems})</span>
                                <span className='line-through'>₹{originalTotal.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between text-green-600 font-medium'>
                                <span>Discount</span>
                                <span>-₹{totalSavings.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <div className='border-t pt-3 flex justify-between text-lg font-bold text-gray-800'>
                                <span>Total</span>
                                <span className='text-green-700'>₹{total.toFixed(2)}</span>
                            </div>
                            {totalSavings > 0 && (
                                <div className='bg-green-50 border border-green-200 rounded-lg p-3 mt-3'>
                                    <p className='text-green-700 text-sm font-medium text-center'>
                                        🎉 You're saving ₹{totalSavings.toFixed(2)} on this order!
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <motion.button
                            whileTap={{scale:0.98}}
                            className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full transition-all shadow-md hover:shadow-lg mb-4 cursor-pointer'
                            onClick={()=>router.push("/user/checkout")}
                        >
                            Proceed to Checkout
                        </motion.button>
                        
                        <Link 
                            href="/" 
                            className='block text-center text-green-600 hover:text-green-700 font-medium transition-colors'
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            </div>
        )}

        {/* Product Modal */}
        <AnimatePresence>
            {selectedItem && (
                <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    exit={{opacity:0}}
                    className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
                    onClick={() => setSelectedItem(null)}
                >
                    <motion.div
                        initial={{scale:0.9, opacity:0}}
                        animate={{scale:1, opacity:1}}
                        exit={{scale:0.9, opacity:0}}
                        transition={{duration:0.2}}
                        className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className='absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all z-10'
                        >
                            <X size={20} className='text-gray-600' />
                        </button>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
                            {/* Image Section */}
                            <div className='relative aspect-square bg-gray-50 rounded-xl overflow-hidden'>
                                <Image src={selectedItem.image} alt={selectedItem.name} fill className='object-contain p-4'/>
                                {Math.round(((Number(selectedItem.originalprice) - Number(selectedItem.sellingprice)) / Number(selectedItem.originalprice)) * 100) > 0 && (
                                    <div className='absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md'>
                                        {Math.round(((Number(selectedItem.originalprice) - Number(selectedItem.sellingprice)) / Number(selectedItem.originalprice)) * 100)}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className='flex flex-col'>
                                <p className='text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide'>{selectedItem.category}</p>
                                <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-3'>{selectedItem.name}</h2>
                                
                                {/* Size Badge */}
                                <div className='text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap w-fit mb-4'>
                                    {selectedItem.size} {selectedItem.unit}
                                </div>

                                {/* Price Section */}
                                <div className='mb-4'>
                                    <div className='flex items-center gap-3 mb-1'>
                                        <span className='text-gray-400 line-through text-lg'>₹{selectedItem.originalprice}</span>
                                        <span className='text-green-700 font-bold text-3xl'>₹{selectedItem.sellingprice}</span>
                                    </div>
                                    <p className='text-green-600 text-sm font-medium'>You save ₹{Number(selectedItem.originalprice) - Number(selectedItem.sellingprice)}</p>
                                </div>

                                {/* Description */}
                                {selectedItem.description && (
                                    <div className='mb-6'>
                                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Description</h3>
                                        <p className='text-gray-600 text-sm leading-relaxed'>{selectedItem.description}</p>
                                    </div>
                                )}

                                {/* Add to Cart Section */}
                                <div className='mt-auto'>
                                    <motion.div
                                        initial = {{opacity:0,y:10}}
                                        animate={{opacity:1,y:0}}
                                        transition={{duration:0.3}}
                                        className='flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-full py-3 px-6 gap-4'
                                    >
                                        <button 
                                            className='w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-all' 
                                            onClick={()=>dispatch(decreaseQunatity(selectedItem._id))}
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xl font-bold text-gray-800'>{selectedItem.quantity}</span>
                                            <span className='text-xs text-green-600 font-medium'>in cart</span>
                                        </div>
                                        <button 
                                            className='w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-all' 
                                            onClick={()=>dispatch(increaseQunatity(selectedItem._id))}
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  )
}

export default CartPage