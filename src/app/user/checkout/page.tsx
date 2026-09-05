"use client"
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import {
  ArrowLeft, Banknote, Building, Check, Clock, CreditCardIcon, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, ShieldCheck, Sparkles, Tag, Truck, User, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import dynamic from "next/dynamic";

const CheckoutMap = dynamic(() => import("@/components/CheckoutMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-2 text-emerald-600" size={32} />
        <p className="text-gray-600 text-sm">Loading map...</p>
      </div>
    </div>
  )
});

const DELIVERY_SLOTS = [
  { id: "express", title: "Instant Express", subtitle: "Delivered in 10-15 mins", icon: Zap, popular: true },
  { id: "morning", title: "Morning (7:00 - 9:00 AM)", subtitle: "Fresh breakfast start", icon: Clock },
  { id: "afternoon", title: "Afternoon (1:00 - 3:00 PM)", subtitle: "Lunch essentials", icon: Clock },
  { id: "evening", title: "Evening (6:00 - 8:00 PM)", subtitle: "Dinner & evening snacks", icon: Clock },
];

function Checkout() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subTotal } = useSelector((state: RootState) => state.cart);
  const { appliedCoupon, discountAmount } = useSelector((state: RootState) => state.coupon);

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [selectedSlot, setSelectedSlot] = useState("express");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Totals
  const actualDeliveryFee = appliedCoupon?.discountType === 'free_delivery' ? 0 : (subTotal >= 100 ? 0 : 40);
  const finalPayable = Math.max(0, subTotal + actualDeliveryFee - discountAmount);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      }, (err) => { console.log("location error", err); }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData?.name || "",
        mobile: userData?.mobile || ""
      }));
    }
  }, [userData]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return null;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json&accept-language=en`
        );
        const data = result.data.address;
        setAddress((prev) => ({
          ...prev,
          city: data.city || data.town || data.village || "",
          state: data.state || "",
          pincode: data.postcode || "",
        }));
      } catch (error) {
        console.log("Reverse Geocoding Error:", error);
      }
    };
    fetchAddress();
  }, [position]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      }, (err) => { console.log("location error", err); }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(address.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!address.fullAddress.trim()) newErrors.fullAddress = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";

    if (!address.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    if (!position) newErrors.location = "Please set your location on the map";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCod = async () => {
    if (!position) return null;
    setIsProcessing(true);
    try {
      await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map(item => ({
          product: item._id,
          name: item.name,
          sellingPrice: item.sellingprice,
          size: item.size,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: finalPayable,
        deliverySlot: selectedSlot,
        appliedCoupon: appliedCoupon?.code,
        discountAmount: discountAmount,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          fullAddress: address.fullAddress,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          latitude: position[0],
          longitude: position[1]
        },
        paymentMethod
      });
      router.push("/user/order-success");
    } catch (error) {
      console.error("COD error:", error);
      alert("Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }
    if (!position) {
      alert("Please set your delivery location on the map");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map(item => ({
          product: item._id,
          name: item.name,
          sellingPrice: item.sellingprice,
          size: item.size,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: finalPayable,
        deliverySlot: selectedSlot,
        appliedCoupon: appliedCoupon?.code,
        discountAmount: discountAmount,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1]
        },
        paymentMethod
      });

      if (result.data && result.data.url) {
        window.location.href = result.data.url;
      } else {
        throw new Error("No payment URL received from server");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error?.response?.data?.message || "Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      if (paymentMethod === "cod") {
        handleCod();
      } else {
        handleOnlinePayment();
      }
    } else {
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-[94%] sm:w-[90%] md:w-[85%] max-w-7xl mx-auto py-6 mb-20 relative">
      {/* Back button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-xs sm:text-sm mb-6 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100 cursor-pointer"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to Cart</span>
      </motion.button>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Express Checkout
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Select delivery slot, provide address, and choose your payment method.
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Address & Delivery Slot */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Slot Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Choose Delivery Time</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {DELIVERY_SLOTS.map((slot) => {
                const Icon = slot.icon;
                const isSelected = selectedSlot === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                        : "border-gray-200/80 hover:border-emerald-300 bg-gray-50/50"
                    }`}
                  >
                    {slot.popular && (
                      <span className="absolute -top-2 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        ⚡ Fastest
                      </span>
                    )}
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{slot.title}</h4>
                        <p className="text-[11px] text-gray-500">{slot.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <MapPin className="text-emerald-600 w-5 h-5" /> Delivery Address
            </h2>

            <div className="space-y-3.5">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, fullName: e.target.value }));
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  className={`pl-10 w-full border rounded-xl p-3 text-xs sm:text-sm bg-gray-50/60 focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>}
              </div>

              {/* Mobile */}
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Contact Mobile No. (10 digits)"
                  value={address.mobile}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, mobile: e.target.value }));
                    if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                  }}
                  className={`pl-10 w-full border rounded-xl p-3 text-xs sm:text-sm bg-gray-50/60 focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                    errors.mobile ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobile}</p>}
              </div>

              {/* Full Address */}
              <div className="relative">
                <Home className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <textarea
                  name="fullAddress"
                  placeholder="Complete Address (Flat / House No., Street, Landmark)"
                  value={address.fullAddress}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, fullAddress: e.target.value }));
                    if (errors.fullAddress) setErrors(prev => ({ ...prev, fullAddress: '' }));
                  }}
                  rows={2}
                  className={`pl-10 w-full border rounded-xl p-3 text-xs sm:text-sm bg-gray-50/60 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none ${
                    errors.fullAddress ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.fullAddress && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullAddress}</p>}
              </div>

              {/* City & State & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => {
                      setAddress((prev) => ({ ...prev, city: e.target.value }));
                      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                    }}
                    className="pl-9 w-full border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm bg-gray-50/60 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <Navigation className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => {
                      setAddress((prev) => ({ ...prev, state: e.target.value }));
                      if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
                    }}
                    className="pl-9 w-full border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm bg-gray-50/60 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => {
                      setAddress((prev) => ({ ...prev, pincode: e.target.value }));
                      if (errors.pincode) setErrors(prev => ({ ...prev, pincode: '' }));
                    }}
                    className="pl-9 w-full border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm bg-gray-50/60 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Map */}
              <div className="relative mt-4 h-[240px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                {position ? (
                  <CheckoutMap position={position} setPosition={(pos: [number, number]) => setPosition(pos)} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Loader2 className="animate-spin text-emerald-600" size={28} />
                  </div>
                )}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  className="absolute bottom-3 right-3 bg-emerald-600 text-white shadow-lg rounded-full p-2.5 hover:bg-emerald-700 transition-all flex items-center justify-center z-1000 cursor-pointer"
                  onClick={handleCurrentLocation}
                  title="Detect GPS location"
                >
                  <LocateFixed size={18} />
                </motion.button>
              </div>
              <p className="text-[11px] text-gray-500">
                📍 Drag marker on map to fine-tune your doorstep delivery pin.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Bill Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Banknote size={20} className="text-emerald-600" />
              <span>Payment Option</span>
            </h2>

            <div className="space-y-2.5">
              {/* Online Payment */}
              <div
                onClick={() => setPaymentMethod("online")}
                className={`flex items-center gap-3 border-2 rounded-2xl p-3.5 transition-all cursor-pointer ${
                  paymentMethod === "online"
                    ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "online" ? "border-emerald-600" : "border-gray-300"
                }`}>
                  {paymentMethod === "online" && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                </div>
                <CreditCardIcon className="text-emerald-600 w-5 h-5" />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-gray-900 block">
                    Online Payment (Cards, UPI, Stripe)
                  </span>
                  <span className="text-[11px] text-gray-500">Instant & 100% Secure Checkout</span>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-3 border-2 rounded-2xl p-3.5 transition-all cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "cod" ? "border-emerald-600" : "border-gray-300"
                }`}>
                  {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                </div>
                <Truck className="text-emerald-600 w-5 h-5" />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-gray-900 block">
                    Cash On Delivery (COD)
                  </span>
                  <span className="text-[11px] text-gray-500">Pay via cash/UPI upon delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Final Total */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Order Breakdown
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal ({cartData.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-semibold text-gray-800">₹{subTotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon ({appliedCoupon.code})
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                {actualDeliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">FREE</span>
                ) : (
                  <span className="font-semibold text-gray-800">₹{actualDeliveryFee}</span>
                )}
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-base font-black text-gray-900">Total Payable</span>
                <span className="text-2xl font-black text-emerald-700">₹{finalPayable.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={isProcessing || !cartData?.length}
              className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>
                    {paymentMethod === "online" ? `Pay ₹${finalPayable.toFixed(2)} with Stripe` : `Place COD Order (₹${finalPayable.toFixed(2)})`}
                  </span>
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>100% Safe & Contactless Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;