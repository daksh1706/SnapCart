import { AlertCircle, ArrowLeft, EyeIcon, EyeOff, Leaf, Loader2, Lock, LogIn, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "framer-motion"
import Image from 'next/image'
import google from '@/assets/google.png'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

type propType = {
    previousStep: (s: number) => void
}

function RegisterForm({ previousStep }: propType) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true)
        try {
            const normalizedEmail = email.trim().toLowerCase()
            await axios.post("/api/auth/register", {
                name: name.trim(),
                email: normalizedEmail,
                password
            })
            // Immediately log in with the new account and go straight inside the app!
            const loginRes = await signIn("credentials", {
                email: normalizedEmail,
                password,
                redirect: false
            })
            if (loginRes?.ok) {
                router.push("/")
                router.refresh()
            } else {
                router.push("/login")
            }
        } catch (error: any) {
            console.error("Registration error:", error)
            setErrorMessage(error?.response?.data?.message || "Registration failed. Please try again.")
            setLoading(false)
        }
    }

    const handleGoogleRegister = async () => {
        setErrorMessage("")
        setGoogleLoading(true)
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error: any) {
            console.error("Google sign in error:", error)
            setErrorMessage(error?.message || "Failed to initiate Google sign in.")
            setGoogleLoading(false)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
            <div 
                className='absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors cursor-pointer'
                onClick={() => previousStep(1)}
            >
                <ArrowLeft className='w-5 h-5'/>
                <span className='font-medium'>Back</span>
            </div>

            <motion.h1 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='text-4xl font-extrabold text-green-700 mb-2'
            >
                Create Account
            </motion.h1>
            <p className='text-gray-600 mb-6 flex items-center'>
                Join SnapCart today <Leaf className='w-5 h-5 text-green-600 ml-1'/>
            </p>

            {errorMessage && (
                <div className='mb-6 p-3 w-full max-w-sm bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2'>
                    <AlertCircle className='w-5 h-5 flex-shrink-0 text-red-500 mt-0.5' />
                    <span>{errorMessage}</span>
                </div>
            )}

            <motion.form 
                onSubmit={handleRegister}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='flex flex-col gap-5 w-full max-w-sm'
            >
                <div className='relative'>
                    <User className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
                    <input 
                        type='text' 
                        required
                        placeholder='Your Name' 
                        className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none' 
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
                <div className='relative'>
                    <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
                    <input 
                        type='email' 
                        required
                        placeholder='Your Email' 
                        className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none' 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className='relative'>
                    <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        placeholder='Your Password (min 6 chars)' 
                        className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none' 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {showPassword ? (
                        <EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer' onClick={() => setShowPassword(false)}/>
                    ) : (
                        <EyeIcon className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer' onClick={() => setShowPassword(true)}/>
                    )}
                </div>

                {(() => {
                    const formValidation = name.trim() !== "" && email.trim() !== "" && password.length >= 6
                    return (
                        <button 
                            type="submit"
                            disabled={!formValidation || loading} 
                            className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
                                formValidation && !loading
                                ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : "Register"}
                        </button>
                    )
                })()}

                <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
                    <span className='flex-1 h-px bg-gray-200'></span>
                    OR
                    <span className='flex-1 h-px bg-gray-200'></span>
                </div>

                <button
                    type="button"
                    disabled={googleLoading}
                    onClick={handleGoogleRegister}
                    className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 py-3 rounded-3xl text-gray-700 font-medium transition-all duration-200 cursor-pointer bg-white hover:bg-gray-50'
                >
                    {googleLoading ? (
                        <Loader2 className='w-5 h-5 animate-spin text-gray-600' />
                    ) : (
                        <>
                            <Image src={google} width={20} height={20} alt="google image" />
                            Continue with Google
                        </>
                    )}
                </button>
            </motion.form>
            <p className='cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1' onClick={() => router.push("/login")}>
                Already have an account? <LogIn className='w-4 h-4 ml-1'/> <span className='text-green-600 font-medium'>Sign in</span>
            </p>
        </div>
    )
}

export default RegisterForm