"use client";

import React, { createContext, useContext, useState } from "react";
import { db } from "@/app/_utils/firebase"; // Ensure this points to your Firebase config file
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

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
    // Message document reference
    const messagesRef = collection(db, "chats", chatId, "messages");
    // Adding a new message document to Firestore
    await addDoc(messagesRef, {
      ...message,
      timestamp: new Date(),
    });
  };

  // Function to load messages for a given chat
  const loadChatMessages = async (chatId) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(messages);
    });
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
