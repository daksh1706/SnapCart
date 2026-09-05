'use client'
import { ArrowLeft, ShoppingBasket, Minus, Plus, Trash2, X, Tag, Check, Sparkles, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { increaseQunatity, decreaseQunatity, removeFromCart } from '@/redux/cartSlice';
import { setDbCoupons, setAppliedCouponSuccess, setCouponError, removeCoupon } from '@/redux/couponSlice';
import FreeDeliveryBar from '@/components/FreeDeliveryBar';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface IGrocery {
    _id: string;
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
    const { cartData } = useSelector((state: RootState) => state.cart)
    const { dbCoupons, appliedCoupon, discountAmount, error: couponError } = useSelector((state: RootState) => state.coupon)
    const [selectedItem, setSelectedItem] = useState<IGrocery | null>(null)
    const [couponInput, setCouponInput] = useState('')
    const [applyingCode, setApplyingCode] = useState(false)
    const router = useRouter()

    // Calculate totals
    const subTotal = cartData.reduce((sum, item) => sum + (Number(item.sellingprice) * item.quantity), 0)
    const originalTotal = cartData.reduce((sum, item) => sum + (Number(item.originalprice) * item.quantity), 0)
    const catalogSavings = originalTotal - subTotal
    const actualDeliveryFee = appliedCoupon?.discountType === 'free_delivery' ? 0 : (subTotal >= 100 ? 0 : 40)
    const finalBill = Math.max(0, subTotal + actualDeliveryFee - discountAmount)
    const totalSavings = catalogSavings + discountAmount + (subTotal >= 100 ? 40 : 0)
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0)

    // Fetch available coupons from database
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await axios.get('/api/coupons')
                if (res.data?.coupons) {
                    dispatch(setDbCoupons(res.data.coupons))
                }
            } catch (err) {
                console.error("Error fetching coupons:", err)
            }
        }
        fetchCoupons()
    }, [dispatch])

    const handleApplyCode = async (code: string) => {
        if (!code.trim()) return
        setApplyingCode(true)
        try {
            const res = await axios.post('/api/coupons', {
                code: code.trim().toUpperCase(),
                subTotal
            })
            if (res.data?.valid) {
                dispatch(setAppliedCouponSuccess({
                    coupon: res.data.coupon,
                    discountAmount: res.data.discountAmount
                }))
                setCouponInput('')
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to apply coupon'
            dispatch(setCouponError(message))
        } finally {
            setApplyingCode(false)
        }
    }

    return (
        <div className='w-[95%] sm:w-[90%] md:w-[85%] max-w-7xl mx-auto mt-6 mb-24 relative'>
            <Link
                href={"/"}
                className='inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-xs sm:text-sm transition-all mb-4 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100'
            >
                <ArrowLeft size={16} />
                <span>Continue Shopping</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='mb-6'
            >
                <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight'>
                    Your Shopping Cart 🛒
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                    Review your items, apply database coupons (1 use per user), and proceed to express checkout.
                </p>
            </motion.div>

            {cartData.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto p-8'
                >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBasket className='w-10 h-10' />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h3>
                    <p className='text-gray-500 text-sm mb-6'>
                        Looks like you haven&apos;t added any fresh groceries yet. Discover fresh fruits, vegetables, and essentials now!
                    </p>
                    <Link
                        href={"/"}
                        className='bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:from-emerald-700 hover:to-green-700 shadow-md font-bold text-sm inline-flex items-center gap-2'
                    >
                        <span>Start Shopping</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
                    {/* Cart Items List */}
                    <div className='lg:col-span-2 space-y-4'>
                        {/* Free Delivery Goal Bar */}
                        <FreeDeliveryBar subTotal={subTotal} threshold={100} />

                        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <span className="text-sm font-bold text-gray-800">
                                    Cart Items ({totalItems})
                                </span>
                                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                                    ⚡ 10-15 Min Delivery
                                </span>
                            </div>

                            <AnimatePresence>
                                {cartData.map((item) => {
                                    const itemDiscount = Math.round(
                                        ((Number(item.originalprice) - Number(item.sellingprice)) / Number(item.originalprice)) * 100
                                    )

                                    return (
                                        <motion.div
                                            key={item._id.toString()}
                                            layout
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.2 }}
                                            className='flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-gray-50/60 hover:bg-emerald-50/30 transition-all border border-gray-100 cursor-pointer'
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            {/* Product Image */}
                                            <div className='relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-white border border-gray-100'>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className='object-cover p-1'
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='text-xs sm:text-sm font-bold text-gray-900 truncate'>
                                                    {item.name}
                                                </h3>
                                                <p className='text-[11px] text-gray-500 font-medium'>
                                                    {item.size} {item.unit}
                                                </p>

                                                <div className='flex items-center gap-2 mt-1'>
                                                    <span className='text-emerald-700 font-bold text-sm sm:text-base'>
                                                        ₹{Number(item.sellingprice) * item.quantity}
                                                    </span>
                                                    {itemDiscount > 0 && (
                                                        <span className='text-gray-400 line-through text-xs'>
                                                            ₹{Number(item.originalprice) * item.quantity}
                                                        </span>
                                                    )}
                                                    {itemDiscount > 0 && (
                                                        <span className='bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.2 rounded'>
                                                            {itemDiscount}% off
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity Controls & Delete */}
                                            <div
                                                className='flex items-center gap-2 sm:gap-3 shrink-0'
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className='flex items-center gap-2 bg-emerald-50 border border-emerald-300 rounded-xl py-1 px-2'>
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => dispatch(decreaseQunatity(item._id))}
                                                        className='w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer'
                                                    >
                                                        <Minus size={12} />
                                                    </motion.button>

                                                    <span className='text-xs sm:text-sm font-extrabold text-emerald-950 min-w-16px text-center'>
                                                        {item.quantity}
                                                    </span>

                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => dispatch(increaseQunatity(item._id))}
                                                        className='w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer'
                                                    >
                                                        <Plus size={12} />
                                                    </motion.button>
                                                </div>

                                                <button
                                                    onClick={() => dispatch(removeFromCart(item._id))}
                                                    className='w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all cursor-pointer'
                                                    title="Remove"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Database Coupons Offers Strip */}
                        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <Tag className="w-4 h-4 text-emerald-600" />
                                    <span>Available Store Coupons (1 Use Per User)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {dbCoupons.map((coupon) => {
                                    const isApplied = appliedCoupon?.code === coupon.code
                                    const isUsed = coupon.isUsedByMe || coupon.alreadyUsed
                                    return (
                                        <div
                                            key={coupon.code}
                                            onClick={() => {
                                                if (!isUsed) handleApplyCode(coupon.code)
                                            }}
                                            className={`p-3 rounded-2xl border text-left transition-all ${
                                                isUsed
                                                    ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                                                    : isApplied
                                                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 cursor-pointer'
                                                    : 'bg-gray-50/70 hover:bg-emerald-50/40 border-gray-200 cursor-pointer'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md border ${isUsed ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-white text-emerald-700 border-emerald-200'}`}>
                                                    {coupon.code}
                                                </span>
                                                {isUsed ? (
                                                    <span className="text-[10px] font-bold text-gray-500">
                                                        Already Used
                                                    </span>
                                                ) : isApplied ? (
                                                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                                                        <Check className="w-3 h-3" /> Applied
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="text-[11px] text-gray-600 font-medium line-clamp-2">
                                                {coupon.description}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Manual Coupon Input */}
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code (e.g. WELCOME50)"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    className="flex-1 uppercase font-mono text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                                <button
                                    onClick={() => handleApplyCode(couponInput)}
                                    disabled={!couponInput.trim() || applyingCode}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                >
                                    {applyingCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                                </button>
                            </div>

                            {couponError && (
                                <p className="text-xs text-red-500 mt-2 font-medium">
                                    {couponError}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary & Bill Breakdown */}
                    <div className='lg:col-span-1'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-4'
                        >
                            <h3 className='text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3'>
                                Bill Details
                            </h3>

                            <div className='space-y-2.5 text-xs sm:text-sm'>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Item Total (Catalog Price)</span>
                                    <span className='line-through text-gray-400'>₹{originalTotal.toFixed(2)}</span>
                                </div>

                                <div className='flex justify-between text-gray-700 font-medium'>
                                    <span>Subtotal</span>
                                    <span>₹{subTotal.toFixed(2)}</span>
                                </div>

                                <div className='flex justify-between text-emerald-700 font-semibold'>
                                    <span>Catalog Discount</span>
                                    <span>-₹{catalogSavings.toFixed(2)}</span>
                                </div>

                                {appliedCoupon && (
                                    <div className='flex justify-between items-center text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200'>
                                        <div className="flex items-center gap-1">
                                            <Tag className="w-3.5 h-3.5" />
                                            <span>Coupon ({appliedCoupon.code})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>-₹{discountAmount}</span>
                                            <button
                                                onClick={() => dispatch(removeCoupon())}
                                                className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                                                title="Remove Coupon"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className='flex justify-between text-gray-700'>
                                    <span>Delivery Partner Fee</span>
                                    {actualDeliveryFee === 0 ? (
                                        <span className='text-emerald-700 font-bold uppercase'>FREE</span>
                                    ) : (
                                        <span>₹{actualDeliveryFee}</span>
                                    )}
                                </div>

                                <div className='border-t border-gray-200 pt-3 flex justify-between text-base sm:text-lg font-extrabold text-gray-900'>
                                    <span>To Pay</span>
                                    <span className='text-emerald-700 font-black'>₹{finalBill.toFixed(2)}</span>
                                </div>
                            </div>

                            {totalSavings > 0 && (
                                <div className='bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2'>
                                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <p className='text-emerald-800 text-xs font-bold'>
                                        🎉 Total Savings: ₹{totalSavings.toFixed(2)} on this order!
                                    </p>
                                </div>
                            )}

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                className='w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer'
                                onClick={() => router.push("/user/checkout")}
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Safe & Secure SSL Encrypted Checkout</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage