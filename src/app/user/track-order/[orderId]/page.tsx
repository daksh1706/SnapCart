'use client'
import LiveMap from '@/components/LiveMap'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft, Loader, Send, Sparkle } from 'lucide-react'
import mongoose from 'mongoose'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {AnimatePresence, motion} from "framer-motion"
import { IMessage } from '@/models/message.model'

export interface IOrder {
    _id ?: mongoose.Types.ObjectId,
    user : mongoose .Types.ObjectId,
    items : [
        {
            product : mongoose.Types.ObjectId,
            name : string,
            sellingPrice : string,
            size : string,
            unit : string,
            image : string,
            quantity : number 
        }
    ],
    isPaid : boolean,
    totalAmount : number,
    paymentMethod : "cod" | "online"
    address :{
        fullName : string,
        mobile : string,
        city : string,
        state : string,
        pincode : string,
        fullAddress : string,
        latitude : number,
        longitude : number
    }
    assignment ?: mongoose.Types.ObjectId 
    assignedDeliveryBoy ?: IUser
    status : "pending" | "out for delivery" | "delivered",
    createdAt?:Date,
    updatedAt?:Date
}
interface ILocation{
    latitude : number,
    longitude : number
}

function TrackOrder({params}:{params:{orderId:string}}) {
  const router = useRouter()
  const {userData} = useSelector((state:RootState)=>state.user )
  const [order,setOrder] = useState<IOrder>()
  const[newMessage,setNewMessage] = useState("")
  const [messages,setMessages] = useState<IMessage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading,setLoading] = useState(false)
  const [suggestions,setSuggestions] = useState(["hello","thank you","hii"])
  const [userLocation,setUserLocation] = useState<ILocation>({
    latitude:0,
    longitude:0
  })
  const [deliveryBoyLocation,setDeliveryBoyLocation] = useState<ILocation>({
    latitude:0,
    longitude:0
  })

  const {orderId} = useParams()
  useEffect(()=>{
    const getOrder = async()=>{
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`)
        setOrder(result.data)
        setUserLocation({
          latitude : result.data.address.latitude,
          longitude : result.data.address.longitude
        })
        setDeliveryBoyLocation({
          latitude : result.data.assignedDeliveryBoy.location.coordinates[0],
          longitude : result.data.assignedDeliveryBoy.location.coordinates[1]
        })
      } catch (error) {
        console.log(error)
      }
    }
    getOrder()
  },[userData?._id])

  useEffect(():any =>{
    const socket = getSocket()
    socket.on("update-deliveryBoy-location",({userId,location})=>{
      if(userId.toString() ===order?.assignedDeliveryBoy?._id?.toString()){
        setDeliveryBoyLocation({
          latitude:location.coordinates[0],
          longitude : location.coordinates[1]
        })
      }
    })
    return ()=>socket.off("update-deliveryBoy-location")
  },[order])

  useEffect(() => {
  const socket = getSocket()
  socket.emit("join-room", orderId)
  
  socket.on("send-msg", (message) => {
    if (message.roomId === orderId) {
      setMessages(prev => [...prev, message])
    }
  })

  // FIX: Use curly braces to ensure the function returns 'void'
  return () => { 
    socket.off("send-msg") 
  }
}, [orderId])

      useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

  const sendMsg =()=>{
          const socket = getSocket()
          const message ={
              roomId : orderId,
              text : newMessage,
              senderId : userData?._id,
              time : new Date().toLocaleTimeString([],{
                  hour:"2-digit",
                  minute:"2-digit"
              })
          }
          socket.emit("send-msg",message)
          setNewMessage("")
      }

      useEffect(()=>{
        const getAllMessages = async ()=>{
            try {
                const result = await axios.post("/api/chat/messages",{roomId:orderId})
                setMessages(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getAllMessages()
    },[])

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>)=>{
          if(e.key==="Enter"){
              e.preventDefault()
              sendMsg()
          }
      }

      const getSuggestions = async ()=>{
        setLoading(true)
        try {
            const lastMessage = messages?.filter(m=>m.senderId!==userData?._id)?.at(-1)
            const result = await axios.post("/api/chat/ai-suggestions",{message:lastMessage?.text,role:"user"})
            setSuggestions(result.data)
            setLoading(false )
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

  return (
    <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
      <div className='max-w-2xl mx-auto pb-24'>
        
        {/* Header */}
        <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999'>
        <button className='bg-green-100 rounded-full'><ArrowLeft onClick={()=>router.back()} size={20} className='text-green-700'/></button>
        <div>
          <h2 className='text-xl font-bold'>Track Order</h2>
          <p className='text-sm text-gray-600'>Order #{order?._id?.toString().slice(-11)} <span className='text-green-600 font-semibold pl-3 capitalize'>{order?.status}</span></p>
        </div>
        </div>
        {/* Map */}
        <div className='px-4 mt-6 space-y-5'>
          <div className='rounded-3xl overflow-hidden border shadow'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}
            storageKey="user"/>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
            {/* message suggestions */}
            <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700 text-sm">Quick Replies</span>
                <motion.button whileTap={{scale:0.9}} disabled={loading} onClick={getSuggestions} className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border cursor-pointer border-purple-200"><Sparkle size={14}/>{loading?<Loader className="w-5 h-5 animate-spin"/>:"AI suggest"}</motion.button>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
                {suggestions.map((s,id)=>(
                    <motion.div
                    key={id}
                    whileTap={{scale:0.92}}
                    className="px-3 py-1 text-xs bg-green-50 border border-green-200 cursor-pointer text-green-700 rounded-full"
                    onClick={()=>setNewMessage(s)}
                    >
                        {s}
                    </motion.div>
                ))}
            </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3">
            <AnimatePresence>
                {messages?.map((msg,index)=>(
                    <motion.div
                    key={msg._id?.toString()}
                    initial={{opacity:0,y:15}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0}}
                    transition={{duration:0.2}}
                    className={`flex ${msg.senderId==userData?._id?"justify-end":"justify-start"}`}
                    >
                        <div className= {`px-4 py-2 max-w-[75%] rounded-2xl shadow ${msg.senderId === userData?._id
                            ? "bg-green-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}>
                            <p>{msg.text}</p>
                            <p className="text-[10px] opacity-70 mt-1 text-right">{msg.time}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <div ref={scrollRef} />
        </div>

        <div className="flex gap-2 mt-3 border-t pt-3">
            <input className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} onKeyDown={(handleKeyDown)} type="text" placeholder="Type a message.."/>
            <button className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white" onClick={sendMsg}><Send size={18} /></button>
        </div>
    </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder