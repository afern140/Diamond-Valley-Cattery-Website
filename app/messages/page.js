"use client";

import React, { useState, useEffect } from "react";
import { useUserAuth } from "@/app/_utils/auth-context";
import { useChat } from "@/app/_utils/chat-context";
import Link from "next/link";
import BackgroundUnderlay from "@/app/components/background-underlay";

//Messagelist
export default function page() {
  const { user } = useUserAuth();
  const { fetchAllMessagesForUser } = useChat();
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    if (user) {
      console.log("fetches all the messages");
      const fetchMessages = async () => {
        const chatList = await fetchAllMessagesForUser(user.uid);
        setAllMessages(chatList);
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
    <div className="relative text-header-text-0 min-h-[66vh] h-fit pb-16">
      <BackgroundUnderlay />

      {/* Header */}
      <div className="pt-20 flex pb-10">
        <div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
          <span className="text-6xl pb-10 font-extrabold">Messages</span> <br />
        </div>
      </div>
      <div className="w-4/5 bg-white mx-auto p-10 dark:bg-gray-500 relative rounded-xl drop-shadow-lg">
        {allMessages.map(({ chatId, messages }) => (
          <div key={chatId} className="relative z-10 bg-navbar-body-1 dark:bg-gray-300 p-4 rounded-xl drop-shadow-lg">
            {messages.map((message) => (
              <div className="space-y-4">
                <Link key={message.id} href={`/messages/${chatId}`}>
                  <div className="block p-2 hover:bg-gray-200 cursor-pointer">
                    {message.displayName}: {message.text}
                    <br />
                    <small>{formatTimestamp(message.timestamp)}</small>
                  </div>
                </Link>
                <Link key={message.id} href={`/messages/${chatId}`}>
                  <div className="block p-2 hover:bg-gray-200 cursor-pointer">
                    {message.displayName}: {message.text}
                    <br />
                    <small>{formatTimestamp(message.timestamp)}</small>
                  </div>
                </Link>
                <Link key={message.id} href={`/messages/${chatId}`}>
                  <div className="block p-2 hover:bg-gray-200 cursor-pointer">
                    {message.displayName}: {message.text}
                    <br />
                    <small>{formatTimestamp(message.timestamp)}</small>
                  </div>
                </Link>
                <Link key={message.id} href={`/messages/${chatId}`}>
                  <div className="block p-2 hover:bg-gray-200 cursor-pointer">
                    {message.displayName}: {message.text}
                    <br />
                    <small>{formatTimestamp(message.timestamp)}</small>
                  </div>
                </Link>
                <Link key={message.id} href={`/messages/${chatId}`}>
                  <div className="block p-2 hover:bg-gray-200 cursor-pointer">
                    {message.displayName}: {message.text}
                    <br />
                    <small>{formatTimestamp(message.timestamp)}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
