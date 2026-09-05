'use client'
import { easeInOut, motion } from "framer-motion"
import { ArrowRight, CheckCircle, Package } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { clearCart } from "@/redux/cartSlice"
import { removeCoupon } from "@/redux/couponSlice"

function OrderSuccess() {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(clearCart())
        dispatch(removeCoupon())
    }, [dispatch])

    return (
        <div className='flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-gradient-to-b from-emerald-50 via-green-50 to-white'>
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 100
                }}
                className="relative"
            >
                <CheckCircle className="text-emerald-600 w-24 h-24 md:w-28 md:h-28" />
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0.3, 0, 0.3], scale: [1, 0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <div className="w-full h-full rounded-full bg-emerald-700 blur-2xl" />
                </motion.div>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-3xl md:text-4xl font-extrabold text-emerald-800 mt-6"
            >
                Order Placed Successfully! 🎉
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="text-gray-600 mt-4 text-sm md:text-base max-w-md"
            >
                Thank you for shopping with SnapCart! Your fresh groceries are being packed and will be delivered shortly. You can track your live order progress in <span className="font-bold text-emerald-700">My Orders</span>.
            </motion.p>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: [0, -10, 0], opacity: 1 }}
                transition={{ delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-10"
            >
                <Package className="w-16 h-16 md:w-20 md:h-20 text-emerald-500" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="mt-12 flex flex-col sm:flex-row gap-3"
            >
                <Link href={"/user/my-orders"}>
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.93 }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-base font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer"
                    >
                        <span>Go To My Orders</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.div>
                </Link>

                <Link href={"/"}>
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.93 }}
                        className="flex items-center justify-center gap-2 bg-white text-emerald-700 border border-emerald-200 text-base font-bold px-8 py-3.5 rounded-2xl shadow-sm hover:bg-emerald-50 transition-all cursor-pointer"
                    >
                        <span>Continue Shopping</span>
                    </motion.div>
                </Link>
            </motion.div>
        </div>
    )
}

export default OrderSuccess