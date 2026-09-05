'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Mail, Phone, Lock, MapPin, Plus, Trash2, CheckCircle2,
    AlertCircle, ArrowLeft, ShieldCheck, Loader2, Save, Home, Building, Navigation, Search
} from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'

interface ISavedAddress {
    _id?: string;
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    isDefault?: boolean;
}

export default function ProfilePage() {
    const { data: session, update } = useSession()

    // Profile state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [profileSaving, setProfileSaving] = useState(false)
    const [profileSuccess, setProfileSuccess] = useState('')
    const [profileError, setProfileError] = useState('')

    // Password state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordSaving, setPasswordSaving] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [passwordError, setPasswordError] = useState('')

    // Addresses state
    const [addresses, setAddresses] = useState<ISavedAddress[]>([])
    const [addressLoading, setAddressLoading] = useState(true)
    const [showAddAddressModal, setShowAddAddressModal] = useState(false)
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        mobile: '',
        city: '',
        state: '',
        pincode: '',
        fullAddress: '',
        isDefault: false
    })
    const [savingAddress, setSavingAddress] = useState(false)

    // Load initial user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get('/api/me')
                if (res.data) {
                    setName(res.data.name || '')
                    setEmail(res.data.email || '')
                    setMobile(res.data.mobile || '')
                }
            } catch (e) {
                if (session?.user) {
                    setName(session.user.name || '')
                    setEmail(session.user.email || '')
                }
            }
        }

        const fetchAddresses = async () => {
            try {
                const res = await axios.get('/api/user/profile/addresses')
                if (res.data?.addresses) {
                    setAddresses(res.data.addresses)
                }
            } catch (e) {
                console.error("Failed to load addresses:", e)
            } finally {
                setAddressLoading(false)
            }
        }

        fetchUserData()
        fetchAddresses()
    }, [session])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileSaving(true)
        setProfileSuccess('')
        setProfileError('')

        try {
            const res = await axios.post('/api/user/profile/update', { name, mobile })
            if (res.data?.user) {
                await update({ name: res.data.user.name })
                setProfileSuccess('Profile details updated successfully!')
            }
        } catch (err: any) {
            setProfileError(err?.response?.data?.message || 'Failed to update profile')
        } finally {
            setProfileSaving(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordSaving(true)
        setPasswordSuccess('')
        setPasswordError('')

        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirm password do not match')
            setPasswordSaving(false)
            return
        }

        try {
            const res = await axios.post('/api/user/profile/change-password', {
                currentPassword,
                newPassword
            })
            setPasswordSuccess(res.data?.message || 'Password changed successfully!')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            setPasswordError(err?.response?.data?.message || 'Failed to change password')
        } finally {
            setPasswordSaving(false)
        }
    }

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingAddress(true)
        try {
            const res = await axios.post('/api/user/profile/addresses', newAddress)
            if (res.data?.addresses) {
                setAddresses(res.data.addresses)
                setShowAddAddressModal(false)
                setNewAddress({
                    fullName: '',
                    mobile: '',
                    city: '',
                    state: '',
                    pincode: '',
                    fullAddress: '',
                    isDefault: false
                })
            }
        } catch (err) {
            console.error("Failed to save address:", err)
            alert("Failed to save address. Please check all fields.")
        } finally {
            setSavingAddress(false)
        }
    }

    const handleDeleteAddress = async (id: string) => {
        try {
            const res = await axios.delete(`/api/user/profile/addresses/${id}`)
            if (res.data?.addresses) {
                setAddresses(res.data.addresses)
            }
        } catch (err) {
            console.error("Failed to delete address:", err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-6">
            <div className="w-[94%] sm:w-[88%] max-w-5xl mx-auto space-y-6">
                {/* Back button and title */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="p-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 border border-gray-200 transition-all shadow-xs cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            My Account & Profile
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-sm">
                            Manage your personal details, credentials, and delivery addresses.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                    {/* Left Column: Personal Info & Password */}
                    <div className="md:col-span-6 space-y-6">
                        {/* Profile Info Form */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-emerald-600" />
                                <span>Personal Information</span>
                            </h2>

                            {profileSuccess && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                    <span>{profileSuccess}</span>
                                </div>
                            )}

                            {profileError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-red-600" />
                                    <span>{profileError}</span>
                                </div>
                            )}

                            <form onSubmit={handleProfileUpdate} className="space-y-3.5">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            disabled
                                            value={email}
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 font-medium cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Email is linked to authentication.</p>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                                        Contact Phone / Mobile
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            placeholder="10-digit mobile number"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={profileSaving}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
                                >
                                    {profileSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    <span>Save Profile Changes</span>
                                </button>
                            </form>
                        </div>

                        {/* Change Password Form */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-emerald-600" />
                                <span>Security & Password</span>
                            </h2>

                            {passwordSuccess && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                    <span>{passwordSuccess}</span>
                                </div>
                            )}

                            {passwordError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-red-600" />
                                    <span>{passwordError}</span>
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-3.5">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                                        New Password (min 6 chars)
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Re-type new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
                                >
                                    {passwordSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                    <span>Update Password</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Saved Delivery Addresses */}
                    <div className="md:col-span-6 space-y-6">
                        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                    <span>Saved Delivery Addresses</span>
                                </h2>
                                <button
                                    onClick={() => setShowAddAddressModal(true)}
                                    className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer"
                                >
                                    <Plus size={14} />
                                    <span>Add New</span>
                                </button>
                            </div>

                            {addressLoading ? (
                                <div className="py-12 text-center text-gray-400">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                                    <span className="text-xs">Loading saved addresses...</span>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="py-12 text-center text-gray-400 space-y-3">
                                    <MapPin size={32} className="mx-auto text-gray-300" />
                                    <p className="text-xs">You haven&apos;t saved any addresses yet.</p>
                                    <button
                                        onClick={() => setShowAddAddressModal(true)}
                                        className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                                    >
                                        + Add your first address
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((addr, idx) => (
                                        <div
                                            key={addr._id || idx}
                                            className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2 relative"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-xs font-extrabold text-gray-900">{addr.fullName}</h4>
                                                    {addr.isDefault && (
                                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-md">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                {addr._id && (
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr._id!)}
                                                        className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                                        title="Delete Address"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                {addr.fullAddress}, {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                            <p className="text-[11px] text-gray-500 font-semibold">
                                                📞 Phone: {addr.mobile}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            <AnimatePresence>
                {showAddAddressModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddAddressModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                    <MapPin className="text-emerald-600 w-5 h-5" />
                                    <span>Add New Address</span>
                                </h3>
                                <button
                                    onClick={() => setShowAddAddressModal(false)}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleAddAddress} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        value={newAddress.fullName}
                                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="10-digit Phone No"
                                        value={newAddress.mobile}
                                        onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <textarea
                                    required
                                    rows={2}
                                    placeholder="Flat / House No, Street, Landmark"
                                    value={newAddress.fullAddress}
                                    onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                />

                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        required
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        required
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Pincode"
                                        value={newAddress.pincode}
                                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingAddress}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {savingAddress ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    <span>Save Address</span>
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
