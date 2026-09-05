'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Truck, CheckCircle2 } from 'lucide-react'

interface FreeDeliveryBarProps {
    subTotal: number;
    threshold?: number;
    className?: string;
}

export default function FreeDeliveryBar({ subTotal, threshold = 100, className = "" }: FreeDeliveryBarProps) {
    const remaining = Math.max(0, threshold - subTotal)
    const percentage = Math.min(100, Math.round((subTotal / threshold) * 100))
    const isUnlocked = subTotal >= threshold

    return (
        <div className={`bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border border-emerald-100 rounded-2xl p-3.5 shadow-xs ${className}`}>
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                <div className="flex items-center gap-1.5">
                    {isUnlocked ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-800 font-semibold">
                                🎉 You&apos;ve unlocked <strong className="text-emerald-700 font-bold">FREE Express Delivery!</strong>
                            </span>
                        </>
                    ) : (
                        <>
                            <Truck className="w-4 h-4 text-emerald-600 animate-bounce" />
                            <span className="text-gray-700">
                                Add <strong className="text-emerald-700 font-bold">₹{remaining}</strong> more for <span className="text-emerald-700 font-semibold">FREE Delivery</span>
                            </span>
                        </>
                    )}
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {percentage}%
                </span>
            </div>

            <div className="w-full bg-gray-200/80 h-2.5 rounded-full overflow-hidden relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            </div>
        </div>
    )
}
