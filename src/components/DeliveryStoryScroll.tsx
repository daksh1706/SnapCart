'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  Store, 
  Bike, 
  Home as HomeIcon, 
  CheckCircle2, 
  Clock, 
  Zap, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  ShoppingBag, 
  ChevronRight, 
  ArrowRight,
  PackageCheck,
  Navigation
} from 'lucide-react'
import Link from 'next/link'

interface StoryStep {
  id: number
  time: string
  title: string
  tagline: string
  description: string
  icon: React.ReactNode
  badge: string
  color: string
  accentColor: string
}

const steps: StoryStep[] = [
  {
    id: 1,
    time: "00:00",
    title: "1. You Tap & Place Order",
    tagline: "Craving fresh strawberries or out of milk? Done in 10 seconds.",
    description: "Browse 1,000+ farm-fresh groceries, organic veggies, and daily essentials. One tap to add, seamless 1-click checkout from your couch.",
    icon: <Smartphone className="w-6 h-6" />,
    badge: "1-Tap Checkout",
    color: "from-emerald-500 to-teal-600",
    accentColor: "emerald"
  },
  {
    id: 2,
    time: "02:00",
    title: "2. Dark Store Flash Packing",
    tagline: "120-Second AI-driven picking & temperature-controlled packing.",
    description: "Our smart hyperlocal dark store located within 2km receives your order immediately. Trained pickers carefully select fresh goods and pack insulated eco-bags.",
    icon: <Store className="w-6 h-6" />,
    badge: "120s Dark Store",
    color: "from-blue-500 to-indigo-600",
    accentColor: "blue"
  },
  {
    id: 3,
    time: "05:00",
    title: "3. Rider Zips With Live GPS",
    tagline: "Track our electric rider in real-time with live radar & in-app chat.",
    description: "Our delivery partner takes off on an electric scooter with traffic-optimized routing. Open your live map to watch turn-by-turn movement as they approach.",
    icon: <Bike className="w-6 h-6" />,
    badge: "Live Radar GPS",
    color: "from-amber-500 to-orange-600",
    accentColor: "amber"
  },
  {
    id: 4,
    time: "09:45",
    title: "4. Doorstep Delivery & Fresh Smiles",
    tagline: "Ding-dong! Delivered in under 10 minutes with secure OTP handoff.",
    description: "Before your water even boils, your doorbell chimes. Share your secure 4-digit OTP code to verify handoff and unpack farm-fresh goodness right away.",
    icon: <HomeIcon className="w-6 h-6" />,
    badge: "OTP Verified Handoff",
    color: "from-green-600 to-emerald-700",
    accentColor: "green"
  }
]

