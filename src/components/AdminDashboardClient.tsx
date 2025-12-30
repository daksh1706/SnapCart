'use client'
import { motion, AnimatePresence } from "framer-motion"
import { IndianRupee, Package, Truck, Users, TrendingUp, BarChart3 } from "lucide-react"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type FilterType = "today" | "sevenDays" | "thisMonth" | "thisYear" | "total";

function AdminDashboardClient({ earning, stats, chartData }: any) {
    const [filter, setFilter] = useState<FilterType>("sevenDays");
    const [view, setView] = useState<"orders" | "revenue">("orders");

    const currentEarning = earning[filter];
    const currentChartData = chartData[filter];

    return (
        <div className='pt-28 w-[95%] md:w-[85%] mx-auto pb-20'>
            {/* Header Section */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10'>
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-gray-800 flex items-center gap-2"
                >
                    <BarChart3 className="text-green-600" /> Admin Insights
                </motion.h1>
                
                <select 
                    className="border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition"
                    onChange={(e) => setFilter(e.target.value as FilterType)}
                    value={filter}
                >
                    <option value="today">Today</option>
                    <option value="sevenDays">Last 7 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                    <option value="total">Overall</option>
                </select>
            </div>

            {/* Main Stats Card */}
            <motion.div
                key={filter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white mb-10 shadow-xl shadow-green-100 relative overflow-hidden"
            >
                <div className="relative z-10">
                    <p className="text-green-100 font-medium mb-1 capitalize">{filter.replace(/([A-Z])/g, ' $1')} Revenue</p>
                    <h2 className="text-5xl font-black">₹{currentEarning.toLocaleString()}</h2>
                </div>
                <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10" />
            </motion.div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((s: any, i: number) => (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-lg text-green-600">
                           {i === 0 ? <Package size={20}/> : i === 1 ? <Users size={20}/> : i === 2 ? <Truck size={20}/> : <IndianRupee size={20}/>}
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{s.title}</p>
                            <p className="text-xl font-bold text-gray-800">{s.value.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-gray-700">Analytics Distribution</h3>
                    
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {(['orders', 'revenue'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setView(mode)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${view === mode ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                fontSize={12} 
                                tick={{fill: '#9ca3af'}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                fontSize={12} 
                                tick={{fill: '#9ca3af'}}
                                tickFormatter={(val) => view === "revenue" ? `₹${val}` : val}
                            />
                            <Tooltip 
    cursor={{fill: '#f9fafb'}}
    contentStyle={{ 
        borderRadius: '16px', 
        border: 'none', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
    }}
    // Change (val: number) to (val: any) or (val: number | any)
    formatter={(val: number) => [
        view === "revenue" ? `₹${val?.toLocaleString() ?? 0}` : val, 
        view === "revenue" ? "Revenue" : "Orders"
    ]}
/>
                            <Bar 
                                dataKey={view} 
                                fill={view === "orders" ? "#10b981" : "#059669"} 
                                radius={[6, 6, 0, 0]} 
                                barSize={view === "orders" ? 40 : 35}
                                animationDuration={1000}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardClient