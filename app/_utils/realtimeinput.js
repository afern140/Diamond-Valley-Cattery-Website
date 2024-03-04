import React, { useState } from "react";
import { rtdb, auth } from "./firebase";

export default function realtimeinput({ roomId }) {
  const [message, setMessage] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === "") {
      return;
    }
    const messageData = {
      message: message,
      timestamp: new Date().getTime(),
      user: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
    };

    // This Push the message to the Realtime Database
    database.ref(`rooms/${roomId}/messages`).push(messageData);

    setMessage("");
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
