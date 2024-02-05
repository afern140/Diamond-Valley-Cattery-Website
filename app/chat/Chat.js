"use client";
import React, { useState, useEffect, useRef } from "react";
import Message from "./message/message";
import SendMessage from "./sendmessage/sendMessage";
import { db } from "../_utils/firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const scroll = useRef();
  
    const style = {
      main: `flex flex-col p-[0px]`,
      // Define other styles as needed
    };
  
    useEffect(() => {
      const q = query(collection(db, 'messages'), orderBy('timestamp'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messages);
      });
      return () => unsubscribe();
    }, []);
  
    return (
      <>
        <main className={style.main}>
          {messages.length > 0 ? (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          ) : (
            <p>No messages yet.</p>
          )}
          <SendMessage scroll={scroll} />
        <span ref={scroll}></span>
        </main>
        {/* Send Message Component */}
        
      </>
    );
  };
  
  export default Chat;
