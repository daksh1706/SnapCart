'use client'
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, X, Heart, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, decreaseQunatity, increaseQunatity } from '@/redux/cartSlice';
import { toggleWishlist } from '@/redux/wishlistSlice';
import { useState } from 'react';

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
    createdAt?: string;
    updatedAt?: string;
}

function GroceryItemCard({ item }: { item: IGrocery }) {
    const dispatch = useDispatch<AppDispatch>()
    const { cartData } = useSelector((state: RootState) => state.cart)
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist)
    const isWishlisted = wishlistItems.some(w => w._id === item._id)
    const cartItem = cartData.find(i => i._id == item._id)
    const [showModal, setShowModal] = useState(false)

    // Calculate discount percentage
    const discountPercentage = Math.round(
        ((Number(item.originalprice) - Number(item.sellingprice)) / Number(item.originalprice)) * 100
    )

    // Deterministic dietary badge & rating based on item ID/category
    const rating = 4.5 + ((item.name.charCodeAt(0) % 5) / 10)
    const reviewCount = 28 + (item.name.charCodeAt(item.name.length - 1) % 80)
    const isOrganic = item.category.toLowerCase().includes('fruit') || item.category.toLowerCase().includes('vegetable')

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch(toggleWishlist({
            _id: item._id,
            name: item.name,
            category: item.category,
            size: item.size,
            originalprice: item.originalprice,
            sellingprice: item.sellingprice,
            unit: item.unit,
            image: item.image,
            description: item.description
        }))
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
                className='bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer group relative'
                onClick={() => setShowModal(true)}
            >
                {/* Image & Badges */}
                <div className='relative w-full aspect-4/3 bg-gray-50/70 overflow-hidden'>
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes='(max-width:768px) 100vw 25vw'
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2.5 left-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer ${
                            isWishlisted
                                ? 'bg-red-50 text-red-500 shadow-md scale-105'
                                : 'bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 shadow-xs'
                        }`}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                    </button>

                    {/* Discount & Dietary Badges */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-10">
                        {discountPercentage > 0 && (
                            <span className='bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md'>
                                {discountPercentage}% OFF
                            </span>
                        )}
                        {isOrganic && (
                            <span className='bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5'>
                                <Sparkles className="w-2.5 h-2.5" /> Farm Fresh
                            </span>
                        )}
                    </div>
                </div>

                {/* Card Content */}
                <div className='p-4 flex flex-col flex-1 justify-between'>
                    <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                            <span className='text-[11px] text-emerald-700 font-bold tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded-md'>
                                {item.category}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{rating.toFixed(1)}</span>
                            </div>
                        </div>

                        <h3 className='text-sm sm:text-base font-bold text-gray-800 line-clamp-2 mt-1 group-hover:text-emerald-700 transition-colors'>
                            {item.name}
                        </h3>
                    </div>

                    <div className="mt-3">
                        <div className='flex items-center justify-between gap-2'>
                            <div className='text-xs font-semibold text-gray-600 bg-gray-100/90 px-2.5 py-1 rounded-lg'>
                                {item.size} {item.unit}
                            </div>

                            {/* Price Section */}
                            <div className='flex flex-col items-end'>
                                {discountPercentage > 0 && (
                                    <span className='text-gray-400 line-through text-[11px]'>₹{item.originalprice}</span>
                                )}
                                <span className='text-emerald-700 font-extrabold text-base sm:text-lg'>
                                    ₹{item.sellingprice}
                                </span>
                            </div>
                        </div>

                        {/* Add / Quantity Controls */}
                        {!cartItem ? (
                            <motion.button
                                className='mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-98 text-white rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md cursor-pointer'
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    dispatch(addToCart({ ...item, quantity: 1 }))
                                }}
                            >
                                <ShoppingCart className='w-4 h-4' />
                                <span>Add to Cart</span>
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className='mt-3 flex items-center justify-between bg-emerald-50/90 border border-emerald-300 rounded-xl py-1.5 px-3'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className='w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        dispatch(decreaseQunatity(item._id))
                                    }}
                                >
                                    <Minus size={14} />
                                </button>
                                <span className='text-sm font-extrabold text-emerald-950'>{cartItem.quantity}</span>
                                <button
                                    className='w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        dispatch(increaseQunatity(item._id))
                                    }}
                                >
                                    <Plus size={14} />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4'
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className='bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative'
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className='absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10 text-gray-700 cursor-pointer'
                            >
                                <X size={18} />
                            </button>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8'>
                                {/* Image Section */}
                                <div className='relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100'>
                                    <Image src={item.image} alt={item.name} fill className='object-cover p-2' />
                                    {discountPercentage > 0 && (
                                        <div className='absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md'>
                                            {discountPercentage}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Details Section */}
                                <div className='flex flex-col justify-between'>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className='text-xs text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md'>
                                                {item.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span>{rating.toFixed(1)} ({reviewCount} reviews)</span>
                                            </div>
                                        </div>

                                        <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>{item.name}</h2>

                                        {/* Pack Size */}
                                        <div className='text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg w-fit mt-2'>
                                            Pack: {item.size} {item.unit}
                                        </div>

                                        {/* Price Section */}
                                        <div className='mt-4 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100'>
                                            <div className='flex items-baseline gap-2'>
                                                <span className='text-emerald-700 font-extrabold text-2xl'>₹{item.sellingprice}</span>
                                                {discountPercentage > 0 && (
                                                    <span className='text-gray-400 line-through text-sm'>₹{item.originalprice}</span>
                                                )}
                                            </div>
                                            {discountPercentage > 0 && (
                                                <p className='text-emerald-700 text-xs font-semibold mt-0.5'>
                                                    You save ₹{Number(item.originalprice) - Number(item.sellingprice)} ({discountPercentage}% OFF)
                                                </p>
                                            )}
                                        </div>

                                        {/* Trust features */}
                                        <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                <span>100% Quality Checked & Farm Sourced</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                                <span>Delivered in 10-15 Minutes</span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <div className='mt-4'>
                                                <h3 className='text-xs font-bold text-gray-700 uppercase tracking-wider mb-1'>Details</h3>
                                                <p className='text-gray-600 text-xs leading-relaxed'>{item.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className='mt-6 pt-4 border-t border-gray-100 flex items-center gap-3'>
                                        <button
                                            onClick={handleWishlistToggle}
                                            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                                                isWishlisted
                                                    ? 'bg-red-50 border-red-200 text-red-500'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                                            }`}
                                            title="Wishlist"
                                        >
                                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                        </button>

                                        {!cartItem ? (
                                            <motion.button
                                                className='flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl py-3 px-6 text-sm font-bold shadow-md cursor-pointer'
                                                whileTap={{ scale: 0.96 }}
                                                onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                                            >
                                                <ShoppingCart className='w-4 h-4' />
                                                Add to Cart
                                            </motion.button>
                                        ) : (
                                            <div className='flex-1 flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-2xl py-2 px-4'>
                                                <button
                                                    className='w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer'
                                                    onClick={() => dispatch(decreaseQunatity(item._id))}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className='text-base font-extrabold text-emerald-950'>{cartItem.quantity} in cart</span>
                                                <button
                                                    className='w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer'
                                                    onClick={() => dispatch(increaseQunatity(item._id))}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default GroceryItemCard