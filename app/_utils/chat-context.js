"use client";

import React, { createContext, useContext, useState } from "react";
import { db } from "@/app/_utils/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  addDoc,
  where,
  query,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentChatId, setCurrentChatId] = useState(null);

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
      read: false,
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

  // Function to fetch the latest messages for each chat
  const fetchChatsWithLatestMessage = async (userId) => {
    const chatsQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", userId)
    );
    const chatsSnapshot = await getDocs(chatsQuery);

    const chatsWithLatestMessage = await Promise.all(
      chatsSnapshot.docs.map(async (chatDoc) => {
        const messagesQuery = query(
          collection(db, "messages"),
          where("chatId", "==", chatDoc.id),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        if (!messagesSnapshot.empty) {
          const messageDoc = messagesSnapshot.docs[0];
          return {
            chatId: chatDoc.id,
            lastMessage: {
              id: messageDoc.id,
              ...messageDoc.data(),
            },
          };
        }
        return null;
      })
    );

    return chatsWithLatestMessage.filter((chat) => chat != null);
  };

  // Function to listen to the latest unread messages for a specific chat
  const listenToLatestUnreadMessage = (chatId, callback) => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      where("read", "==", false),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      if (!snapshot.empty) {
        const messageData = snapshot.docs[0].data();
        messageData.id = snapshot.docs[0].id;
        callback(messageData);
      }
    });
  };

  const markMessageAsRead = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);

    // Firestore call to update the message's read status
    await updateDoc(messageRef, {
      read: true,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        createOrJoinChat,
        sendMessage,
        loadChatMessages,
        currentChatId,
        fetchChatsWithLatestMessage,
        listenToLatestUnreadMessage,
        markMessageAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
