"use client"
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import {ArrowLeft, Banknote, Building, Check, CreditCardIcon, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, ShieldCheck, Truck, User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import axios from "axios";

const markerIcon = new L.Icon({
  iconUrl : "https://cdn-icons-png.flaticon.com/128/149/149059.png",
  iconSize : [40,40],
  iconAnchor : [20,40]
})

function Checkout() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector((state: RootState) => state.cart);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },(err)=>{console.log("location error",err)},{enableHighAccuracy:true,maximumAge:0,timeout:10000});
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ ...prev, fullName: userData?.name || "" }));
      setAddress((prev) => ({ ...prev, mobile: userData?.mobile || "" }));
    }
  }, [userData]);

  const DraggableMarker:React.FC = ()=>{
    const map = useMap()
    useEffect(()=>{
      if(position) {
        map.setView(position as LatLngExpression,17,{animate:true})
      }
    },[position,map])
    
    if(!position) return null;
    
    return <Marker icon={markerIcon} position={position as LatLngExpression} draggable={true}
                eventHandlers={{
                  dragend:(e:L.LeafletEvent)=>{
                    const marker = e.target as L.Marker
                    const {lat,lng} = marker.getLatLng()
                    setPosition([lat,lng])
                  }
                }}
                />
  }

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return null;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json&accept-language=en`
        );
        
        const data = result.data.address;
        console.log(result.data);

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

  const handleCurrentLocation = ()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },(err)=>{console.log("location error",err)},{enableHighAccuracy:true,maximumAge:0,timeout:10000});
      }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!address.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(address.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!address.fullAddress.trim()) {
      newErrors.fullAddress = "Address is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    if (!position) {
      newErrors.location = "Please allow location access or drag the marker";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCod = async()=>{
    if(!position)return null
    try {
      const result = axios.post("/api/user/order",{
        userId:userData?._id,
        items:cartData.map(item=>(
          {
            product : item._id,
            name : item.name,
            sellingPrice : item.sellingprice,
            size : item.size,
            unit : item.unit,
            quantity : item.quantity,
            image: item.image
          }
        )),
        totalAmount :finalTotal,
        address:{
          fullName : address.fullName,
          mobile : address.mobile,
          fullAddress : address.fullAddress,
          city : address.city,
          state : address.state,
          pincode : address.pincode,
          latitude : position[0],
          longitude : position[1]
        },
        paymentMethod
      })
      router.push("/user/order-success")
    } catch (error) {
      
    }
  }

  const handleOnlinePayment = async ()=>{
    if(!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }
    
    if(!position) {
      alert("Please set your delivery location on the map");
      return;
    }
    
    setIsProcessing(true);
    
    try {
        console.log("Sending payment request...");
        const result = await axios.post("/api/user/payment",{
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
            totalAmount: finalTotal,
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
        })
        
        console.log("Payment response:", result.data);
        
        if(result.data && result.data.url) {
          console.log("Redirecting to:", result.data.url);
          window.location.href = result.data.url;
        } else {
          throw new Error("No payment URL received from server");
        }
    } catch (error: any) {
        console.error("Payment error details:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Full error response:", error.response);
        
        let errorMessage = "Failed to initiate payment. ";
        
        if (error.response?.data?.error) {
          errorMessage += error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage += error.response.data.message;
        } else if (error.response?.status === 401) {
          errorMessage += "Please login again.";
        } else if (error.response?.status === 500) {
          errorMessage += "Server error. Please check the server logs.";
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += "Please check your connection and try again.";
        }
        
        alert(errorMessage);
        setIsProcessing(false);
    }
  }

  const handlePlaceOrder = () => {
    if (validateForm()) {
      if (paymentMethod === "cod") {
        handleCod();
      } else {
        handleOnlinePayment();
      }
    } else {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">Your order has been received and will be delivered soon.</p>
            <Loader2 className="animate-spin mx-auto text-green-600" size={24} />
          </motion.div>
        </motion.div>
      )}

      {/* Back to cart */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="absolute left-3 top-8 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to Cart</span>
      </motion.button>

      {/* Checkout heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl mt-8 md:text-4xl font-bold text-green-700 text-center mb-8"
      >
        Checkout
      </motion.h1>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Delivery Address Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-600" /> Delivery Address
          </h2>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) => {
                  setAddress((prev) => ({ ...prev, fullName: e.target.value }));
                  if(errors.fullName) setErrors(prev => ({...prev, fullName: ''}));
                }}
                className={`pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  errors.fullName ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                name="mobile"
                placeholder="Contact No. (10 digits)"
                value={address.mobile}
                onChange={(e) => {
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }));
                  if(errors.mobile) setErrors(prev => ({...prev, mobile: ''}));
                }}
                className={`pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  errors.mobile ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobile}</p>
              )}
            </div>

            {/* Full Address */}
            <div className="relative">
              <Home className="absolute left-3 top-3 text-green-600" size={18} />
              <textarea
                name="fullAddress"
                placeholder="Full Address (House No., Street, Landmark)"
                value={address.fullAddress}
                onChange={(e) => {
                  setAddress((prev) => ({ ...prev, fullAddress: e.target.value }));
                  if(errors.fullAddress) setErrors(prev => ({...prev, fullAddress: ''}));
                }}
                rows={3}
                className={`pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none ${
                  errors.fullAddress ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.fullAddress && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullAddress}</p>
              )}
            </div>

            {/* City */}
            <div className="relative">
              <Building className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={(e) => {
                  setAddress((prev) => ({ ...prev, city: e.target.value }));
                  if(errors.city) setErrors(prev => ({...prev, city: ''}));
                }}
                className={`pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  errors.city ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>
              )}
            </div>

            {/* State & Pincode */}
            <div className="grid grid-cols-2 gap-3">
              {/* State */}
              <div className="relative">
                <Navigation className="absolute left-3 top-3 text-green-600" size={18} />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, state: e.target.value }));
                    if(errors.state) setErrors(prev => ({...prev, state: ''}));
                  }}
                  className={`pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                    errors.state ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              {/* Pincode */}
              <div className="relative">
                <Search className="absolute left-3 top-3 text-green-600" size={18} />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, pincode: e.target.value }));
                    if(errors.pincode) setErrors(prev => ({...prev, pincode: ''}));
                  }}
                  className={`pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                    errors.pincode ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Map Display */}
            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position ? (
                <MapContainer
                  center={position as LatLngExpression}
                  zoom={17}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker />
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-2 text-green-600" size={32} />
                    <p className="text-gray-600 text-sm">Loading map...</p>
                  </div>
                </div>
              )}
              <motion.button
                whileTap={{scale:0.93}}
                className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-1000"
                onClick={handleCurrentLocation}
              >
                <LocateFixed />
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Drag the marker to adjust your exact delivery location
            </p>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>
        </motion.div>

        {/* Payment & Order Summary Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Banknote size={24} className="text-green-600" />
              Payment Method
            </h2>
            <div className="space-y-3">
              {/* Online Payment */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod("online")}
                className={`flex items-center gap-3 w-full border-2 rounded-xl p-4 transition-all ${
                  paymentMethod === "online"
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "online" ? "border-green-600" : "border-gray-300"
                }`}>
                  {paymentMethod === "online" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full bg-green-600"
                    />
                  )}
                </div>
                <CreditCardIcon className={paymentMethod === "online" ? "text-green-600" : "text-gray-600"} />
                <div className="text-left">
                  <span className={`font-medium block ${paymentMethod === "online" ? "text-green-700" : "text-gray-700"}`}>
                    Pay Online (Stripe)
                  </span>
                  <span className="text-xs text-gray-500">Secure card payment</span>
                </div>
              </motion.button>

              {/* Cash on Delivery */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-3 w-full border-2 rounded-xl p-4 transition-all ${
                  paymentMethod === "cod"
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "cod" ? "border-green-600" : "border-gray-300"
                }`}>
                  {paymentMethod === "cod" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full bg-green-600"
                    />
                  )}
                </div>
                <Truck className={paymentMethod === "cod" ? "text-green-600" : "text-gray-600"} />
                <div className="text-left">
                  <span className={`font-medium block ${paymentMethod === "cod" ? "text-green-700" : "text-gray-700"}`}>
                    Cash On Delivery
                  </span>
                  <span className="text-xs text-gray-500">Pay when you receive</span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm">Subtotal</span>
                <span className="font-semibold">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm">Delivery Fee</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {/* Free Delivery Indicator */}
              {subTotal >= 100 ? (
                <div className="py-3 px-4 rounded-lg border border-green-200 bg-linear-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check size={18} className="shrink-0" />
                    <span className="text-sm font-medium">
                      🎉 Yay! You got free delivery
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-3 px-4 rounded-lg border border-yellow-200 bg-linear-to-r from-yellow-50 to-amber-50">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Truck size={18} className="shrink-0" />
                    <span className="text-sm font-medium">
                      Shop ₹{(100 - subTotal).toFixed(2)} more for free delivery
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-green-700">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={isProcessing || !cartData?.length}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  {paymentMethod === "online" ? (
                    <>
                      <CreditCardIcon size={20} />
                      Pay ₹{finalTotal.toFixed(2)}
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Place Order
                    </>
                  )}
                </>
              )}
            </motion.button>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={14} className="text-green-600" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;