export default function DeliveryStoryScroll() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-progress through the story if the user isn't manually interacting
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setIsAutoPlaying(false)
  }

  const current = steps[activeStep]

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white relative overflow-hidden" ref={containerRef}>
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            The 10-Minute Experience
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            How SnapCart Works <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">In 4 Fast Steps</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Follow the live journey from the moment you crave groceries to the instant our delivery partner rings your doorbell.
          </p>
        </div>

        {/* Story Navigation Tabs / Timeline Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`relative p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'bg-white/15 border-emerald-400/50 shadow-lg shadow-emerald-950/40 backdrop-blur-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-2xl border-2 border-emerald-400"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'
                  }`}>
                    {step.time}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isActive ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {step.icon}
                  </div>
                </div>

                <div className="relative z-10">
                  <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {step.title.split('.')[1]}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {step.badge}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Stage: Left Story Content + Right Interactive Visual Scene */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">
          
          {/* Left Column: Narrative Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Elapsed: {current.time}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {current.title}
                </h3>

                <p className="text-amber-300 font-semibold text-sm sm:text-base">
                  &ldquo;{current.tagline}&rdquo;
                </p>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {current.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-lg shadow-emerald-950/40 hover:scale-102 active:scale-98 transition-all"
                  >
                    Try It Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white px-4 py-3 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Visual Simulated Scene */}
          <div className="lg:col-span-7 relative flex items-center justify-center bg-slate-950/60 rounded-2xl border border-white/10 p-4 sm:p-8 min-h-[360px] sm:min-h-[420px] overflow-hidden">
            
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step-0-phone"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-sm bg-slate-900 rounded-3xl p-5 border border-emerald-500/30 shadow-2xl relative"
                >
                  {/* Phone Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold text-slate-200">SnapCart Mobile</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      ⚡ 10 min
                    </span>
                  </div>

                  {/* Simulated Items */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥑</span>
                        <div>
                          <p className="text-xs font-bold text-white">Organic Avocados (2 pcs)</p>
                          <p className="text-[10px] text-emerald-400 font-semibold">$3.49</p>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded-lg">Added ✓</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥛</span>
                        <div>
                          <p className="text-xs font-bold text-white">Whole Farm Milk (1L)</p>
                          <p className="text-[10px] text-emerald-400 font-semibold">$2.19</p>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded-lg">Added ✓</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="mt-5 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-center shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      Order Placed • #SC-8492
                    </span>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step-1-darkstore"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md bg-slate-900 rounded-3xl p-6 border border-blue-500/30 shadow-2xl relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                      <Store className="w-4 h-4" /> Dark Store Hub #04
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2.5 py-1 rounded-full">
                      Packing in Progress
                    </span>
                  </div>

                  {/* Micro Warehouse Conveyor */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-white/10 relative overflow-hidden">
                    <div className="flex items-center justify-around py-4">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="text-3xl">🥦</span>
                        <span className="text-[10px] text-slate-400">Fresh</span>
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                        className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300"
                      >
                        <ShoppingBag className="w-6 h-6" />
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="text-3xl">🍓</span>
                        <span className="text-[10px] text-slate-400">Inspected</span>
                      </motion.div>
                    </div>

                    <div className="mt-2 bg-blue-900/40 border border-blue-400/20 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-emerald-400" /> Insulated Eco-Bag Sealed
                      </span>
                      <span className="text-emerald-400 font-bold">100% Quality Checked</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step-2-rider"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md bg-slate-900 rounded-3xl p-6 border border-amber-500/30 shadow-2xl relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                      <Navigation className="w-4 h-4" /> Live GPS Dispatch
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-full animate-pulse">
                      ⚡ 2 Mins Away (350m)
                    </span>
                  </div>

                  {/* Simulated Radar Map */}
                  <div className="h-44 bg-slate-950 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
                    {/* Radar Pulse Circles */}
                    <div className="absolute w-36 h-36 rounded-full border border-amber-500/20 animate-ping" />
                    <div className="absolute w-64 h-64 rounded-full border border-amber-500/10" />

                    {/* Animated Scooter along road */}
                    <motion.div
                      animate={{ x: [-60, 60, -60] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="relative z-10 flex flex-col items-center bg-amber-500 text-slate-950 p-2.5 rounded-2xl shadow-xl shadow-amber-500/30"
                    >
                      <Bike className="w-6 h-6" />
                    </motion.div>

                    <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] text-slate-200">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rider: <i>&ldquo;At the main gate now!&rdquo;</i></span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  key="step-3-doorstep"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md bg-slate-900 rounded-3xl p-6 border border-emerald-500/40 shadow-2xl relative text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 text-emerald-400 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-9 h-9" />
                  </motion.div>

                  <h4 className="text-xl font-black text-white mb-1">
                    Delivered In 09:24 Mins! 🎉
                  </h4>
                  <p className="text-xs text-slate-300 mb-4">
                    Your fresh groceries are at your doorstep.
                  </p>

                  {/* OTP Verification Badge */}
                  <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-left">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Delivery OTP Verified</p>
                        <p className="text-[10px] text-slate-400">Security code matched</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-lg">
                      8 4 9 2
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  )
}
