'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, Bike, Search, Phone, Mail, Calendar, ShoppingBag, ArrowLeft,
    CheckCircle2, Clock, ShieldCheck, DollarSign, RefreshCw, UserCheck, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

interface ICustomer {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    image: string | null;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string | null;
    createdAt: string;
}

interface IDeliveryPartner {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    image: string | null;
    isOnline: boolean;
    completedDeliveries: number;
    activeDeliveries: number;
    createdAt: string;
}

export default function ManageUsersPage() {
    const [activeTab, setActiveTab] = useState<'customers' | 'delivery'>('customers')
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [deliveryPartners, setDeliveryPartners] = useState<IDeliveryPartner[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/admin/users')
            if (res.data) {
                setCustomers(res.data.customers || [])
                setDeliveryPartners(res.data.deliveryPartners || [])
            }
        } catch (err) {
            console.error("Error fetching admin users:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredCustomers = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return customers
        return customers.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.mobile.includes(q)
        )
    }, [customers, searchQuery])

    const filteredPartners = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return deliveryPartners
        return deliveryPartners.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            p.mobile.includes(q)
        )
    }, [deliveryPartners, searchQuery])

    const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const activeOnlineCount = deliveryPartners.filter(p => p.isOnline).length

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-6">
            <div className="w-[94%] sm:w-[90%] max-w-7xl mx-auto">
                {/* Header & Back Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="p-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 border border-gray-200 transition-all shadow-xs cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                User & Staff Management
                            </h1>
                            <p className="text-gray-500 text-xs sm:text-sm">
                                Manage customer profiles and delivery fleet performance.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={fetchData}
                        className="flex items-center gap-1.5 self-start sm:self-auto bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                            <Users size={22} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Total Customers</p>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900">{customers.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                            <Bike size={22} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Delivery Partners</p>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900">{deliveryPartners.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="p-3 bg-green-100 text-green-700 rounded-2xl">
                            <CheckCircle2 size={22} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Online Fleet</p>
                            <h3 className="text-xl sm:text-2xl font-black text-emerald-700">
                                {activeOnlineCount} / {deliveryPartners.length}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                            <DollarSign size={22} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Customer Spend</p>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900">₹{totalSpentAll.toFixed(0)}</h3>
                        </div>
                    </div>
                </div>

                {/* Tabs & Search Filter */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                        {/* Segmented Control */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
                            <button
                                onClick={() => setActiveTab('customers')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    activeTab === 'customers'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Users size={16} />
                                <span>Customers ({customers.length})</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('delivery')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    activeTab === 'delivery'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Bike size={16} />
                                <span>Delivery Partners ({deliveryPartners.length})</span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'customers' ? 'customers' : 'partners'} by name, email, phone...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* Tab Content */}
                    {loading ? (
                        <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                            <p className="text-xs font-semibold">Loading user records from database...</p>
                        </div>
                    ) : activeTab === 'customers' ? (
                        /* Customers List */
                        filteredCustomers.length === 0 ? (
                            <div className="py-16 text-center text-gray-400 text-sm">
                                No customers found matching &quot;{searchQuery}&quot;
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredCustomers.map((cust) => (
                                    <motion.div
                                        key={cust._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-50/70 hover:bg-emerald-50/30 rounded-2xl p-4 border border-gray-100 transition-all space-y-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 relative rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-base shrink-0 overflow-hidden border border-emerald-200">
                                                {cust.image ? (
                                                    <Image src={cust.image} alt={cust.name} fill className="object-cover" />
                                                ) : (
                                                    cust.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-extrabold text-gray-900 truncate">{cust.name}</h4>
                                                <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                                                    <Mail size={12} className="shrink-0" /> {cust.email}
                                                </p>
                                                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                                                    <Phone size={12} className="shrink-0" /> {cust.mobile}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-xs">
                                            <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                                                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Total Orders</span>
                                                <span className="text-sm font-extrabold text-gray-900">{cust.totalOrders}</span>
                                            </div>
                                            <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                                                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Total Spent</span>
                                                <span className="text-sm font-extrabold text-emerald-700">₹{cust.totalSpent.toFixed(0)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                                            <span>Joined: {new Date(cust.createdAt).toLocaleDateString()}</span>
                                            {cust.lastOrderDate && (
                                                <span>Last order: {new Date(cust.lastOrderDate).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    ) : (
                        /* Delivery Partners List */
                        filteredPartners.length === 0 ? (
                            <div className="py-16 text-center text-gray-400 text-sm">
                                No delivery partners found matching &quot;{searchQuery}&quot;
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredPartners.map((partner) => (
                                    <motion.div
                                        key={partner._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-50/70 hover:bg-emerald-50/30 rounded-2xl p-4 border border-gray-100 transition-all space-y-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-12 h-12 relative rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800 text-base shrink-0 overflow-hidden border border-blue-200">
                                                    {partner.image ? (
                                                        <Image src={partner.image} alt={partner.name} fill className="object-cover" />
                                                    ) : (
                                                        partner.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-sm font-extrabold text-gray-900 truncate">{partner.name}</h4>
                                                    <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                                                        <Mail size={12} className="shrink-0" /> {partner.email}
                                                    </p>
                                                    <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1 mt-0.5">
                                                        <Phone size={12} className="shrink-0" /> {partner.mobile}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                                                partner.isOnline
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                    : 'bg-gray-200 text-gray-600 border-gray-300'
                                            }`}>
                                                {partner.isOnline ? '🟢 Online' : '⚪ Offline'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-xs">
                                            <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                                                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Completed</span>
                                                <span className="text-sm font-extrabold text-emerald-700">{partner.completedDeliveries} Orders</span>
                                            </div>
                                            <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                                                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Active In Hand</span>
                                                <span className="text-sm font-extrabold text-amber-600">{partner.activeDeliveries} Active</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                                            <span>Staff ID: #{partner._id.slice(-6).toUpperCase()}</span>
                                            <span>Joined: {new Date(partner.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
