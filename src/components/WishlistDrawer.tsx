'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { removeFromWishlist, clearWishlist } from '@/redux/wishlistSlice'
import { addToCart } from '@/redux/cartSlice'

interface WishlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { items } = useSelector((state: RootState) => state.wishlist)

    const handleMoveToCart = (item: any) => {
        dispatch(addToCart({ ...item, quantity: 1 }))
        dispatch(removeFromWishlist(item._id))
    }

    const handleMoveAllToCart = () => {
        items.forEach(item => {
            dispatch(addToCart({ ...item, quantity: 1 }))
        })
        dispatch(clearWishlist())
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
                    />

                    {/* Slide Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 fill-white" />
                                <h2 className="text-lg font-bold">My Wishlist</h2>
                                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-semibold">
                                    {items.length} {items.length === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600">
                                        <Heart className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">Your wishlist is empty</h3>
                                    <p className="text-sm text-gray-400 max-w-xs">
                                        Explore our fresh groceries and tap the heart icon to save your favorite items for later!
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const discount = Math.round(
                                        ((Number(item.originalprice) - Number(item.sellingprice)) / Number(item.originalprice)) * 100
                                    )
                                    return (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex items-center gap-3 p-3 bg-gray-50/80 hover:bg-emerald-50/40 rounded-2xl border border-gray-100 transition-all group"
                                        >
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                                                <p className="text-xs text-gray-400">{item.size} {item.unit}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-bold text-emerald-700">₹{item.sellingprice}</span>
                                                    {discount > 0 && (
                                                        <span className="text-xs text-gray-400 line-through">₹{item.originalprice}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1.5 items-end">
                                                <button
                                                    onClick={() => handleMoveToCart(item)}
                                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" />
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => dispatch(removeFromWishlist(item._id))}
                                                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>

                        {/* Footer Actions */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-white space-y-2">
                                <button
                                    onClick={handleMoveAllToCart}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all cursor-pointer"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Move All to Cart
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => dispatch(clearWishlist())}
                                    className="w-full text-center text-xs text-gray-400 hover:text-red-500 py-1 font-medium transition-colors cursor-pointer"
                                >
                                    Clear Wishlist
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
