import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import './ChatBox.css'
const socket = io("http://localhost:5000"); // 🟢 Backend URL

const ChatBox = () => {
    const { user, isAuthenticated } = useAuth0();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isAuthenticated) return;

        // ✅ Fetch Previous Messages
        fetch(`http://localhost:5000/chats/${user.sub}`)
            .then(res => res.json())
            .then(data => setMessages(data));

        // ✅ Listen for New Messages
        socket.on("receiveMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // ✅ Listen for Deleted Messages
        socket.on("deleteMessage", ({ messageId }) => {
            setMessages((prev) => prev.filter(msg => msg._id !== messageId));
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("deleteMessage");
        };
    }, [isAuthenticated]);

    // ✅ Send Message
    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            userId: user.sub,  // 🟢 Auth0 user ID
            message,
            sender: "user",
        };

        socket.emit("sendMessage", newMessage);
        setMessage(""); // Clear input
    };

    // ✅ Delete Message
    const deleteMessage = (messageId) => {
        fetch(`http://localhost:5000/chats/${user.sub}/${messageId}`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then(() => {
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
            });
    };

    return (
        <div className="chat-box">
            <h2>Live Chat</h2>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg._id} className={`message ${msg.sender}`}>
                        <p>{msg.message}</p>
                        {msg.userId === user.sub && ( // 🟢 User apna message delete kar sakta hai
                            <button onClick={() => deleteMessage(msg._id)}>🗑️</button>
                        )}
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatBox;
