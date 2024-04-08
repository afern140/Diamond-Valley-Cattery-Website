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

  const isProfanity = (text) => {
    const badWords = ["smash","john"];
    return badWords.some((word) => text.toLowerCase().includes(word.toLowerCase()));
  };


  // This function is called when the user sends a message.
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validate the new message
    if (typeof newMessage !== "string" || !newMessage.trim()) {
      alert("Please enter a valid message.");
      return;
    }

    // Check message length
    if (newMessage.length > 512) {
      alert("Your message is too long. Please limit it to 512 characters.");
      return;
    }

    // Check Profanity words
    if (isProfanity(newMessage)) {
        alert("Profanity is not allowed in the messages.");
        return;
    }

    const messageToSend = {
      text: newMessage,
      userId: user.uid,
      displayName: user.displayName || "Anonymous",
    };
    // Send the message and store the returned new message.
    try {
        const newMsg = await sendMessage(chatId, messageToSend);
        setNewMessage("");
        setCurrentMessages((prevMessages) => [...prevMessages, newMsg]);
      } catch (error) {
        // Handle sending error
        console.error("Error sending message:", error);
        alert("There was a problem sending your message.");
      }
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
