import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Loader, Send, Sparkle } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type Props = {
    orderId: mongoose.Types.ObjectId;
    deliveryBoyId: mongoose.Types.ObjectId;
};

function DeliveryChat({ orderId, deliveryBoyId }: Props) {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [loading,setLoading] = useState(false)
    const [suggestions,setSuggestions] = useState([])

    // 1. Setup Socket Listeners
    useEffect(() => {
        const socket = getSocket();
        
        // Join the specific order room
        socket.emit("join-room", orderId);

        // Listen for incoming messages
        const handleIncomingMsg = (msg: IMessage) => {
            // Ensure we only add messages belonging to this room
            if (msg.roomId.toString() === orderId.toString()) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("send-msg", handleIncomingMsg);

        // Cleanup on unmount
        return () => {
            socket.off("send-msg", handleIncomingMsg);
        };
    }, [orderId]);

    // 2. Fetch Initial History
    useEffect(() => {
        const getAllMessages = async () => {
            try {
                const result = await axios.post("/api/chat/messages", { roomId: orderId });
                setMessages(Array.isArray(result.data) ? result.data : []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        getAllMessages();
    }, [orderId]);

    // 3. Auto-Scroll Logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 4. Send Message Logic
    const sendMsg = () => {
        if (!newMessage.trim()) return;

        const socket = getSocket();
        const messageData = {
            roomId: orderId,
            text: newMessage,
            senderId: deliveryBoyId,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
        };

        socket.emit("send-msg", messageData);
        setNewMessage("");
    };

    // 5. Handle Enter Key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMsg();
        }
    };

    const getSuggestions = async ()=>{
        setLoading(true)
        try {
            const lastMessage = messages?.filter(m=>m.senderId!==deliveryBoyId)?.at(-1)
            const result = await axios.post("/api/chat/ai-suggestions",{message:lastMessage?.text,role:"deliveryBoy"})
            setSuggestions(result.data)
            setLoading(false )
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
            {/* message suggestions */}
            <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700 text-sm">Quick Replies</span>
                <motion.button whileTap={{scale:0.9}}
                disabled={loading}
                onClick={getSuggestions}
                className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm cursor-pointer border border-purple-200"><Sparkle size={14}/>{loading?<Loader className="w-5 h-5 animate-spin"/>:"AI suggest"}</motion.button>
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
            {/* Message Display Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-hide">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={msg._id?.toString() || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.senderId.toString() === deliveryBoyId.toString() ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${
                                msg.senderId.toString() === deliveryBoyId.toString()
                                    ? "bg-green-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p className="text-[10px] opacity-70 mt-1 text-right font-medium">
                                    {msg.time}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {/* Scroll Anchor */}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2 mt-3 border-t pt-3">
                <input
                    className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Type a message..."
                />
                <button
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 p-3 rounded-xl text-white transition-colors"
                    onClick={sendMsg}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

export default DeliveryChat;