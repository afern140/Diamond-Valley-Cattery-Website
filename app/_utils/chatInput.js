import React, { useState } from "react";
import { db, auth } from "./firebase";

const ChatInput = ({ roomId}) => {
    const [message, setMessage] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        if (message.trim() === '')
        return;
    await db.collection('rooms').doc(roomId).collection('messages').add({
        message,
        timestamp: new Date(),
        user: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
    });

    setMessage('');
    };

    return (
        <form onSubmit={sendMessage}>
            <input
            type= "text"
            value={message}
            onChange={(e)=> setMessage(e.target.value)}
            placeholder="Type a message..."
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default ChatInput