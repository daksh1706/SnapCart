'use client'
import AdminOrderCard from '@/components/AdminOrderCard'
import { getSocket } from '@/lib/socket'
import { IOrder } from '@/models/order.model'
import { IUser } from '@/models/user.model' // Ensure you import your User interface
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

/** * This interface solves the error. 
 * We take the original IOrder but "override" assignedDeliveryBoy 
 * to be a full IUser object instead of just an ObjectId string.
 */
interface PopulatedOrder extends Omit<IOrder, 'assignedDeliveryBoy'> {
    assignedDeliveryBoy?: IUser;
}

function ManageOrders() {
    const router = useRouter()
    
    // Use the PopulatedOrder type for state
    const [orders, setOrders] = useState<PopulatedOrder[]>([])

    useEffect(() => {
        const getOrders = async () => {
            try {
                // Ensure your API route (/api/admin/get-orders) 
                // uses .populate('assignedDeliveryBoy') in Mongoose
                const result = await axios.get("/api/admin/get-orders")
                setOrders(result.data)
            } catch (error) {
                console.error("Error fetching orders:", error)
            }
        }
        getOrders()
    }, [])

    useEffect(() => {
        const socket = getSocket()
        
        socket.on("new-order", (newOrder: PopulatedOrder) => {
            setOrders((prev) => [newOrder, ...prev])
        })

        socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }: { orderId: string, assignedDeliveryBoy: IUser }) => {
    setOrders((prev) => prev.map((o) => (
        // Convert o._id to string to match the string orderId
        o._id!.toString() === orderId ? { ...o, assignedDeliveryBoy } : o
    )))
})

        return () => {
            socket.off("new-order")
            socket.off("order-assigned")
        }
    }, [])

    return (
        <div className='min-h-screen bg-gray-50 w-full'>
            <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
                <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
                    <button 
                        className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition' 
                        onClick={() => router.push("/")}
                    >
                        <ArrowLeft size={24} className='text-green-700' />
                    </button>
                    <h1 className='text-xl font-bold text-gray-800'>Manage Orders</h1>
                </div>
            </div>

            <div className='max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8'>
                <div className='space-y-6'>
                    {orders.length === 0 ? (
                        <p className='text-center text-gray-500'>No orders yet</p>
                    ) : (
                        orders.map((order) => (
                            <AdminOrderCard 
                                key={order._id!.toString()} // Use _id as key for better React performance
                                order={order} 
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageOrders