import React, { useState, useEffect, useRef } from "react";
import Message from "./message/message";
import SendMessage from "./sendmessage/sendMessage"; 
import { db } from "../_utils/firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { auth } from "../_utils/firebase"; 
import { addDoc, serverTimestamp } from "firebase/firestore"; 

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [showSendMessage, setShowSendMessage] = useState(true);
  const scroll = useRef();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  // Function to check if the user is at the bottom of the chat window
  const isUserAtBottom = () => {
    const element = scroll.current;
    if (element) {
      return element.scrollTop + element.clientHeight >= element.scrollHeight;
    }
    return true; // Default to true if element is not available
  };

  // Function to handle scroll event
  const handleScroll = () => {
    setShowSendMessage(isUserAtBottom());
  };

  // Function to send a message
  const sendMessage = async (input) => {
    if (!input) {
      alert("Please enter a valid message");
      return;
    }
    const { uid, displayName } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: input,
      name: displayName,
      uid,
      timestamp: serverTimestamp(),
    });
    setInput("");
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("Scroll ref not available.");
    }
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
