'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export default function FloatingMobileCart() {
    const { cartData, subTotal } = useSelector((state: RootState) => state.cart)
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0)

    if (totalItems === 0) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md md:hidden"
            >
                <Link
                    href="/user/cart"
                    className="flex items-center justify-between bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white p-3.5 rounded-2xl shadow-xl shadow-emerald-900/30 border border-emerald-400/30 active:scale-98 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-xs">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-emerald-100">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
                            </p>
                            <p className="text-sm font-bold text-white">
                                ₹{subTotal} <span className="text-[10px] font-normal text-emerald-200">+ taxes/delivery</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white text-emerald-700 font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm">
                        <span>View Cart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </Link>
            </motion.div>
        </AnimatePresence>
    )
}
