"use client";

import React, { createContext, useContext, useState } from "react";
import { db } from "@/app/_utils/firebase";
import { collection, doc, setDoc, getDoc, query, onSnapshot, updateDoc, orderBy, addDoc,serverTimestamp } from "firebase/firestore";


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentChatId, setCurrentChatId] = useState(null);

  const createOrJoinChat = async (userId1, userId2) => {
    const chatId = [userId1, userId2].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, { users: [userId1, userId2], messages: [] });
      console.log(`Creating new chat with ID: ${chatId}`);
    } else {
      console.log(`Found existing chat with ID: ${chatId}`);
    }

    setCurrentChatId(chatId);
    return chatId;
  };

  // Function to send a message in a chat
  const sendMessage = async (chatId, message) => {
    const messageRef = collection(db, "chats", chatId, "messages");
    await addDoc(messageRef, {
      text: message.text,
      userId: message.userId,
      timestamp: serverTimestamp(),
    });
  };

  // Function to load messages for a given chat
  const loadChatMessages = (chatId, callback) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages); // Call the callback with the messages
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  return (
    <ChatContext.Provider
      value={{ createOrJoinChat, sendMessage, loadChatMessages, currentChatId }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
