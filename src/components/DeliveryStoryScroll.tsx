'use client'
import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  Store, 
  ShoppingBag, 
  Bike, 
  Home as HomeIcon, 
  CheckCircle2, 
  Clock, 
  Zap, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  PackageCheck,
  Navigation,
  ArrowRight,
  ChevronRight,
  Sliders,
  Check,
  Building2,
  Boxes,
  QrCode
} from 'lucide-react'
import Link from 'next/link'

interface StageMeta {
  id: number
  time: string
  name: string
  layerTitle: string
  headline: string
  subhead: string
  color: string
}

const STAGES: StageMeta[] = [
  {
    id: 1,
    time: "00:00",
    name: "Order Placed",
    layerTitle: "Handheld / Device Layer",
    headline: "You Tap, We Lock In",
    subhead: "Foreground smartphone checkout; instant confirmation checkmark pulses and ascends to the midground.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 2,
    time: "01:30",
    name: "Store Reception",
    layerTitle: "Dark / Warehouse Layer",
    headline: "Hyperlocal Dispatch Ticket",
    subhead: "Background slides horizontally to reveal the dark store dashboard accepting the live ticket.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: 3,
    time: "03:00",
    name: "Item Packing",
    layerTitle: "Assembly Line Layer",
    headline: "120s Multi-Depth Assembly",
    subhead: "Parallax depth shifts across warehouse (0.2x), shelf racks (0.6x), and the sealed eco-bag (1.0x).",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 4,
    time: "06:00",
    name: "En Route",
    layerTitle: "Transit Layer",
    headline: "Rider Zips Through City",
    subhead: "Skyline (0.2x), city buildings (0.6x), and delivery electric scooter (1.0x) with live GPS radar.",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: 5,
    time: "09:45",
    name: "OTP & Fulfilled",
    layerTitle: "Doorstep & Handshake Layer",
    headline: "Delivered in Under 10 Mins",
    subhead: "Transit halts; doorstep slides in focus while the 4-digit OTP card floats forward along the Z-axis.",
    color: "from-emerald-400 to-green-500"
  }
]

