import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const port = process.env.PORT || 5000;

const io = new Server(server, {
    cors: {
        origin: process.env.NEXT_BASE_URL
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // 1. Identity Event: Link Socket ID to User ID in your database
    socket.on("identity", async (userId) => {
        try {
            await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, { 
                userId, 
                socketId: socket.id 
            });
        } catch (error) {
            console.error("Error in identity update:", error.message);
        }
    });

    // 2. Update Location Event: Save to DB and Broadcast to other clients
    socket.on("update-location", async ({ userId, latitude, longitude }) => {
        try {
            const location = {
                type: "Point",
                coordinates: [latitude, longitude]
            };

            // Update database via API
            await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`, { 
                userId, 
                location 
            });

            // BROADCAST TO ALL CLIENTS (Moved inside this scope)
            // This allows the frontend (customer app) to see the delivery boy moving
            io.emit("update-deliveryBoy-location", { userId, location });

        } catch (error) {
            console.error("Error updating location:", error.message);
        }
    });

    // 3. Chat Room
    socket.on("join-room", (roomId)=>{
        console.log("join room with ", roomId)
        socket.join(roomId)
    })

    // 4. message
    socket.on("send-msg",async (message)=>{
        console.log(message)
        await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`,message)
        io.to(message.roomId).emit("send-msg",message)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Endpoint for your Next.js API to trigger socket events (e.g., New Order notification)
app.post("/notify", (req, res) => {
    const { event, data, socketId } = req.body;
    try {
        if (socketId) {
            io.to(socketId).emit(event, data);
        } else {
            io.emit(event, data);
        }
        return res.status(200).json({ "success": true });
    } catch (error) {
        return res.status(500).json({ "success": false, "error": error.message });
    }
});

server.listen(port, () => {
    console.log(`Server started at ${port}`);
});