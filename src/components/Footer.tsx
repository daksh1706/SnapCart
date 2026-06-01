'use client'
import { motion } from "framer-motion"
import { Facebook, Instagram, Mail, MapPin, Phone, TwitterIcon } from "lucide-react"
import Link from "next/link"

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-linear-to-r from-green-600 to-green-700 text-white mt-20"
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-500/40 pb-10">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">SnapCart</h2>
            <p className="text-sm text-green-100 leading-relaxed max-w-xs">
              Your one-stop online grocery store delivering freshness to your doorstep.
              Shop smart, eat fresh, and save more every day!
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="#" className="hover:scale-110 transition-transform"><Facebook size={20}/></Link>
              <Link href="#" className="hover:scale-110 transition-transform"><Instagram size={20}/></Link>
              <Link href="#" className="hover:scale-110 transition-transform"><TwitterIcon size={20}/></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-green-100 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/user/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link href="/user/my-orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-green-100 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-green-300"/> Mumbai, India
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-300"/> +91 78784 xxxxx
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-300"/> support@snapcart.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 text-center text-sm text-green-200">
          <p>© {new Date().getFullYear()} SnapCart. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer