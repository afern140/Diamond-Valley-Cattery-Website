import React, { useState, useEffect, useRef } from "react";
import Message from "./message/message";
import SendMessage from "./sendmessage/sendMessage"; 
import { rtdb } from "../_utils/firebase";
import { ref, onValue, off } from "firebase/database";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [showSendMessage, setShowSendMessage] = useState(true);
  const scroll = useRef();

  useEffect(() => {
    // Function to handle incoming messages from Realtime Database
    const handleIncomingMessages = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setMessages(messagesArray);
        // Check if user is at the bottom of the chat window and show send message component accordingly
        setShowSendMessage(isUserAtBottom());
      }
    };

    // Subscribe to messages node in Realtime Database
    const messagesRef = ref(rtdb, 'messages');
    onValue(messagesRef, handleIncomingMessages);

    // Cleanup function to unsubscribe from Realtime Database
    return () => off(messagesRef, 'value', handleIncomingMessages);
  }, []);

  // Function to check if the user is at the bottom of the chat window
  const isUserAtBottom = () => {
    const element = scroll.current;
    if (element) {
      return element.scrollTop + element.clientHeight >= element.scrollHeight;
    }
    return true; 
  };

  // Function to handle scroll event
  const handleScroll = () => {
    setShowSendMessage(isUserAtBottom());
  };

  return (
    <div className="flex flex-col h-[500px] relative bg-slate-300">
      <div className="overflow-y-auto h-full max-h-[calc(100vh - 200px)] " ref={scroll} onScroll={handleScroll}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        ) : (
          <p className="text-center mt-4">No messages yet.</p>
        )}
      </div>
      {/* Send Message Component */}
      {showSendMessage && <SendMessage scroll={scroll} />} {/* Pass scroll ref as prop */}
    </div>
  );
};

export default Chat;
