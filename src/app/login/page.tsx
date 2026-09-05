'use client'

import { AlertCircle, EyeIcon, EyeOff, Leaf, Loader2, Lock, LogIn, Mail } from 'lucide-react'
import React, { FormEvent, Suspense, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Image from 'next/image'
import google from '@/assets/google.png'

import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const errorParam = searchParams.get("error")
        if (errorParam) {
            if (errorParam === "OAuthSignin" || errorParam === "OAuthCallback" || errorParam === "Configuration") {
                setErrorMessage("Google Sign-In failed. Please ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured in .env.local.")
            } else if (errorParam === "CredentialsSignin") {
                setErrorMessage("Invalid email or password.")
            } else if (errorParam === "CallbackRouteError") {
                setErrorMessage("Authentication server error. Check database or auth configuration.")
            } else {
                setErrorMessage(`Authentication error: ${errorParam}`)
            }
        }
    }, [searchParams])

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true)
        try {
            const res = await signIn("credentials", {
                email: email.trim().toLowerCase(),
                password,
                redirect: false
            })

            if (res?.error) {
                if (res.error === "CredentialsSignin") {
                    setErrorMessage("Invalid email or password.")
                } else {
                    setErrorMessage(res.error)
                }
                setLoading(false)
            } else if (res?.ok) {
                router.push("/")
                router.refresh()
            } else {
                setLoading(false)
            }
        } catch (error: any) {
            console.error("Login error:", error)
            setErrorMessage(error?.message || "Failed to log in. Please check your credentials.")
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
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
            <motion.h1 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='text-4xl font-extrabold text-green-700 mb-2'
            >
                Welcome Back
            </motion.h1>
            <p className='text-gray-600 mb-6 flex items-center'>
                Login to SnapCart <Leaf className='w-5 h-5 text-green-600 ml-1'/>
            </p>

            {errorMessage && (
                <div className='mb-6 p-3 w-full max-w-sm bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2'>
                    <AlertCircle className='w-5 h-5 flex-shrink-0 text-red-500 mt-0.5' />
                    <span>{errorMessage}</span>
                </div>
            )}

            <motion.form 
                onSubmit={handleLogin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='flex flex-col gap-5 w-full max-w-sm'
            >
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
                        placeholder='Your Password' 
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
                    const formValidation = email.trim() !== "" && password !== ""
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
                            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : "Log In"}
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
                    onClick={handleGoogleLogin}
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
            <p className='cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1' onClick={() => router.push("/register")}>
                Don&apos;t have an account? <LogIn className='w-4 h-4 ml-1'/> <span className='text-green-600 font-medium'>Sign Up</span>
            </p>
        </div>
    )
}

export default function Login() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}