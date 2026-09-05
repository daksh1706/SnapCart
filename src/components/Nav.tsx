"use client";
import {
  Boxes, ClipboardCheck, Heart, LogOut, Menu, Package, PlusCircle, Search,
  ShoppingCartIcon, User, X, Users, UserCheck, Settings, MapPin
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import WishlistDrawer from "./WishlistDrawer";
import FlashDealBanner from "./FlashDealBanner";
import SnapCartLogo from "./SnapCartLogo";

interface IUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

function Nav({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const profileDropDown = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartData } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCartCount = cartData.reduce((total, item) => total + item.quantity, 0);

  const sideBar = menuOpen ? createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 14 }}
        className="fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-9999 bg-gradient-to-b from-emerald-800 via-emerald-700 to-green-900 backdrop-blur-xl border-r border-emerald-400/20 shadow-2xl flex flex-col p-6 text-white"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-extrabold text-2xl tracking-wide text-white/90">Admin Panel</h1>
          <button className="text-white/80 hover:text-red-400 text-2xl font-bold transition cursor-pointer" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>
        <div className="flex items-center gap-3 p-3 mt-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all shadow-inner">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400/60 shadow-lg flex items-center justify-center bg-emerald-800">
            {user.image ? (
              <Image src={user.image} alt="user" fill className="object-cover rounded-full" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
            <p className="text-xs text-emerald-200 capitalize tracking-wide">{user.role}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 font-medium mt-6">
          <Link href={"/admin/add-grocery"} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:pl-4 transition-all" onClick={() => setMenuOpen(false)}>
            <PlusCircle className="w-5 h-5 text-emerald-300" /> Add Grocery
          </Link>
          <Link href={"/admin/view-grocery"} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:pl-4 transition-all" onClick={() => setMenuOpen(false)}>
            <Boxes className="w-5 h-5 text-emerald-300" /> View Grocery
          </Link>
          <Link href={"/admin/manage-orders"} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:pl-4 transition-all" onClick={() => setMenuOpen(false)}>
            <ClipboardCheck className="w-5 h-5 text-emerald-300" /> Manage Orders
          </Link>
          <Link href={"/admin/manage-users"} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:pl-4 transition-all" onClick={() => setMenuOpen(false)}>
            <Users className="w-5 h-5 text-emerald-300" /> Manage Users & Staff
          </Link>
        </div>
        <div className="my-5 border-t border-white/20"></div>
        <div
          className="flex items-center gap-3 font-semibold text-red-300 mt-auto hover:bg-red-500/20 p-3 rounded-xl transition-all cursor-pointer"
          onClick={async () => await signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-5 h-5 text-red-300" /> Logout
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) {
      return router.push("/");
    }
    router.push(`/?q=${encodeURIComponent(query)}`);
    setSearch("");
    setSearchBarOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col items-center bg-white/70 backdrop-blur-md transition-all shadow-xs">
      {/* Flash Deals Banner for Customers */}
      {user.role === "user" && <FlashDealBanner />}

      {/* Main Navbar Bar */}
      <div className="w-[95%] max-w-7xl mx-auto my-2.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 rounded-2xl shadow-lg shadow-emerald-950/20 flex justify-between items-center h-18 px-4 md:px-7 border border-white/15">
        {/* Brand Logo */}
        <Link
          href={"/"}
          className="hover:scale-105 active:scale-98 transition-all shrink-0 group flex items-center"
        >
          <SnapCartLogo variant="light" size="md" />
        </Link>

        {/* Desktop Search Bar */}
        {user.role === "user" && (
          <div className="hidden md:block relative w-1/2 max-w-md" ref={searchContainerRef}>
            <form
              className="flex items-center bg-white/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-yellow-300 rounded-2xl px-4 py-2.5 w-full shadow-inner transition-all"
              onSubmit={handleSearch}
            >
              <Search className="text-gray-400 w-4 h-4 mr-2.5 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search fresh fruits, veggies, snacks..."
                className="w-full outline-none text-gray-800 text-xs sm:text-sm placeholder-gray-400 bg-transparent font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Action Items */}
        <div className="flex items-center gap-2.5 md:gap-4 relative shrink-0">
          {user.role === "user" && (
            <>
              {/* Mobile Search Toggle */}
              <div
                className="bg-white/90 hover:bg-white text-emerald-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer md:hidden"
                onClick={() => setSearchBarOpen((prev) => !prev)}
              >
                <Search className="w-5 h-5" />
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative bg-white/90 hover:bg-white text-emerald-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlistItems.length > 0 ? 'text-red-500 fill-red-500' : 'text-emerald-700'}`} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-xs animate-scale">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <Link
                href={"/user/cart"}
                className="relative bg-white text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition"
                title="Cart"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {user.role === "admin" && (
            <>
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href={"/admin/add-grocery"}
                  className="flex items-center gap-1.5 bg-white/95 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-white hover:scale-102 transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" /> Add Item
                </Link>
                <Link
                  href={"/admin/view-grocery"}
                  className="flex items-center gap-1.5 bg-white/95 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-white hover:scale-102 transition-all shadow-xs"
                >
                  <Boxes className="w-4 h-4 text-emerald-600" /> Groceries
                </Link>
                <Link
                  href={"/admin/manage-orders"}
                  className="flex items-center gap-1.5 bg-white/95 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-white hover:scale-102 transition-all shadow-xs"
                >
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" /> Orders
                </Link>
                <Link
                  href={"/admin/manage-users"}
                  className="flex items-center gap-1.5 bg-white/95 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-white hover:scale-102 transition-all shadow-xs"
                >
                  <Users className="w-4 h-4 text-emerald-600" /> Users & Staff
                </Link>
              </div>
              <div
                className="lg:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <Menu className="text-emerald-700 w-5 h-5" />
              </div>
            </>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropDown}>
            <div
              className="bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer border-2 border-emerald-300"
              onClick={() => setOpen((prev) => !prev)}
            >
              {user.image ? (
                <Image src={user.image} alt="user" fill className="object-cover rounded-full" />
              ) : (
                <User className="text-emerald-700 w-5 h-5" />
              )}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-999"
                >
                  <div className="flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 bg-emerald-50/50 rounded-xl mb-1">
                    <div className="w-9 h-9 relative rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                      {user.image ? (
                        <Image src={user.image} alt="user" fill className="object-cover rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-gray-900 font-bold text-sm truncate">{user.name}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold capitalize">{user.role}</div>
                    </div>
                  </div>

                  {/* Profile Link for User / Delivery Partner */}
                  <Link
                    href={user.role === "deliveryBoy" ? "/delivery/profile" : "/user/profile"}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-emerald-50 rounded-xl text-gray-700 text-xs font-semibold transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-emerald-600" /> My Profile & Security
                  </Link>

                  {user.role === "user" && (
                    <>
                      <Link
                        href="/user/my-orders"
                        className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-emerald-50 rounded-xl text-gray-700 text-xs font-semibold transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <Package className="w-4 h-4 text-emerald-600" /> My Orders & History
                      </Link>
                      <button
                        onClick={() => {
                          setOpen(false);
                          setWishlistOpen(true);
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 hover:bg-emerald-50 rounded-xl text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-red-500" /> Saved Wishlist ({wishlistItems.length})
                      </button>
                    </>
                  )}

                  {user.role === "admin" && (
                    <Link
                      href="/admin/manage-users"
                      className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-emerald-50 rounded-xl text-gray-700 text-xs font-semibold transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Users className="w-4 h-4 text-emerald-600" /> Manage Users & Staff
                    </Link>
                  )}

                  <button
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 hover:bg-red-50 rounded-xl text-red-600 text-xs font-bold transition-colors cursor-pointer mt-1"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                  >
                    <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {sideBar}

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchBarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-[92%] max-w-lg bg-white rounded-2xl shadow-2xl z-40 p-3 mb-2 border border-gray-100 md:hidden"
          >
            <form className="flex items-center gap-2" onSubmit={handleSearch}>
              <Search className="text-gray-400 w-5 h-5 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                autoFocus
                className="w-full outline-none text-gray-800 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchBarOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </header>
  );
}

export default Nav;
