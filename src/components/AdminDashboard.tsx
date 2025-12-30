import React from 'react'
import AdminDashboardClient from './AdminDashboardClient'
import connectDb from '@/lib/db'
import Order from '@/models/order.model'
import Grocery from '@/models/grocery.model'
import User from '@/models/user.model'

async function AdminDashboard() {
  await connectDb()
  const orders = await Order.find()
  const users = await User.find({ role: "user" })

  const today = new Date()
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0))
  const startOfWeek = new Date(); startOfWeek.setDate(today.getDate() - 6);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Helper function to calculate count and sum for a list of orders
  const getStats = (filteredOrders: any[]) => ({
    orders: filteredOrders.length,
    revenue: filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  });

  // 1. TODAY (Hourly slots)
  const todayChart = [0, 6, 12, 18].map(hour => {
    const list = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= startOfToday && d.getHours() >= hour && d.getHours() < hour + 6;
    });
    return { day: `${hour}:00`, ...getStats(list) };
  });

  // 2. LAST 7 DAYS (Daily)
  const sevenDaysChart = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(); date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date); nextDay.setDate(nextDay.getDate() + 1);
    const list = orders.filter(o => new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDay);
    sevenDaysChart.push({ day: date.toLocaleDateString("en-US", { weekday: "short" }), ...getStats(list) });
  }

  // 3. THIS MONTH (Weekly)
  const monthChart = [1, 2, 3, 4, 5].map(week => {
    const list = orders.filter(o => {
      const d = new Date(o.createdAt);
      const isMonth = d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      return isMonth && Math.ceil(d.getDate() / 7) === week;
    });
    return { day: `Week ${week}`, ...getStats(list) };
  }).filter(w => w.orders > 0 || w.day !== "Week 5");

  // 4. THIS YEAR (Monthly)
  const yearChart = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => {
    const list = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= startOfYear && d.getMonth() === i;
    });
    return { day: m, ...getStats(list) };
  });

  // 5. TOTAL (By Year)
  const currentYear = today.getFullYear();
  const totalChart = [currentYear - 1, currentYear].map(y => {
    const list = orders.filter(o => new Date(o.createdAt).getFullYear() === y);
    return { day: y.toString(), ...getStats(list) };
  });

  const stats = [
    { title: "Total Orders", value: orders.length },
    { title: "Total Customers", value: users.length },
    { title: "Pending", value: orders.filter(o => o.status === "pending").length },
    { title: "Total Revenue", value: getStats(orders).revenue }
  ];

  return (
    <AdminDashboardClient 
      earning={{
        today: getStats(orders.filter(o => new Date(o.createdAt) >= startOfToday)).revenue,
        sevenDays: getStats(orders.filter(o => new Date(o.createdAt) >= startOfWeek)).revenue,
        thisMonth: getStats(orders.filter(o => new Date(o.createdAt) >= startOfMonth)).revenue,
        thisYear: getStats(orders.filter(o => new Date(o.createdAt) >= startOfYear)).revenue,
        total: getStats(orders).revenue
      }}
      stats={stats}
      chartData={{
        today: todayChart,
        sevenDays: sevenDaysChart,
        thisMonth: monthChart,
        thisYear: yearChart,
        total: totalChart
      }}
    />
  )
}

export default AdminDashboard;