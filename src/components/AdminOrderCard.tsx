'use client'
import { getSocket } from "@/lib/socket"
import { IUser } from "@/models/user.model"
import axios from "axios"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, CreditCardIcon, MapPin, Package, Phone, Truck, User, UserCheck } from "lucide-react"
import mongoose from "mongoose"
import Image from "next/image"
import { useState, useEffect } from "react"

interface PopulatedOrder extends Omit<IOrder, 'assignedDeliveryBoy'> {
    assignedDeliveryBoy?: IUser;
}

export interface IOrder {
    _id?: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
    items: [
        {
            product: mongoose.Types.ObjectId,
            name: string,
            sellingPrice: string,
            size: string,
            unit: string,
            image: string,
            quantity: number 
        }
    ],
    isPaid: boolean,
    totalAmount: number,
    paymentMethod: "cod" | "online"
    address: {
        fullName: string,
        mobile: string,
        city: string,
        state: string,
        pincode: string,
        fullAddress: string,
        latitude: number,
        longitude: number
    }
    assignment?: mongoose.Types.ObjectId 
    assignedDeliveryBoy?: IUser
    status: "pending" | "out for delivery" | "delivered",
    createdAt?: Date,
    updatedAt?: Date
}

function AdminOrderCard({ order }: { order: IOrder }) {
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState<string>(order.status)

    useEffect(() => {
        setStatus(order.status)
    }, [order.status])

    useEffect(():any=>{
        const socket = getSocket()
        socket.on("order-status-update",(data)=>{
            if(data.orderId.toString()==order?._id?.toString()){
                setStatus(data.status)
            }
        })
        return()=>socket.off("order-status-update")
    },[order])

    const statusOptions = ["pending", "out for delivery"]

    const updateStatus = async (orderId: string, newStatus: string) => {
        const previousStatus = status;
        try {
            // Optimistic Update: Update UI immediately
            setStatus(newStatus)
            await axios.post(`/api/admin/update-order-status/${orderId}`, { status: newStatus })
        } catch (error) {
            console.error("Failed to update status:", error)
            // Revert to old status if API fails
            setStatus(previousStatus)
            alert("Failed to update order status. Please try again.")
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all"
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* User Details */}
                <div className="space-y-1">
                    <p className="text-lg font-bold flex items-center gap-2 text-green-700 ">
                        <Package size={20} />
                        Order #{order._id?.toString().slice(-11)}
                    </p>
                    
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${order.isPaid ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <p className="text-gray-500 text-sm">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                    </p>
                    <div className="mt-3 space-y-1 text-gray-700 text-sm">
                        <p className="flex items-center gap-2 font-semibold">
                            <User size={16} className="text-green-600"/>
                            <span>{order?.address?.fullName}</span>
                        </p>
                        <p className="flex items-center gap-2 font-semibold">
                            <Phone size={16} className="text-green-600"/>
                            <span>{order?.address?.mobile}</span>
                        </p>
                        <p className="flex items-center gap-2 font-semibold">
                            <MapPin size={16} className="text-green-600"/>
                            <span className="leading-tight">{order?.address?.fullAddress}, {order.address.city}, {order.address.state}, {order.address.pincode}</span>
                        </p>
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-700 mb-3">
                        <CreditCardIcon size={16} className="text-green-600"/>
                        <span>{order.paymentMethod === "cod" ? "Cash On Delivery" : "Online Payment"}</span>
                    </p>

                    {order.assignedDeliveryBoy && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                <UserCheck className="text-blue-600" size={18} />
                                <div className="font-semibold text-gray-800">
                                    <p>Assigned To: <span>{order.assignedDeliveryBoy.name}</span></p>
                                    <p className="text-xs text-gray-600">📞 +91 {order.assignedDeliveryBoy.mobile}</p>
                                </div>
                            </div>
                            <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition ml-2">Call</a>
                        </div>
                    )}
                </div>

                {/* Order Status Control */}
                <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${
                        status === "delivered"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : status === "pending"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }`}>
                        {status}
                    </span>
                    
                    {/* Only show select if not already delivered to prevent accidental changes after completion */}
                    {status !== "delivered" && (
                        <select 
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                            value={status}
                            onChange={(e) => updateStatus(order._id?.toString()!, e.target.value)}
                        >
                            {statusOptions.map(st => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Collapsible Items Section */}
            <div className='border-t pt-3 border-gray-200 mt-3'>
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    className='w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition'
                >
                    <span className='flex items-center gap-2'>
                        <Package size={16} className='text-green-600'/>
                        {expanded ? "Hide Order Items" : `Show ${order.items.length} Items`}
                    </span>
                    {expanded ? <ChevronUp size={16} className='text-green-600' /> : <ChevronDown size={16} className='text-green-600'/>}
                </button>

                <motion.div
                    initial={false}
                    animate={{
                        height: expanded ? "auto" : 0,
                        opacity: expanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className='overflow-hidden'
                >
                    <div className='mt-3 space-y-3'>
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className='flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition'
                            >
                                <div className='flex items-center gap-3'>
                                    <div className="relative w-12 h-12">
                                        <Image 
                                            src={item.image} 
                                            alt={item.name}
                                            fill
                                            className='rounded-lg object-cover border border-gray-200'
                                        />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                                        <p className='text-xs text-gray-500'>
                                            {item.quantity} x {item.size} {item.unit}
                                        </p>
                                    </div>
                                </div>
                                <div className='text-sm font-semibold text-gray-800'>
                                    ₹{Number(item.sellingPrice) * item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Info */}
                <div className='border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800 border-gray-200 mt-3'>
                    <div className='flex items-center gap-2 text-gray-700 text-sm'>
                        <Truck size={16} className='text-green-600'/>
                        <span>Status: <span className='text-green-700 font-semibold capitalize'>{status}</span></span>
                    </div>
                    <div>
                        Total: <span className='text-green-700 font-bold'>₹{order.totalAmount}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default AdminOrderCard