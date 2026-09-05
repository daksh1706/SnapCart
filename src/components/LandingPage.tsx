'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Leaf, 
  CheckCircle, 
  Truck,
  TrendingUp,
  Percent,
  Layers,
  Heart
} from 'lucide-react'
import SnapCartLogo from './SnapCartLogo'
import DeliveryStoryScroll from './DeliveryStoryScroll'
import Footer from './Footer'

const categories = [
  { name: "Fresh Fruits & Veggies", icon: "🥦", color: "from-green-500/20 to-emerald-500/10", border: "border-green-300" },
  { name: "Dairy, Bread & Eggs", icon: "🥛", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-300" },
  { name: "Snacks & Munchies", icon: "🍿", color: "from-amber-500/20 to-yellow-500/10", border: "border-amber-300" },
  { name: "Cold Drinks & Juices", icon: "🧃", color: "from-orange-500/20 to-red-500/10", border: "border-orange-300" },
  { name: "Instant & Packaged Food", icon: "🍜", color: "from-red-500/20 to-pink-500/10", border: "border-red-300" },
  { name: "Household Essentials", icon: "🧼", color: "from-teal-500/20 to-cyan-500/10", border: "border-teal-300" }
]

const features = [
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: "10-Minute Hyperlocal Delivery",
    description: "Our distributed micro dark-stores are positioned within 2km of your doorstep for lightning-speed fulfillment."
  },
  {
    icon: <Leaf className="w-6 h-6 text-emerald-500" />,
    title: "100% Farm-Fresh Guarantee",
    description: "Daily sourced organic produce and fruits freshly harvested from verified local farms and top brands."
  },
  {
    icon: <MapPin className="w-6 h-6 text-blue-500" />,
    title: "Live Radar GPS Tracking",
    description: "Watch your delivery champion ride in real-time on interactive maps with direct in-app chat."
  },
  {
    icon: <Percent className="w-6 h-6 text-purple-500" />,
    title: "Best Daily Deals & Coupons",
    description: "Enjoy daily flash sales, tier discounts, and free delivery thresholds on every single basket."
  }
]

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Mumbai",
    rating: 5,
    comment: "SnapCart literally saved my dinner! I ran out of cooking cream and it arrived in 8 minutes flat. Best delivery service ever!",
    tag: "Verified Buyer"
  },
  {
    name: "Rahul Verma",
    city: "Bangalore",
    rating: 5,
    comment: "The live map tracking and in-app chat with the delivery boy made the experience so effortless. Fresh veggies every morning!",
    tag: "Daily Customer"
  },
  {
    name: "Ananya Patel",
    city: "Delhi",
    rating: 5,
    comment: "Super smooth UI and zero delivery hassle with the OTP handoff. SnapCart is my go-to for daily groceries now.",
    tag: "Verified Buyer"
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      {/* Top Floating Announcement */}
      <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 text-white text-xs py-2 px-4 text-center font-semibold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Get <b>FREE DELIVERY</b> on your first 3 grocery orders with code <b>SNAPFREE</b></span>
      </div>

      {/* Sticky Public Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="w-[92%] max-w-7xl mx-auto h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hover:scale-103 transition-transform">
            <SnapCartLogo variant="dark" size="md" showBadge />
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#how-it-works" className="hover:text-emerald-700 transition">How It Works</a>
            <a href="#categories" className="hover:text-emerald-700 transition">Categories</a>
            <a href="#features" className="hover:text-emerald-700 transition">Why Us</a>
            <a href="#reviews" className="hover:text-emerald-700 transition">Reviews</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold text-gray-700 hover:text-emerald-700 px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 hover:scale-102 active:scale-98 transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-green-50/40 to-slate-50">
        <div className="w-[92%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600" />
              10-Minute Hyperlocal Grocery Delivery
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-black text-slate-900 tracking-tight leading-[1.1]">
              Fresh Groceries at your door in <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent">10 Minutes flat.</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed">
              From fresh organic produce and dairy essentials to midnight munchies — order in a snap, track live on radar, and get it delivered before your kettle boils.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 hover:scale-103 active:scale-98 transition-all"
              >
                <ShoppingBag className="w-5 h-5" /> Start Shopping Now
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-bold text-base px-6 py-4 rounded-2xl border border-gray-200 shadow-sm transition"
              >
                See 10-Min Story <ArrowRight className="w-4 h-4 text-emerald-600" />
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/80">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700">9.4 min</p>
                <p className="text-xs font-semibold text-gray-500">Avg. Delivery Speed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">50,000+</p>
                <p className="text-xs font-semibold text-gray-500">Orders Fulfilled</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center">
                  4.9 <Star className="w-4 h-4 fill-amber-500 ml-1" />
                </p>
                <p className="text-xs font-semibold text-gray-500">App Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Presentation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background glowing blob */}
            <div className="absolute w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
            
            {/* Main Showcase Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-sm text-gray-900">Live Dark-Store Feed</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ⚡ 10 mins away
                </span>
              </div>

              {/* Floating product cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🥑</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Fresh Hass Avocados</h4>
                      <p className="text-[11px] text-gray-500">2 pcs • Farm Fresh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700">₹149</span>
                    <span className="block text-[10px] text-gray-400 line-through">₹199</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🍓</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Organic Strawberries</h4>
                      <p className="text-[11px] text-gray-500">250g • Chilled Box</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700">₹129</span>
                    <span className="block text-[10px] text-gray-400 line-through">₹180</span>
                  </div>
                </div>
              </div>

              {/* Order Status Preview */}
              <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-700/20">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-amber-300 animate-bounce" />
                  <div>
                    <p className="text-xs font-bold">Rider on the move</p>
                    <p className="text-[10px] text-emerald-100">Arriving in 3 mins</p>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="bg-white text-emerald-800 font-extrabold text-xs px-3 py-1.5 rounded-xl hover:scale-105 transition"
                >
                  Order Now
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Popular Categories Section */}
      <section id="categories" className="py-20 bg-white border-t border-b border-gray-100">
        <div className="w-[92%] max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Explore Fresh Categories
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Over 1,000+ handpicked products sourced directly from trusted producers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href="/login"
                className={`p-5 rounded-2xl bg-gradient-to-b ${cat.color} border ${cat.border} flex flex-col items-center text-center group hover:scale-105 transition-all shadow-xs`}
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-extrabold text-gray-800 group-hover:text-emerald-700 transition">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Scrollable Interactive Storytelling Component */}
      <DeliveryStoryScroll />

      {/* Features / Why Choose Us */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="w-[92%] max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Why Customers Love Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-3">
              The SnapCart Advantage
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Engineered with technology and local micro-warehouses to bring speed, freshness, and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="py-20 bg-white border-t border-gray-100">
        <div className="w-[92%] max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Loved by 50,000+ Happy Shoppers
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              See how SnapCart is changing daily grocery runs for thousands of families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                    <p className="text-[10px] text-gray-500">{t.city}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Bottom Action Callout */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white">
        <div className="w-[92%] max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready for the fastest delivery of your life?
          </h2>
          <p className="text-green-100 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of shoppers and get your fresh essentials delivered in 10 minutes flat.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-white hover:bg-green-50 text-emerald-800 font-extrabold text-base px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-98 transition-all"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-base px-6 py-4 rounded-2xl border border-white/20 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* App Footer */}
      <Footer />
    </div>
  )
}
