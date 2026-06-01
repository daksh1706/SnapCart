'use client'
import { ArrowLeft, Loader, PlusCircle, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import axios from 'axios';

const categories=[
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
    "kg","gm","liter","ml","piece","pack"
]

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const duration = 6000; // 6 seconds
        const interval = 50; // Update every 50ms
        const decrement = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - decrement;
                if (newProgress <= 0) {
                    return 0;
                }
                return newProgress;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // Separate useEffect to handle auto-close
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
            className={`fixed top-6 right-6 z-50 w-80 rounded-xl shadow-2xl overflow-hidden ${
                type === 'success' ? 'bg-white border border-green-200' : 'bg-white border border-red-200'
            }`}
        >
            <div className="p-4 flex items-start gap-3">
                {type === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                    <h3 className={`font-semibold ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                        {type === 'success' ? 'Success!' : 'Error!'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="h-1 bg-gray-100">
                <motion.div
                    className={`h-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: 'linear' }}
                />
            </div>
        </motion.div>
    );
};

function AddGrocery() {
    const [name,setName] = useState("")
    const [category,setCategory] = useState("")
    const [size,setSize] = useState("")
    const [unit,setUnit] = useState("")
    const [originalprice,setOriginalPrice] = useState("")
    const [sellingprice,setSellingPrice] = useState("")
    const [loading,setLoading] = useState(false)
    const [description,setDescription] = useState("")
    const [preview,setPreview] = useState<string|null>()
    const [backendImage,setBackendImage] = useState<File | null>()
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleImageChange =(e:ChangeEvent<HTMLInputElement>)=>{
        const files = e.target.files
        if(!files || files.length==0) return
        const file = files[0]
        setBackendImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async(e:FormEvent) =>{
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name",name)
            formData.append("category",category)
            formData.append("size",size)
            formData.append("unit",unit)
            formData.append("originalprice",originalprice)
            formData.append("sellingprice",sellingprice)
            formData.append("description",description)
            if(backendImage){
                formData.append("image",backendImage)
            }
            const result = await axios.post("/api/admin/add-grocery",formData)
            console.log(result.data)
            setLoading(false)
            
            // Show success toast
            setToast({
                message: 'Grocery item added successfully!',
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
            console.log(error)
            setLoading(false)
            
            // Show error toast
            setToast({
                message: 'Failed to add grocery item. Please try again.',
                type: 'error'
            });
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative'>
        <AnimatePresence>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </AnimatePresence>

        <Link href={"/"} className='absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all'>
        <ArrowLeft className='w-5 h-5' /><span className='hidden md:flex'>Back to home</span>
        </Link>

        <motion.div
        initial={{y:20,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.4}}
        className='bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8'
        >
            <div className='flex flex-col items-center mb-8'>
                <div className='flex items-center gap-3'>
                    <PlusCircle className='text-green-600 w-8 h-8'/>
                    <h1>Add Your Grocery</h1>
                </div>
                    <p className='text-gray-500 text-sm mt-2 text-center'>Fill out the details below to add a new grocery item.</p>
            </div>
            <form className='flex flex-col gap-6 w-full' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='name' className='block text-gray-700 font-medium mb-1'>Grocery Name<span className='text-red-500'>*</span></label>
                    <input type='text' id='name' placeholder='eg: sweets,milk'
                    onChange={(e)=>setName(e.target.value)} 
                    value={name}
                    className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all'/>
                </div>
                
                <div>
                    <label className='block text-gray-700 font-medium mb-1'>Category<span className='text-red-500'>*</span></label>
                    <select name='category' value={category} className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white' onChange={(e)=>setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map((cat,i)=>(
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                        <label htmlFor='size' className='block text-gray-700 font-medium mb-1'>Size<span className='text-red-500'>*</span></label>
                        <input type='text' id='quantity' placeholder='eg: 500'
                        onChange={(e)=>setSize(e.target.value)} 
                        value={size}
                        className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all'/>
                    </div>
                    <div>
                        <label className='block text-gray-700 font-medium mb-1'>Unit<span className='text-red-500'>*</span></label>
                        <select name='units' value={unit} className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white' onChange={(e)=>setUnit(e.target.value)}>
                            <option value="">Select Unit</option>
                            {units.map(uni=>(
                                <option key={uni} value={uni}>{uni}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
    <div>
        <label htmlFor='originalprice' className='block text-gray-700 font-medium mb-1'>
            Original Price<span className='text-red-500'>*</span>
        </label>
        <input 
            type='text' 
            value={originalprice} 
            id='originalprice' 
            placeholder='eg: ₹120' 
            className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all' 
            onChange={(e)=>setOriginalPrice(e.target.value)}
        />
    </div>
    
    <div>
        <label htmlFor='sellingprice' className='block text-gray-700 font-medium mb-1'>
            Price<span className='text-red-500'>*</span>
        </label>
        <input 
            type='text' 
            value={sellingprice} 
            id='sellingprice' 
            placeholder='eg: ₹120' 
            className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all' 
            onChange={(e)=>setSellingPrice(e.target.value)}
        />
    </div>
</div>

                <div>
                    <label htmlFor='description' className='block text-gray-700 font-medium mb-1'>Description</label>
                    <textarea id='description' placeholder='Add a brief description of the grocery item...'
                    onChange={(e)=>setDescription(e.target.value)} 
                    value={description}
                    rows={4}
                    className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all resize-none'/>
                </div>

                <div className='flex flex-col sm:flex-row items-center gap-5'>
                    <label htmlFor='image' className='cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto'>
                       <Upload className='w-5 h-5'></Upload> Upload Image</label>
                <input type='file' id="image" accept='image/*' hidden onChange={handleImageChange}/>
                {preview && <Image src={preview} width={100} height={100} alt='image' className='rounded-xl shadow-md border border-gray-200 object-cover'/>}
                </div>
                <motion.button
                whileHover={{scale:1.02}}
                whileTap={{scale:0.9}}
                disabled={loading}
                className='mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disables:opacity-60 transition-all flex items-center justify-center gap-2'
                >
                    {loading?<Loader className='w-5 h-5 animate-spin' /> : "Add Grocery"}
                </motion.button>
            </form>
        </motion.div>
    </div>
  )
}

export default AddGrocery