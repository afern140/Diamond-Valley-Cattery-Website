"use client";

import React, { createContext, useContext, useState } from "react";
import { db } from "@/app/_utils/firebase";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  addDoc,
} from "firebase/firestore";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentChatId, setCurrentChatId] = useState(null);

  // This is a React context provider component for chat functionalities.
  const createOrJoinChat = async (userId1, userId2) => {
    const chatId = [userId1, userId2].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, { users: [userId1, userId2], messageRefs: [] }); // Use messageRefs for storing references
      console.log(`Creating new chat with ID: ${chatId}`);
    } else {
      console.log(`Found existing chat with ID: ${chatId}`);
    }

    setCurrentChatId(chatId);
    return chatId;
  };

  //Function to send a message in a chat
  const sendMessage = async (chatId, message) => {
    const messageDoc = {
      ...message,
      chatId: chatId,
      timestamp: serverTimestamp(),
    };

    const messageRef = await addDoc(collection(db, "messages"), messageDoc);

    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      messageRefs: arrayUnion(messageRef),
    });

    return { id: messageRef.id, ...messageDoc };
  };

  //Function to load chat messages given a chat ID
  const loadChatMessages = (chatId, callback) => {
    const fetchMessages = async () => {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        const messageRefs = chatSnap.data().messageRefs || [];
        const messages = await Promise.all(
          messageRefs.map(async (ref) => {
            const msgSnap = await getDoc(ref);
            return msgSnap.exists()
              ? { id: msgSnap.id, ...msgSnap.data() }
              : null;
          })
        );
        callback(messages.filter((msg) => msg !== null));
      }
    };

    fetchMessages();
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
