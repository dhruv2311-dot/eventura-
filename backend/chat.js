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
app.get("/chats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const chats = await chatCollection.find({ userId }).sort({ timestamp: 1 }).toArray();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
});

// ✅ Admin Reply API
app.post("/reply", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const adminReply = {
      _id: new ObjectId(),
      userId,
      message,
      sender: "admin",
      timestamp: new Date(),
    };

    await chatCollection.insertOne(adminReply);
    io.emit("receiveMessage", adminReply);

    res.status(201).json({ message: "✅ Admin reply sent", reply: adminReply });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
});

app.delete("/chats/:userId/:messageId", async (req, res) => {
    try {
        const { userId, messageId } = req.params;

        if (!ObjectId.isValid(messageId)) {
            return res.status(400).json({ message: "❌ Invalid message ID" });
        }

        // 🟢 Message find karo
        const message = await chatCollection.findOne({ _id: new ObjectId(messageId) });

        if (!message) {
            return res.status(404).json({ message: "❌ Message not found" });
        }

        // 🛑 User sirf apna chat delete kar sakta hai
        if (message.userId !== userId && message.sender !== "admin") {
            return res.status(403).json({ message: "⛔ You can only delete your own messages" });
        }

        // 🟢 Delete message
        await chatCollection.deleteOne({ _id: new ObjectId(messageId) });

        res.status(200).json({ message: "✅ Message deleted successfully" });

        // 🔄 Notify all users that a message was deleted
        io.emit("deleteMessage", { messageId });
    } catch (error) {
        console.error("❌ Error deleting message:", error);
        res.status(500).json({ message: "❌ Server Error", error });
    }
});