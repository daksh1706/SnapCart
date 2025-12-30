"use client";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { useRouter } from "next/navigation"; // Added for auto-refresh

import axios from "axios";

import { RootState } from "@/store";

import { getSocket } from "@/lib/socket";

import {

Loader, Package, MapPin, CheckCircle, Clock,

Navigation, MessageSquare, TrendingUp, DollarSign,

Calendar, Award, ChevronRight

} from "lucide-react";

import {

Bar, BarChart, CartesianGrid, ResponsiveContainer,

Tooltip, XAxis, YAxis, Line, LineChart, Area, AreaChart

} from "recharts";



import LiveMap from "./LiveMap";

import DeliveryChat from "./DeliveryChat";



export default function DeliveryBoyDashboard({ revenueData }: { revenueData: any }) {

const router = useRouter();

const [assignments, setAssignments] = useState<any[]>([]);

const { userData } = useSelector((state: RootState) => state.user);


const [activeOrder, setActiveOrder] = useState<any>(null);

const [showOtpBox, setShowOtpBox] = useState(false);

const [otp, setOtp] = useState("");

const [otpError, setOtpError] = useState("");

const [sendOtpLoading, setSendOtpLoading] = useState(false);

const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

const [userLocation, setUserLocation] = useState<any>(null);

const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<any>(null);

const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");



// Fetching logic... (Same as before)

const fetchAssignments = async () => {

try {

const result = await axios.get("/api/delivery/get-assignments");

setAssignments(result.data);

} catch (err) { console.error(err); }

};



const fetchCurrentOrder = async () => {

try {

const result = await axios.get("/api/delivery/current-order");

if (result.data.active) {

setActiveOrder(result.data.assignment);

setUserLocation({

latitude: result.data.assignment.order.address.latitude,

longitude: result.data.assignment.order.address.longitude,

});

}

} catch (err) { console.error(err); }

};



useEffect(() => {

if (userData?._id) {

fetchCurrentOrder();

fetchAssignments();

}

}, [userData]);



useEffect(() => {

if (!userData?._id || typeof window === "undefined") return;

const socket = getSocket();

const watcher = navigator.geolocation.watchPosition(

(pos) => {

const newPos = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };

setDeliveryBoyLocation(newPos);

socket.emit("update-location", { userId: userData._id, ...newPos });

},

(err) => console.log(err), { enableHighAccuracy: true }

);

socket.on("new-assignment", (data: any) => setAssignments((prev) => [data, ...prev]));

return () => { navigator.geolocation.clearWatch(watcher); socket.off("new-assignment"); };

}, [userData?._id]);



const handleAccept = async (id: string) => {

try {

await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);

fetchCurrentOrder();

} catch (err) { console.error(err); }

};



const sendOtp = async () => {

setSendOtpLoading(true);

try {

await axios.post("/api/delivery/otp/send", { orderId: activeOrder.order._id });

setShowOtpBox(true);

} catch (err) { console.error(err); }

finally { setSendOtpLoading(false); }

};



const verifyOtp = async () => {

setVerifyOtpLoading(true);

setOtpError("");

try {

await axios.post("/api/delivery/otp/verify", { orderId: activeOrder.order._id, otp });


// AUTO REFRESH LOGIC

setActiveOrder(null);

setShowOtpBox(false);

setOtp("");

router.refresh(); // This re-runs the Server Component data fetching

await fetchCurrentOrder();

await fetchAssignments();

} catch (err) {

setOtpError("Invalid OTP. Please try again.");

} finally {

setVerifyOtpLoading(false);

}

};



const chartData = selectedPeriod === "week" ? revenueData.weeklyData : revenueData.monthlyData;



// VIEW 1: REVENUE DASHBOARD

