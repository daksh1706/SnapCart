'use client'
import mongoose from 'mongoose'
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, decreaseQunatity, increaseQunatity } from '@/redux/cartSlice';
import { useState } from 'react';

interface IGrocery{
    _id : mongoose.Types.ObjectId,
    name: string,
    category : string,
    size :string,
    description ?: string
    originalprice : string,
    sellingprice:string
    unit : string,
    image : string,
    createdAt ?: Date,
    updatedAt ?: Date
}

function GroceryItemCard({item}:{item:IGrocery}) {
    const dispatch = useDispatch<AppDispatch>()
    const {cartData} = useSelector((state:RootState)=>state.cart)
    const cartItem = cartData.find(i=>i._id==item._id)
    const [showModal, setShowModal] = useState(false)
    
    // Calculate discount percentage
    const discountPercentage = Math.round(((Number(item.originalprice) - Number(item.sellingprice)) / Number(item.originalprice)) * 100)
    
  return (
    <>
    <motion.div
    initial={{opacity:0,y:50,scale:0.9}}
    whileInView={{opacity:1,y:0,scale:1}}
    transition={{duration:0.6}}
    viewport={{once:false,amount:0.3}}
    className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer'
    onClick={() => setShowModal(true)}
    >
        <div className='relative w-full aspect-4/3 bg-gray-50 overflow-hidden group'>
            <Image src={item.image} alt={item.name} fill sizes='(max-width:768px) 100vw 25vw' className='object-cover'/>
            <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'/>
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
                <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md'>
                    {discountPercentage}% OFF
                </div>
            )}
        </div>
        <div className='p-4 flex flex-col flex-1'>
            <p className='text-xs text-gray-500 font-medium mb-1 uppercase'>{item.category}</p>
            <h3 className='text-sm sm:text-base font-semibold text-gray-800 line-clamp-2'>{item.name}</h3>
            <div className='flex items-center justify-between mt-2 gap-2 flex-wrap sm:flex-nowrap'>
                <div className='text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap w-fit'>
                    {item.size} {item.unit}
                </div>
                
                {/* Price Section */}
                <div className='flex flex-col items-end gap-0.5'>
                    <span className='text-gray-400 line-through text-xs'>₹{item.originalprice}</span>
                    <span className='text-green-700 font-bold text-base sm:text-lg whitespace-nowrap'>₹{item.sellingprice}</span>
                </div>
            </div>
            {!cartItem ? <motion.button className='mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-2 px-4 text-sm font-medium transition-all '
            whileTap={{scale:0.96}}
            onClick={(e)=>{
                e.stopPropagation()
                dispatch(addToCart({...item,quantity:1}))
            }}
            >
                <ShoppingCart className='w-4 h-4' /> 
                <span className='hidden xs:inline'>Add to Cart</span>
                <span className='xs:hidden'>Add</span>
            </motion.button>
            : <motion.div
            initial = {{opacity:0,y:10}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.3}}
            className='mt-4 flex items-center justify-center bg-green-50 border border-green-200 rounded-full py-2 px-4 gap-4'
            onClick={(e) => e.stopPropagation()}
            >
                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all' onClick={(e)=>{
                    e.stopPropagation()
                    dispatch(decreaseQunatity(item._id))
                }}><Minus size={16} className='text-green-700'/></button>
                <span className='text-sm font-semibold text-gray-800'>{cartItem.quantity}</span>
                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all' onClick={(e)=>{
                    e.stopPropagation()
                    dispatch(increaseQunatity(item._id))
                }}><Plus size={16} className='text-green-700' /></button>
            </motion.div>
            }
            
        </div>
        
    </motion.div>

    {/* Modal */}
    <AnimatePresence>
        {showModal && (
            <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
                onClick={() => setShowModal(false)}
            >
                <motion.div
                    initial={{scale:0.9, opacity:0}}
                    animate={{scale:1, opacity:1}}
                    exit={{scale:0.9, opacity:0}}
                    transition={{duration:0.2}}
                    className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button 
                        onClick={() => setShowModal(false)}
                        className='absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all z-10'
                    >
                        <X size={20} className='text-gray-600' />
                    </button>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
                        {/* Image Section */}
                        <div className='relative aspect-square bg-gray-50 rounded-xl overflow-hidden'>
                            <Image src={item.image} alt={item.name} fill className='object-contain p-4'/>
                            {discountPercentage > 0 && (
                                <div className='absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md'>
                                    {discountPercentage}% OFF
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className='flex flex-col'>
                            <p className='text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide'>{item.category}</p>
                            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-3'>{item.name}</h2>
                            
                            {/* Size Badge */}
                            <div className='text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap w-fit mb-4'>
                                {item.size} {item.unit}
                            </div>

                            {/* Price Section */}
                            <div className='mb-4'>
                                <div className='flex items-center gap-3 mb-1'>
                                    <span className='text-gray-400 line-through text-lg'>₹{item.originalprice}</span>
                                    <span className='text-green-700 font-bold text-3xl'>₹{item.sellingprice}</span>
                                </div>
                                <p className='text-green-600 text-sm font-medium'>You save ₹{Number(item.originalprice) - Number(item.sellingprice)}</p>
                            </div>

                            {/* Description */}
                            {item.description && (
                                <div className='mb-6'>
                                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Description</h3>
                                    <p className='text-gray-600 text-sm leading-relaxed'>{item.description}</p>
                                </div>
                            )}

                            {/* Add to Cart Section */}
                            <div className='mt-auto'>
                                {!cartItem ? (
                                    <motion.button 
                                        className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-3 px-6 text-base font-medium transition-all shadow-md hover:shadow-lg'
                                        whileTap={{scale:0.96}}
                                        onClick={()=>dispatch(addToCart({...item,quantity:1}))}
                                    >
                                        <ShoppingCart className='w-5 h-5' /> 
                                        Add to Cart
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        initial = {{opacity:0,y:10}}
                                        animate={{opacity:1,y:0}}
                                        transition={{duration:0.3}}
                                        className='flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-full py-3 px-6 gap-4'
                                    >
                                        <button 
                                            className='w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-all' 
                                            onClick={()=>dispatch(decreaseQunatity(item._id))}
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xl font-bold text-gray-800'>{cartItem.quantity}</span>
                                            <span className='text-xs text-green-600 font-medium'>in cart</span>
                                        </div>
                                        <button 
                                            className='w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-all' 
                                            onClick={()=>dispatch(increaseQunatity(item._id))}
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  )
}

export default GroceryItemCard