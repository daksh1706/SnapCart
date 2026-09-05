'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, RotateCcw, ShoppingBag, Truck, UserCheck } from 'lucide-react'
import Image from 'next/image'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/types/index'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { addToCart } from '@/redux/cartSlice'

export interface IOrder {
    _id?: string;
    id?: string;
    user: string;
    items: [
        {
            product: string;
            name: string;
            sellingPrice: string;
            size: string;
            unit: string;
            image: string;
            quantity: number;
        }
    ];
    isPaid: boolean;
    totalAmount: number;
    paymentMethod: "cod" | "online";
    address: {
        fullName: string;
        mobile: string;
        city: string;
        state: string;
        pincode: string;
        fullAddress: string;
        latitude: number;
        longitude: number;
    };
    assignment?: string;
    assignedDeliveryBoy?: IUser;
    status: "pending" | "out for delivery" | "delivered";
    createdAt?: string;
    updatedAt?: string;
}

function UserOrderCard({ order }: { order: IOrder }) {
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState(order.status)
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-100 text-amber-800 border-amber-300"
            case "out for delivery":
                return "bg-blue-100 text-blue-800 border-blue-300"
            case "delivered":
                return "bg-emerald-100 text-emerald-800 border-emerald-300"
            default:
                return "bg-gray-100 text-gray-700 border-gray-300"
        }
    }

    useEffect((): any => {
        const socket = getSocket()
        socket.on("order-status-update", (data) => {
            if (data.orderId == order._id) {
                setStatus(data.status)
            }
        })
        return () => socket.off("order-status-update")
    }, [order._id])

    const handleReorder = (e: React.MouseEvent) => {
        e.stopPropagation()
        order.items.forEach(item => {
            dispatch(addToCart({
                _id: item.product || String(Math.random()),
                name: item.name,
                category: "Reordered",
                size: item.size,
                originalprice: String(Number(item.sellingPrice) * 1.1),
                sellingprice: item.sellingPrice,
                unit: item.unit,
                image: item.image,
                quantity: item.quantity || 1
            }))
        })
        router.push("/user/cart")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden'
        >
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-gradient-to-r from-emerald-50/70 to-white'>
                <div>
                    <h3 className='text-sm sm:text-base font-bold text-gray-900'>
                        Order <span className='text-emerald-700 font-extrabold'>#{order?._id?.toString().slice(-8).toUpperCase()}</span>
                    </h3>
                    <p className='text-xs text-gray-400 mt-0.5'>{new Date(order.createdAt!).toLocaleString()}</p>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    {status !== "delivered" && (
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${order.isPaid ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-amber-100 text-amber-800 border-amber-300"}`}>
                            {order.isPaid ? "Paid Online" : "COD (Unpaid)"}
                        </span>
                    )}

                    <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-full capitalize ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className='p-5 space-y-4'>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
                    <div className='flex items-center gap-2'>
                        {order.paymentMethod === "cod" ? (
                            <>
                                <Truck size={16} className='text-emerald-600' />
                                <span>Cash On Delivery</span>
                            </>
                        ) : (
                            <>
                                <CreditCard size={16} className='text-emerald-600' />
                                <span>Stripe Online Payment</span>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleReorder}
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Items</span>
                    </button>
                </div>

                {order.assignedDeliveryBoy && status !== "delivered" && (
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                                    <UserCheck size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{order.assignedDeliveryBoy.name}</p>
                                    <p className="text-xs text-gray-500">Delivery Partner</p>
                                </div>
                            </div>
                            <a
                                href={`tel:${order.assignedDeliveryBoy.mobile}`}
                                className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl hover:bg-emerald-700 shadow-xs transition cursor-pointer"
                            >
                                Call Partner
                            </a>
                        </div>
                        <button
                            className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer'
                            onClick={() => router.push(`/user/track-order/${order._id?.toString()}`)}
                        >
                            <Truck size={16} /> Track Live Delivery
                        </button>
                    </div>
                )}

                {/* Address */}
                <div className='flex items-start gap-2 text-gray-600 text-xs sm:text-sm bg-gray-50/70 p-3 rounded-2xl'>
                    <MapPin size={16} className='text-emerald-600 shrink-0 mt-0.5' />
                    <span>{order.address.fullAddress}, {order.address.city}, {order.address.pincode}</span>
                </div>

                {/* Items Dropdown */}
                <div className='border-t pt-3 border-gray-100'>
                    <button
                        onClick={() => setExpanded(prev => !prev)}
                        className='w-full flex justify-between items-center text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-700 transition cursor-pointer'
                    >
                        <span className='flex items-center gap-2'>
                            <Package size={16} className='text-emerald-600' />
                            {expanded ? "Hide Items" : `View ${order.items.length} Order Items`}
                        </span>
                        {expanded ? <ChevronUp size={16} className='text-emerald-600' /> : <ChevronDown size={16} className='text-emerald-600' />}
                    </button>

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: expanded ? "auto" : 0,
                            opacity: expanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className='overflow-hidden'
                    >
                        <div className='mt-3 space-y-2'>
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className='flex justify-between items-center bg-gray-50/80 rounded-2xl p-2.5 hover:bg-emerald-50/30 transition'
                                >
                                    <div className='flex items-center gap-3'>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={42}
                                            height={42}
                                            className='rounded-xl object-cover border border-gray-100'
                                        />
                                        <div>
                                            <p className='text-xs sm:text-sm font-bold text-gray-800'>{item.name}</p>
                                            <p className='text-[11px] text-gray-400'>
                                                {item.quantity ? `${item.quantity} x ` : 'x'}{item.size} {item.unit}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='text-xs sm:text-sm font-extrabold text-emerald-700'>
                                        ₹{Number(item.sellingPrice) * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Total */}
                <div className='border-t pt-3 border-gray-100 flex justify-between items-center text-xs sm:text-sm font-bold text-gray-800'>
                    <div className='flex items-center gap-1.5 text-gray-500'>
                        <Truck size={14} className='text-emerald-600' />
                        <span>Status: <strong className='text-emerald-700 capitalize'>{status}</strong></span>
                    </div>
                    <div>
                        Grand Total: <span className='text-emerald-700 font-black text-base'>₹{order.totalAmount}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default UserOrderCard