import React from 'react'

import DeliveryBoyDashboard from '@/components/DeliveryBoyDashboard'

import { auth } from '@/auth'

import connectDb from '@/lib/db'

import Order from '@/models/order.model'



function getDateRanges() {

const now = new Date();

const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const weekStart = new Date(today);

weekStart.setDate(today.getDate() - today.getDay());

const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

const yearStart = new Date(now.getFullYear(), 0, 1);

return { today, weekStart, monthStart, yearStart };

}



export default async function DeliveryPage() {

await connectDb();

const session = await auth();

const deliveryBoyId = session?.user?.id;


const orders = await Order.find({

assignedDeliveryBoy: deliveryBoyId,

deliveryOtpVerification: true

}).lean();



const { today, weekStart, monthStart, yearStart } = getDateRanges();

const rate = 40;



const calc = (start: Date) => {

const filtered = orders.filter(o => new Date(o.updatedAt) >= start);

return { deliveries: filtered.length, earnings: filtered.length * rate };

};



// Weekly Data (Last 7 Days)

const weeklyData = Array.from({length: 7}, (_, i) => {

const d = new Date(); d.setDate(d.getDate() - (6 - i));

const count = orders.filter(o => new Date(o.updatedAt).toDateString() === d.toDateString()).length;

return { day: d.toLocaleDateString('en-US', {weekday: 'short'}), earnings: count * rate };

});



// Monthly Data (Last 4 Weeks)

const monthlyData = Array.from({length: 4}, (_, i) => {

const end = new Date(); end.setDate(end.getDate() - (i * 7));

const start = new Date(); start.setDate(start.getDate() - ((i + 1) * 7));

const count = orders.filter(o => {

const date = new Date(o.updatedAt);

return date > start && date <= end;

}).length;

return { week: `Wk ${4-i}`, earnings: count * rate };

}).reverse();



const revenueData = {

today: calc(today),

week: calc(weekStart),

month: calc(monthStart),

year: calc(yearStart),

total: { deliveries: orders.length, earnings: orders.length * rate },

weeklyData,

monthlyData

};



return <DeliveryBoyDashboard revenueData={revenueData} />;

}