'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Copy, Check, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FlashDealBanner() {
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 })
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                }
                return { hours: 2, minutes: 59, seconds: 59 }
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatNum = (n: number) => n.toString().padStart(2, '0')

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 text-white py-2 px-3 sm:px-6 shadow-md text-xs sm:text-sm font-medium relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center bg-yellow-400 text-emerald-950 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        <Zap className="w-3 h-3 mr-0.5 fill-current" /> Flash Deal
                    </span>
                    <span className="hidden sm:inline text-white/90">
                        Get flat 20% OFF on all fresh farm produce!
                    </span>
                    <span className="sm:hidden text-white/90">
                        20% OFF Fresh Produce!
                    </span>
                </div>

                {/* Countdown & Coupon code */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-mono bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-lg text-emerald-100 text-[11px] sm:text-xs border border-white/10">
                        <span className="font-bold text-white">{formatNum(timeLeft.hours)}</span>:
                        <span className="font-bold text-white">{formatNum(timeLeft.minutes)}</span>:
                        <span className="font-bold text-white">{formatNum(timeLeft.seconds)}</span>
                    </div>

                    <button
                        onClick={() => handleCopyCode("FRESH20")}
                        className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white border border-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                        title="Copy Coupon Code"
                    >
                        <span>Code: <strong className="text-yellow-300">FRESH20</strong></span>
                        {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5 opacity-80" />}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
