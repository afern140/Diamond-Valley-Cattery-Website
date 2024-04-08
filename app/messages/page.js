"use client";

import React, { useState, useEffect } from "react";
import { useUserAuth } from "@/app/_utils/auth-context";
import { useChat } from "@/app/_utils/chat-context";
import Link from "next/link";

//Messagelist
export default function page() {
  const { user } = useUserAuth();
  const { fetchAllMessagesForUser } = useChat();
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    if (user) {
        console.log("fetches all the messages");
      const fetchMessages = async () => {
        const messages = await fetchAllMessagesForUser(user.uid);
        setAllMessages(messages);
      };

      fetchMessages();
    }
  }, [user]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "No date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };
  return (
    <div>
      <h2>Messages</h2>
      {allMessages.map(({ chatId, messages }) => (
        <div key={chatId}>
          {messages.map((message) => (
            <Link key={message.id} href={`/messages/${chatId}`}>
              <div className="block p-2 hover:bg-gray-200 cursor-pointer">
                {message.displayName}: {message.text}
                <br />
                <small>{formatTimestamp(message.timestamp)}</small>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