export default function DeliveryStoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)

  // Track scroll position through the 500vh parallax track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth out scroll momentum
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })

  // Parallax transform interpolations
  // Ambient lighting & background depth
  const ambientY = useTransform(smoothProgress, [0, 1], ["0%", "40%"])

  // Layer 1: Handheld Device & Checkmark
  const phoneScale = useTransform(smoothProgress, [0, 0.18, 0.22], [1, 1, 0.8])
  const phoneOpacity = useTransform(smoothProgress, [0, 0.16, 0.22], [1, 1, 0])
  const checkmarkY = useTransform(smoothProgress, [0, 0.12, 0.20], [20, -30, -100])
  const checkmarkScale = useTransform(smoothProgress, [0, 0.10, 0.20], [0.8, 1.25, 0.5])
  const checkmarkOpacity = useTransform(smoothProgress, [0, 0.08, 0.18, 0.22], [0, 1, 1, 0])

  // Layer 2: Store Reception Horizontal Slide
  const storeSlideX = useTransform(smoothProgress, [0.15, 0.25, 0.38, 0.44], ["100%", "0%", "0%", "-100%"])
  const storeOpacity = useTransform(smoothProgress, [0.16, 0.22, 0.36, 0.42], [0, 1, 1, 0])

  // Layer 3: Assembly Line multi-speed depth
  const packBgX = useTransform(smoothProgress, [0.35, 0.60], ["15%", "-15%"])         // 0.2x speed
  const packShelvesX = useTransform(smoothProgress, [0.35, 0.60], ["40%", "-40%"])   // 0.6x speed
  const packBagX = useTransform(smoothProgress, [0.35, 0.60], ["70%", "-70%"])       // 1.0x speed
  const packOpacity = useTransform(smoothProgress, [0.36, 0.42, 0.56, 0.62], [0, 1, 1, 0])

  // Layer 4: En Route Multilayer Street & Scooter
  const skylineX = useTransform(smoothProgress, [0.55, 0.82], ["0%", "-20%"])         // 0.2x slow skyline
  const buildingsX = useTransform(smoothProgress, [0.55, 0.82], ["0%", "-60%"])       // 0.6x medium buildings
  const roadX = useTransform(smoothProgress, [0.55, 0.82], ["0%", "-120%"])           // 1.0x fast road
  const transitOpacity = useTransform(smoothProgress, [0.56, 0.62, 0.77, 0.82], [0, 1, 1, 0])

  // Layer 5: OTP Handshake Z-Axis Forward Float
  const doorstepOpacity = useTransform(smoothProgress, [0.76, 0.84, 1.0], [0, 1, 1])
  const otpCardZ = useTransform(smoothProgress, [0.78, 0.92], [-180, 0])
  const otpCardScale = useTransform(smoothProgress, [0.78, 0.92], [0.7, 1])
  const otpCardRotateX = useTransform(smoothProgress, [0.78, 0.92], [25, 0])

  // Determine active stage based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.20) setActiveStage(0)
      else if (latest < 0.40) setActiveStage(1)
      else if (latest < 0.60) setActiveStage(2)
      else if (latest < 0.80) setActiveStage(3)
      else setActiveStage(4)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  const scrollToStage = (index: number) => {
    setActiveStage(index)
    if (!containerRef.current) return
    const containerTop = containerRef.current.offsetTop
    const containerHeight = containerRef.current.offsetHeight
    const stageHeight = containerHeight / 5
    window.scrollTo({
      top: containerTop + (index * stageHeight) + 40,
      behavior: 'smooth'
    })
  }

  const current = STAGES[activeStage]

  return (
    <section 
      id="how-it-works"
      ref={containerRef}
      className="relative min-h-[500vh] bg-slate-950 text-white selection:bg-emerald-500 selection:text-white"
    >
      {/* Sticky Viewport Window */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 py-5 z-20">
        
        {/* Parallax Background Glowing Depth */}
        <motion.div 
          style={{ y: ambientY }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute -top-10 left-1/3 w-[650px] h-[650px] bg-emerald-500/15 blur-[160px] rounded-full" />
          <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full" />
          <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-blue-500/10 blur-[130px] rounded-full" />
        </motion.div>

        {/* Top Header / Parallax Timeline Navigation */}
        <div className="w-full max-w-7xl mx-auto pt-2 relative z-30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                5-Stage Parallax Delivery Experience
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mt-1.5">
                From Craving to Doorstep <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">in 10 Minutes</span>
              </h2>
            </div>

            {/* 5 Stage Checkpoint Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              {STAGES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => scrollToStage(idx)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeStage === idx
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-950/40 scale-102'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStage === idx ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                  <span>{s.time}</span>
                  <span className="hidden md:inline">• {s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Smooth Continuous Scroll Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
            <motion.div 
              style={{ scaleX: smoothProgress, transformOrigin: "0%" }}
              className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300"
            />
          </div>
        </div>

        {/* Center Canvas: Left Stage Narrative + Right 5-Layer Visual Stage */}
        <div className="w-full max-w-7xl mx-auto my-auto relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Narrative Panel */}
          <div className="lg:col-span-4 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.35 }}
                className="space-y-4 bg-slate-900/85 border border-white/15 p-6 sm:p-7 rounded-3xl backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" /> Stage {activeStage + 1}/5 • {current.time}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                    {current.layerTitle}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {current.headline}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {current.subhead}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 hover:scale-103 active:scale-98 transition-all"
                  >
                    Order in 10 Mins (₹) <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => scrollToStage((activeStage + 1) % STAGES.length)}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/15 border border-white/10 transition cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Parallax Stage Container with 3D Depth Perspective */}
          <div className="lg:col-span-8 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px] perspective-[1200px] overflow-hidden rounded-3xl bg-slate-950/70 border border-white/10 shadow-2xl p-4 sm:p-6">
            
            {/* ========================================================= */}
            {/* STAGE 1: Handheld Device & Floating Checkmark Layer       */}
            {/* ========================================================= */}
            <motion.div 
              style={{ scale: phoneScale, opacity: phoneOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-full max-w-sm bg-slate-900/95 rounded-3xl p-5 border border-emerald-500/40 shadow-2xl relative backdrop-blur-xl">
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-slate-200">SnapCart Checkout</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    ⚡ 10 min guarantee
                  </span>
                </div>

                {/* Cart items */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥑</span>
                      <div>
                        <p className="text-xs font-bold text-white">Fresh Indian Avocados (2 pcs)</p>
                        <p className="text-[11px] text-emerald-400 font-bold">₹149</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded-md">Added ✓</span>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥛</span>
                      <div>
                        <p className="text-xs font-bold text-white">Farm Fresh Milk (1L)</p>
                        <p className="text-[11px] text-emerald-400 font-bold">₹68</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded-md">Added ✓</span>
                  </div>
                </div>

                {/* 1-Tap Place Order Button */}
                <div className="mt-4 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-center shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Order #SC-8924 Placed • ₹217
                  </span>
                </div>

                {/* Floating Pulses Checkmark ascending to Midground */}
                <motion.div 
                  style={{ y: checkmarkY, scale: checkmarkScale, opacity: checkmarkOpacity }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 p-4 rounded-full shadow-2xl shadow-emerald-400/50 border-4 border-slate-900 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 stroke-[3]" />
                </motion.div>
              </div>
            </motion.div>

            {/* ========================================================= */}
            {/* STAGE 2: Store Reception (Dark / Warehouse Layer)        */}
            {/* ========================================================= */}
            <motion.div 
              style={{ x: storeSlideX, opacity: storeOpacity }}
              className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-lg bg-slate-900/95 rounded-3xl p-6 border border-blue-500/40 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/40">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Dark Store Hub #04</h4>
                      <p className="text-[10px] text-blue-300">Hyperlocal Fulfillment Center (1.2 km away)</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full animate-pulse">
                    Live Ticket Accepted
                  </span>
                </div>

                {/* Incoming Ticket Terminal */}
                <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400 font-bold">Ticket: #SC-8924</span>
                    <span className="text-slate-400">Received 4s ago</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-200 truncate">Aisle 2B • Avocados</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-200 truncate">Chiller 1 • Fresh Milk</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-blue-900/30 border border-blue-400/20 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-blue-200 font-medium">Auto-assigned Picker: Team Alpha</span>
                    <span className="text-emerald-400 font-bold">120s Timer Started ⏱️</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ========================================================= */}
            {/* STAGE 3: Item Packing (Assembly Line Layer - Multi Depth) */}
            {/* ========================================================= */}
            <motion.div 
              style={{ opacity: packOpacity }}
              className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-lg bg-slate-900/95 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-4">
                
                {/* 0.2x Warehouse Background Layer */}
                <motion.div style={{ x: packBgX }} className="flex items-center justify-between text-slate-500 text-xs border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Micro-Warehouse Grid</span>
                  <span className="text-[10px] text-cyan-400">Depth: 0.2x Background</span>
                </motion.div>

                {/* 0.6x Shelves & Produce Parallax Layer */}
                <motion.div style={{ x: packShelvesX }} className="grid grid-cols-3 gap-3 py-2">
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                    <span className="text-3xl mb-1">🥦</span>
                    <span className="text-[10px] text-slate-300 font-bold">Fresh Farm</span>
                    <span className="text-[9px] text-emerald-400 font-bold">Inspected ✓</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                    <span className="text-3xl mb-1">🥑</span>
                    <span className="text-[10px] text-slate-300 font-bold">Ripe Hass</span>
                    <span className="text-[9px] text-emerald-400 font-bold">Inspected ✓</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                    <span className="text-3xl mb-1">🍓</span>
                    <span className="text-[10px] text-slate-300 font-bold">Chilled Pack</span>
                    <span className="text-[9px] text-emerald-400 font-bold">Inspected ✓</span>
                  </div>
                </motion.div>

                {/* 1.0x Grocery Bag & Laser Sealing Layer */}
                <motion.div style={{ x: packBagX }} className="bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-400/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-white">Insulated SnapCart Eco-Bag</h5>
                      <p className="text-[10px] text-emerald-300 flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5" /> Thermal Seal Barcode Applied
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-xl shadow-sm">
                    Bagged & Ready
                  </span>
                </motion.div>

              </div>
            </motion.div>

            {/* ========================================================= */}
            {/* STAGE 4: En Route (Transit Multilayer Parallax)          */}
            {/* ========================================================= */}
            <motion.div 
              style={{ opacity: transitOpacity }}
              className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-lg bg-slate-900/95 rounded-3xl p-6 border border-amber-500/40 shadow-2xl backdrop-blur-xl space-y-4">
                
                {/* Transit HUD */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
                    <Navigation className="w-4 h-4" /> Live GPS Dispatch Radar
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold px-2.5 py-1 rounded-full animate-pulse">
                    ⚡ 2 Mins Away (350m)
                  </span>
                </div>

                {/* Multilayer Street Simulation Canvas */}
                <div className="h-44 bg-slate-950/90 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
                  
                  {/* Layer 1: 0.2x Distant City Skyline */}
                  <motion.div 
                    style={{ x: skylineX }}
                    className="absolute top-3 left-0 right-0 flex justify-around text-slate-700 text-2xl select-none opacity-40"
                  >
                    🏢 🏬 🏨 🏢 🏬 🏨 🏢 🏬
                  </motion.div>

                  {/* Layer 2: 0.6x Midground Streetlights & Buildings */}
                  <motion.div 
                    style={{ x: buildingsX }}
                    className="absolute top-10 left-0 right-0 flex justify-around text-slate-600 text-xl select-none opacity-70"
                  >
                    🏪 🚏 🌳 🏪 🚏 🌳 🏪
                  </motion.div>

                  {/* Radar Concentric Rings */}
                  <div className="absolute w-36 h-36 rounded-full border border-amber-500/20 animate-ping" />
                  <div className="absolute w-64 h-64 rounded-full border border-amber-500/10" />

                  {/* Layer 3: 1.0x Fast Electric Scooter with Speed Motion */}
                  <motion.div 
                    className="relative z-10 flex flex-col items-center bg-amber-500 text-slate-950 p-3 rounded-2xl shadow-xl shadow-amber-500/40"
                  >
                    <Bike className="w-8 h-8" />
                  </motion.div>

                  {/* Road Asphalt & Dash Lines */}
                  <motion.div 
                    style={{ x: roadX }}
                    className="absolute bottom-2 left-0 right-0 h-3 border-t-2 border-dashed border-amber-400/40"
                  />

                  {/* Live in-app rider chat popup */}
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-slate-200 shadow-md">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Rider: <i>&ldquo;I have reached your building gate! 🛵&rdquo;</i></span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* ========================================================= */}
            {/* STAGE 5: OTP Handshake & Fulfilled (Z-Axis Forward Float) */}
            {/* ========================================================= */}
            <motion.div 
              style={{ opacity: doorstepOpacity }}
              className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
            >
              {/* Doorstep Frame */}
              <div className="w-full max-w-lg relative flex flex-col items-center justify-center">
                
                {/* 3D Floating OTP Card along Z-Axis */}
                <motion.div 
                  style={{ 
                    translateZ: otpCardZ, 
                    scale: otpCardScale, 
                    rotateX: otpCardRotateX 
                  }}
                  className="w-full max-w-md bg-slate-900/95 border-2 border-emerald-400/60 rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.35)] backdrop-blur-2xl text-center space-y-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 12 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/30"
                  >
                    <CheckCircle2 className="w-9 h-9" />
                  </motion.div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-white">
                      Delivered In 09:24 Mins! 🎉
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Doorstep handshake verified & fulfilled.
                    </p>
                  </div>

                  {/* 4-Digit OTP Floating Input Card */}
                  <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-left">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Delivery OTP Verified</p>
                        <p className="text-[10px] text-slate-400">Security match confirmed</p>
                      </div>
                    </div>
                    
                    {/* 4 Distinct OTP Slots */}
                    <div className="flex items-center gap-1.5 font-mono text-sm font-black text-emerald-300">
                      <span className="w-7 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shadow-xs">8</span>
                      <span className="w-7 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shadow-xs">4</span>
                      <span className="w-7 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shadow-xs">9</span>
                      <span className="w-7 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shadow-xs">2</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-center gap-2 text-xs text-emerald-300 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-300" /> Farm-fresh produce safely in your kitchen!
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>

        </div>

        {/* Bottom Scroll Indicator & Stage Tracker */}
        <div className="w-full max-w-7xl mx-auto pb-1 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-2.5 relative z-30">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Scroll to travel through the 5 parallax layers
          </span>
          <span className="text-amber-300 font-bold">
            SnapCart Hyperlocal 10-Min Fast Track ⚡
          </span>
        </div>

      </div>
    </section>
  )
}
