// Inside page.js or ChatPage.js

'use client';
import React, { useState, useEffect } from 'react';
import { useChat } from '@/app/_utils/chat-context'; 
import { useUserAuth } from '@/app/_utils/auth-context'; 

const ChatPage = () => {
    const { user } = useUserAuth();
    const { loadChatMessages, sendMessage } = useChat();
    const [currentMessages, setCurrentMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const chatId = "Q8Excpz00sakI3GNSciydRchrc82_W12Ek3CIPwSpjmk75XmefHqeBuG3"; 

    useEffect(() => {
        if (!chatId) return;
        
        const unsubscribe = loadChatMessages(chatId, setCurrentMessages);

        return unsubscribe; // Use the unsubscribe function for cleanup directly
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await sendMessage(chatId, {
            text: newMessage,
            userId: user.uid,
            timestamp: +new Date(), 
        });
        setNewMessage('');
    };

    return (
        <div>
            <h2>Chat</h2>
            {currentMessages.map((msg, index) => (
                <div key={index}>{msg.text}</div>
            ))}
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
};

export default ChatPage;