if (!activeOrder && assignments.length === 0) {

return (

<div className="min-h-screen bg-[#f8fafc] p-4 pt-24 text-slate-900">

<div className="max-w-7xl mx-auto">

<header className="flex justify-between items-end mb-8">

<div>

<h1 className="text-4xl font-black tracking-tight text-slate-900">Fleet Dashboard</h1>

<p className="text-slate-500 font-medium">Welcome back, {userData?.fullName?.split(' ')[0] || 'Rider'}</p>

</div>

<div className="bg-white shadow-sm border p-2 rounded-2xl flex gap-1">

{['week', 'month'].map((p) => (

<button key={p} onClick={() => setSelectedPeriod(p as any)}

className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedPeriod === p ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>

{p.toUpperCase()}

</button>

))}

</div>

</header>



<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

<StatCard icon={<DollarSign/>} title="Today" val={revenueData.today} color="indigo" />

<StatCard icon={<Calendar/>} title="Week" val={revenueData.week} color="blue" />

<StatCard icon={<TrendingUp/>} title="Month" val={revenueData.month} color="emerald" />

<StatCard icon={<Award/>} title="Year" val={revenueData.year} color="amber" />

<div className="bg-slate-900 rounded-[2rem] p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">

<div className="relative z-10">

<p className="text-xs font-bold opacity-60 uppercase tracking-widest">Lifetime</p>

<p className="text-3xl font-black mt-1">₹{revenueData.total.earnings}</p>

</div>

<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">

<TrendingUp size={120} />

</div>

<p className="text-xs font-medium z-10">{revenueData.total.deliveries} deliveries total</p>

</div>

</div>



<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

<div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">

<h3 className="text-xl font-bold mb-6 flex items-center gap-2">

<div className="w-2 h-6 bg-indigo-600 rounded-full" /> Performance Trend

</h3>

<div className="h-[300px] w-full">

<ResponsiveContainer width="100%" height="100%">

<AreaChart data={chartData}>

<defs>

<linearGradient id="colorEar" x1="0" y1="0" x2="0" y2="1">

<stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>

<stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>

</linearGradient>

</defs>

<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

<XAxis dataKey={selectedPeriod === 'week' ? 'day' : 'week'} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />

<YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />

<Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />

<Area type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorEar)" />

</AreaChart>

</ResponsiveContainer>

</div>

</div>



<div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">

<div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">

<Package size={40} />

</div>

<h3 className="text-2xl font-black mb-2">Finding Tasks</h3>

<p className="text-indigo-100 text-sm leading-relaxed">System is scanning for new orders in your current radius...</p>

<div className="mt-8 flex gap-1">

{[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}

</div>

</div>

</div>

</div>

</div>

);

}



// VIEW 2: ACTIVE ORDER (MODERNIZED)

if (activeOrder && userLocation) {

return (

<div className="pt-24 p-4 max-w-6xl mx-auto min-h-screen bg-[#f8fafc]">

<div className="flex flex-col lg:flex-row gap-8">

<div className="flex-1 space-y-6">

<div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">

<div className="flex justify-between items-start mb-6">

<div>

<span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">On Delivery</span>

<h2 className="text-3xl font-black mt-2">Order #{activeOrder.order._id.slice(-8)}</h2>

</div>

<div className="bg-slate-100 p-4 rounded-2xl"><Package className="text-slate-600" /></div>

</div>

<div className="h-[450px] rounded-[2rem] overflow-hidden border-8 border-slate-50 shadow-inner">

<LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />

</div>

</div>

</div>



<div className="lg:w-96 space-y-6">

<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-[400px]">

<DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id} />

</div>

<div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">

{!showOtpBox ? (

<button onClick={sendOtp} disabled={sendOtpLoading}

className="w-full bg-indigo-500 hover:bg-indigo-400 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95">

{sendOtpLoading ? <Loader className="animate-spin"/> : <CheckCircle/>} Complete Trip

</button>

) : (

<div className="space-y-4">

<p className="text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Verify Customer OTP</p>

<input type="text" maxLength={4} className="w-full text-center text-4xl p-5 bg-white/10 rounded-2xl border border-white/20 focus:border-indigo-400 outline-none font-black"

value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))} placeholder="0000" />

<button onClick={verifyOtp} disabled={verifyOtpLoading || otp.length < 4}

className="w-full bg-emerald-500 hover:bg-emerald-400 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50">

{verifyOtpLoading ? "Verifying..." : "Confirm & Earn ₹40"}

</button>

{otpError && <p className="text-red-400 text-center font-bold text-sm">{otpError}</p>}

</div>

)}

</div>

</div>

</div>

</div>

);

}



// VIEW 3: NEW ASSIGNMENTS

return (

<div className="pt-24 p-4 max-w-4xl mx-auto min-h-screen">

<h2 className="text-4xl font-black mb-8 flex items-center gap-4">Tasks Nearby <span className="bg-indigo-600 text-white text-lg px-4 py-1 rounded-full">{assignments.length}</span></h2>

<div className="space-y-4">

{assignments.map((a, i) => (

<div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-50">

<div className="flex items-center gap-6">

<div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">

<MapPin className="text-slate-400 group-hover:text-indigo-600" />

</div>

<div>

<p className="font-black text-xl">Order #{a.order?._id.slice(-8)}</p>

<p className="text-slate-500 font-medium">{a.order?.address?.fullAddress}</p>

</div>

</div>

<button onClick={() => handleAccept(a._id)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all">

Accept <ChevronRight size={18} />

</button>

</div>

))}

</div>

</div>

);

}



function StatCard({ title, val, color, icon }: any) {

const colors:any = {

indigo: "bg-indigo-50 text-indigo-600",

blue: "bg-blue-50 text-blue-600",

emerald: "bg-emerald-50 text-emerald-600",

amber: "bg-amber-50 text-amber-600"

};

return (

<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-105 transition-transform duration-300">

<div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-4`}>

{icon}

</div>

<p className="text-xs text-slate-400 uppercase font-black tracking-widest">{title}</p>

<p className="text-2xl font-black text-slate-900 mt-1">₹{val.earnings}</p>

<div className="flex items-center gap-1 mt-2">

<span className="text-xs font-bold text-slate-500">{val.deliveries} Tasks</span>

</div>

</div>

);

}