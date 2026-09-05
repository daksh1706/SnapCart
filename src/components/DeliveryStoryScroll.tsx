'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
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
  Navigation,
  Check,
  Bell,
  Sliders
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
    description: "Browse 1,000+ farm-fresh groceries, organic veggies, and daily essentials. One tap to add, seamless 1-click checkout from your couch in Indian Rupees (₹).",
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
    description: "Our smart hyperlocal micro-warehouse within 2km receives your order in milliseconds. Expert pickers bag items with insulated freshness seals.",
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
    description: "Before your tea even boils, your doorbell chimes. Share your secure 4-digit OTP code to verify handoff and unpack farm-fresh goodness right away.",
    icon: <HomeIcon className="w-6 h-6" />,
    badge: "OTP Verified Handoff",
    color: "from-green-600 to-emerald-700",
    accentColor: "green"
  }
]

export default function DeliveryStoryScroll() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll tracking for parallax depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 })

  // Parallax layers
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "30%"])
  const floatingItem1Y = useTransform(smoothProgress, [0, 1], ["-20px", "40px"])
  const floatingItem2Y = useTransform(smoothProgress, [0, 1], ["30px", "-50px"])

  // Sync scroll position with active step
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.25) setActiveStep(0)
      else if (latest < 0.50) setActiveStep(1)
      else if (latest < 0.75) setActiveStep(2)
      else setActiveStep(3)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  const scrollToStep = (index: number) => {
    setActiveStep(index)
    if (!containerRef.current) return
    const containerTop = containerRef.current.offsetTop
    const containerHeight = containerRef.current.offsetHeight
    const stepHeight = containerHeight / 4
    window.scrollTo({
      top: containerTop + (index * stepHeight) + 50,
      behavior: 'smooth'
    })
  }

  const current = steps[activeStep]

  return (
    <section 
      id="how-it-works" 
      ref={containerRef}
      className="relative min-h-[360vh] bg-gradient-to-b from-slate-950 via-emerald-950/90 to-slate-950 text-white"
    >
      {/* Sticky Parallax Container Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 py-6 z-20">
        
        {/* Parallax Floating Ambient Elements */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/15 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[130px] rounded-full" />
          <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-teal-500/10 blur-[140px] rounded-full" />
        </motion.div>

        {/* Floating parallax produce elements */}
        <motion.span 
          style={{ y: floatingItem1Y }}
          className="absolute top-20 right-16 text-5xl pointer-events-none opacity-40 blur-[1px] hidden lg:block"
        >
          🥑
        </motion.span>
        <motion.span 
          style={{ y: floatingItem2Y }}
          className="absolute bottom-28 left-16 text-5xl pointer-events-none opacity-40 blur-[1px] hidden lg:block"
        >
          🍓
        </motion.span>
        <motion.span 
          style={{ y: floatingItem1Y }}
          className="absolute top-1/2 left-8 text-4xl pointer-events-none opacity-30 blur-[1px] hidden lg:block"
        >
          🥦
        </motion.span>

        {/* Top Header / Parallax Nav Bar */}
        <div className="w-full max-w-7xl mx-auto pt-2 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                Parallax Experience • 10-Min Story
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-2">
                From Craving to Doorstep <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">in 10 Minutes</span>
              </h2>
            </div>

            {/* Step Checkpoint Pills */}
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => scrollToStep(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeStep === idx
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{step.time}</span>
                  <span className="hidden sm:inline">• {step.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Scroll Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
            <motion.div 
              style={{ scaleX: smoothProgress, transformOrigin: "0%" }}
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300"
            />
          </div>
        </div>

        {/* Center Stage: Parallax Story Window */}
        <div className="w-full max-w-7xl mx-auto my-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Narrative Panel */}
          <div className="lg:col-span-5 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 bg-slate-900/80 border border-white/15 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" /> Stage {activeStep + 1}/4 • {current.time}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                    {current.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {current.title}
                </h3>

                <p className="text-amber-300 font-semibold text-sm">
                  &ldquo;{current.tagline}&rdquo;
                </p>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {current.description}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 hover:scale-103 active:scale-98 transition-all"
                  >
                    Start Ordering (₹) <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => scrollToStep((activeStep + 1) % steps.length)}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/15 border border-white/10 transition cursor-pointer"
                  >
                    Next Stage <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Parallax Simulated Visual Stage */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
            
            <AnimatePresence mode="wait">
              {/* Stage 1: Phone & 1-Tap Order */}
              {activeStep === 0 && (
                <motion.div
                  key="scene-1-phone"
                  initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-full max-w-sm bg-slate-900/95 rounded-3xl p-5 border border-emerald-500/40 shadow-2xl relative backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold text-slate-200">SnapCart Mobile App</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      ⚡ 10 min
                    </span>
                  </div>

                  {/* Cart items in INR */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥑</span>
                        <div>
                          <p className="text-xs font-bold text-white">Fresh Indian Avocados (2 pcs)</p>
                          <p className="text-[11px] text-emerald-400 font-bold">₹149</p>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded-lg">Added ✓</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥛</span>
                        <div>
                          <p className="text-xs font-bold text-white">Farm Fresh Milk (1L)</p>
                          <p className="text-[11px] text-emerald-400 font-bold">₹68</p>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded-lg">Added ✓</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="mt-5 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-center shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      Order #SC-8492 Placed • ₹217 Paid
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Stage 2: Dark Store Flash Pick & Pack */}
              {activeStep === 1 && (
                <motion.div
                  key="scene-2-darkstore"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-full max-w-md bg-slate-900/95 rounded-3xl p-6 border border-blue-500/40 shadow-2xl relative backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                      <Store className="w-4 h-4" /> Micro Dark-Store #04
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2.5 py-1 rounded-full animate-pulse">
                      120s Flash Packing
                    </span>
                  </div>

                  {/* Conveyor Packing Simulation */}
                  <div className="bg-slate-950/80 rounded-2xl p-5 border border-white/10 relative overflow-hidden">
                    <div className="flex items-center justify-around py-4">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="text-4xl">🥦</span>
                        <span className="text-[10px] text-slate-400 font-bold">Fresh</span>
                      </motion.div>

                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                        className="w-14 h-14 rounded-2xl bg-blue-500/20 border-2 border-blue-400/50 flex items-center justify-center text-blue-300 shadow-lg shadow-blue-500/20"
                      >
                        <ShoppingBag className="w-7 h-7" />
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6, delay: 0.3 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="text-4xl">🍓</span>
                        <span className="text-[10px] text-slate-400 font-bold">Inspected</span>
                      </motion.div>
                    </div>

                    <div className="mt-3 bg-blue-900/40 border border-blue-400/30 rounded-xl p-3 flex items-center justify-between text-xs">
                      <span className="text-slate-200 flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-emerald-400" /> Insulated Eco-Bag Sealed
                      </span>
                      <span className="text-emerald-400 font-bold">100% Quality Checked</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stage 3: Electric Rider on City Map */}
              {activeStep === 2 && (
                <motion.div
                  key="scene-3-rider"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-full max-w-md bg-slate-900/95 rounded-3xl p-6 border border-amber-500/40 shadow-2xl relative backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                      <Navigation className="w-4 h-4" /> Live GPS Dispatch Radar
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-full animate-pulse">
                      ⚡ 2 Mins Away (350m)
                    </span>
                  </div>

                  {/* Parallax Radar Map */}
                  <div className="h-48 bg-slate-950/90 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
                    {/* Pulsing Radar concentric rings */}
                    <div className="absolute w-40 h-40 rounded-full border border-amber-500/25 animate-ping" />
                    <div className="absolute w-72 h-72 rounded-full border border-amber-500/10" />

                    {/* Animated Scooter moving along road */}
                    <motion.div
                      animate={{ x: [-80, 80, -80] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                      className="relative z-10 flex flex-col items-center bg-amber-500 text-slate-950 p-3 rounded-2xl shadow-xl shadow-amber-500/40"
                    >
                      <Bike className="w-7 h-7" />
                    </motion.div>

                    {/* Live in-app rider chat popup */}
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-white/15 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-slate-200 shadow-md">
                      <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">Rider: <i>&ldquo;I have reached your building gate! 🛵&rdquo;</i></span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stage 4: Doorstep Delivery & OTP */}
              {activeStep === 3 && (
                <motion.div
                  key="scene-4-doorstep"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-full max-w-md bg-slate-900/95 rounded-3xl p-6 border border-emerald-500/50 shadow-2xl relative text-center backdrop-blur-xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 text-emerald-400 shadow-lg shadow-emerald-500/30"
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
                  <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-left">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Delivery OTP Verified</p>
                        <p className="text-[10px] text-slate-400">Security code matched</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1.5 rounded-xl">
                      8 4 9 2
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Bottom Scroll Hint */}
        <div className="w-full max-w-7xl mx-auto pb-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3 relative z-10">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Scroll to explore the parallax journey
          </span>
          <span className="text-amber-300 font-bold">
            SnapCart 10-Min Fast Track ⚡
          </span>
        </div>

      </div>
    </section>
  )
}
