import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import './ChatBox.css';

const socket = io("http://localhost:5000");

const ChatBox = () => {
    const { user, isAuthenticated } = useAuth0();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !isChatOpen) return;

        // Fetch Previous Messages
        fetch(`http://localhost:5000/chats/${user.sub}`)
            .then(res => res.json())
            .then(data => setMessages(data));

        // Listen for New Messages
        socket.on("receiveMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // Listen for Deleted Messages
        socket.on("deleteMessage", ({ messageId }) => {
            setMessages((prev) => prev.filter(msg => msg._id !== messageId));
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("deleteMessage");
        };
    }, [isAuthenticated, isChatOpen]);

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            userId: user.sub,
            message,
            sender: "user",
        };

        socket.emit("sendMessage", newMessage);
        setMessage("");
    };

    const deleteMessage = (messageId) => {
        fetch(`http://localhost:5000/chats/${user.sub}/${messageId}`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then(() => {
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
            });
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            {/* Chat Toggle Button */}
            {!isChatOpen && (
                <button className="chat-toggle-btn" onClick={toggleChat}>
                    💬 Open Chat
                </button>
            )}

            {/* Chat Window */}
            {isChatOpen && (
                <div className="chat-overlay">
                    <div className="chat-box">
                        <div className="chat-header">
                            <h2>Live Chat</h2>
                            <button className="close-btn" onClick={toggleChat}>
                                ✖
                            </button>
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`message ${msg.sender}`}>
                                    <p>{msg.message}</p>
                                    {msg.userId === user.sub && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteMessage(msg._id)}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button className="send-btn" onClick={sendMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;