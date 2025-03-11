require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI;
const dbName = "eventura";

let db, chatCollection;

// 🟢 Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("🟢 Connected to MongoDB");

    db = client.db(dbName);
    chatCollection = db.collection("chats");

    server.listen(5000, () => console.log("🚀 Server running on port 5000"));
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error);
    process.exit(1);
  }
}
connectDB();

// ✅ Real-time Chat System with Socket.io
io.on("connection", (socket) => {
  console.log("🔵 New User Connected:", socket.id);

  // 📩 Listen for messages
  socket.on("sendMessage", async (data) => {
    const { userId, message, sender } = data;

    if (!userId || !message || !sender) return;

    const chatMessage = {
      _id: new ObjectId(),
      userId,
      message,
      sender, // "user" or "admin"
      timestamp: new Date(),
    };

    await chatCollection.insertOne(chatMessage);
    io.emit("receiveMessage", chatMessage);
  });

  // 📤 Handle user disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });
});

// ✅ Fetch Chat History (User-Specific)
