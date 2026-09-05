'use client'
import { ArrowLeft, Loader, PlusCircle, Upload, X, CheckCircle, AlertCircle, Check, ArrowRight, Eye } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const categories = [
    "Fruits & Vegetables",
    "Dairy",
    "Rice, Atta & Grains",
    "Snacks & Biscuits",
    "Spices & Masala",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essential",
    "Instant & Packages Food",
    "Baby & Pet Care"
]

const units = [
    "kg", "gm", "liter", "ml", "piece", "pack"
]

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const duration = 5000;
        const interval = 50;
        const decrement = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev - decrement <= 0) return 0;
                return prev - decrement;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (progress <= 0) {
            onClose();
        }
    }, [progress, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`fixed top-6 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden border ${
                type === 'success' ? 'bg-white border-emerald-200' : 'bg-white border-red-200'
            }`}
        >
            <div className="p-4 flex items-start gap-3">
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                    <h3 className={`font-bold text-xs ${type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
                        {type === 'success' ? 'Success!' : 'Error!'}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="h-1 bg-gray-100">
                <motion.div
                    className={`h-full ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: 'linear' }}
                />
            </div>
        </motion.div>
    );
};

function AddGrocery() {
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [size, setSize] = useState("")
    const [unit, setUnit] = useState("")
    const [originalprice, setOriginalPrice] = useState("")
    const [sellingprice, setSellingPrice] = useState("")
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState("")
    const [preview, setPreview] = useState<string | null>()
    const [backendImage, setBackendImage] = useState<File | null>()
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [addedItem, setAddedItem] = useState<{ name: string; category: string; price: string } | null>(null);
    const router = useRouter();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length == 0) return
        const file = files[0]
        setBackendImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("size", size)
            formData.append("unit", unit)
            formData.append("originalprice", originalprice)
            formData.append("sellingprice", sellingprice)
            formData.append("description", description)
            if (backendImage) {
                formData.append("image", backendImage)
            }
            await axios.post("/api/admin/add-grocery", formData)
            setLoading(false)

            // Save info for confirmation modal
            setAddedItem({
                name: name.trim(),
                category: category,
                price: sellingprice
            })

            // Show success toast
            setToast({
                message: `${name.trim()} added to store inventory!`,
                type: 'success'
            });

            // Reset form
            setName("")
            setCategory("")
            setSize("")
            setUnit("")
            setOriginalPrice("")
            setSellingPrice("")
            setDescription("")
            setPreview(null)
            setBackendImage(null)
        } catch (error) {
            console.error("Add grocery error:", error)
            setLoading(false)
            setToast({
                message: 'Failed to add grocery item. Please try again.',
                type: 'error'
            });
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-gray-50 to-white py-16 px-4 relative'>
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            {/* Success Confirmation Modal */}
            <AnimatePresence>
                {addedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                        onClick={() => setAddedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-100 text-center relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setAddedItem(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>

                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                                <Check size={32} />
                            </div>

                            <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                                Item Added Successfully! 🎉
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm mb-5">
                                <strong className="text-gray-800 font-bold">{addedItem.name}</strong> ({addedItem.category}) has been added to the store catalog at <strong className="text-emerald-700">₹{addedItem.price}</strong>.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setAddedItem(null)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                                >
                                    <PlusCircle size={16} />
                                    <span>Add Another Item</span>
                                </button>
                                <button
                                    onClick={() => router.push("/admin/view-grocery")}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer"
                                >
                                    <Eye size={16} />
                                    <span>View Inventory</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Link
                href={"/"}
                className='absolute top-6 left-6 flex items-center gap-2 text-emerald-700 font-bold text-xs sm:text-sm bg-white px-4 py-2 rounded-full shadow-md hover:bg-emerald-50 hover:shadow-lg transition-all border border-emerald-100'
            >
                <ArrowLeft className='w-4 h-4' />
                <span className='hidden md:flex'>Back to Home</span>
            </Link>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className='bg-white w-full max-w-2xl shadow-xl rounded-3xl border border-emerald-100 p-6 sm:p-10'
            >
                <div className='flex flex-col items-center mb-8'>
                    <div className='flex items-center gap-3'>
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl shadow-xs">
                            <PlusCircle className='w-7 h-7' />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Add New Grocery</h1>
                    </div>
                    <p className='text-gray-500 text-xs sm:text-sm mt-1 text-center'>
                        Fill out the details below to add a new grocery product to SnapCart catalog.
                    </p>
                </div>

                <form className='flex flex-col gap-5 w-full' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='name' className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5'>
                            Grocery Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            id='name'
                            required
                            placeholder='eg: Fresh Organic Apples, Amul Milk'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-gray-50/50'
                        />
                    </div>

                    <div>
                        <label className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5'>
                            Category <span className='text-red-500'>*</span>
                        </label>
                        <select
                            name='category'
                            required
                            value={category}
                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-gray-50/50 cursor-pointer'
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                            <label htmlFor='quantity' className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5'>
                                Pack Size <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                id='quantity'
                                required
                                placeholder='eg: 500, 1, 6'
                                onChange={(e) => setSize(e.target.value)}
                                value={size}
                                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-gray-50/50'
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5'>
                                Unit <span className='text-red-500'>*</span>
                            </label>
                            <select
                                name='units'
                                required
                                value={unit}
                                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-gray-50/50 cursor-pointer'
                                onChange={(e) => setUnit(e.target.value)}
                            >
                                <option value="">Select Unit</option>
                                {units.map(uni => (
                                    <option key={uni} value={uni}>{uni}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                            <label htmlFor='originalprice' className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5'>
                                Original Price (MRP) <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='number'
                                required
                                value={originalprice}
                                id='originalprice'
                                placeholder='eg: 120'
                                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-gray-50/50'
                                onChange={(e) => setOriginalPrice(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor='sellingprice' className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5'>
                                Selling Price (Offer Price) <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='number'
                                required
                                value={sellingprice}
                                id='sellingprice'
                                placeholder='eg: 99'
                                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-gray-50/50'
                                onChange={(e) => setSellingPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor='description' className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5'>
                            Product Description
                        </label>
                        <textarea
                            id='description'
                            placeholder='Add details about freshness, ingredients, or brand...'
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            rows={3}
                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-gray-50/50 resize-none'
                        />
                    </div>

                    <div className='flex flex-col sm:flex-row items-center gap-4'>
                        <label
                            htmlFor='image'
                            className='cursor-pointer flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 rounded-xl px-5 py-3 hover:bg-emerald-100 transition-all w-full sm:w-auto shadow-xs'
                        >
                            <Upload className='w-4 h-4' />
                            <span>{backendImage ? 'Change Image' : 'Upload Image'}</span>
                        </label>
                        <input type='file' id="image" accept='image/*' hidden onChange={handleImageChange} />
                        {preview && (
                            <div className="flex items-center gap-3">
                                <Image
                                    src={preview}
                                    width={70}
                                    height={70}
                                    alt='image'
                                    className='rounded-xl shadow-md border border-gray-200 object-cover'
                                />
                                <span className="text-xs text-emerald-700 font-semibold">Image selected</span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className='mt-2 w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white font-extrabold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60'
                    >
                        {loading ? (
                            <>
                                <Loader className='w-5 h-5 animate-spin' />
                                <span>Uploading & Saving...</span>
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-5 h-5" />
                                <span>Add Grocery Item</span>
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

export default AddGrocery