"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@/app/_utils/chat-context";
import { useUserAuth } from "@/app/_utils/auth-context";

//Message
export default function page({ params }) {
  const { user } = useUserAuth();
  const { loadChatMessages, sendMessage } = useChat();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Extract chat ID from page parameters.
  const chatId = params.chat;

  useEffect(() => {
    console.log("Component mounted - should log only once");

    let isSubscribed = true;

    const fetchMessages = async () => {
      console.log(
        "Fetching messages - should log only once if component doesn't remount"
      );
      if (chatId) {
        await loadChatMessages(chatId, (msgs) => {
          if (isSubscribed) {
            setCurrentMessages(msgs);
          }
        });
      }
    };

    fetchMessages();

    return () => {
      isSubscribed = false;
      console.log("Component unmounted - should log only on component unmount");
    };
  }, []);

  // This function is called when the user sends a message.
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = {
      text: newMessage,
      userId: user.uid,
      displayName: user.displayName || "Anonymous",
    };
    // Send the message and store the returned new message.
    const newMsg = await sendMessage(chatId, messageToSend);
    setNewMessage("");
    // Add the new message to the current messages.
    setCurrentMessages((prevMessages) => [...prevMessages, newMsg]);
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {currentMessages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.displayName || "Unknown"}:</strong>
            <div>{msg.text}</div>
            <div>
              {msg.timestamp?.toDate
                ? msg.timestamp.toDate().toLocaleString()
                : "Just now"}{" "}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
