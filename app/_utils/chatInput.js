import React, { useState } from "react";
import { rtdb, auth } from "./firebase"; 

export default function ChatInput({ roomId }) {
  console.log("Executing ChatInput");
  const [message, setMessage] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '') {
      return;
    }

    // Push the message to the Firebase Realtime Database
    await rtdb.ref(`rooms/${roomId}/messages`).push({
      message: message,
      timestamp: new Date().toISOString(), 
      user: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
    });

    setMessage('');
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
}
