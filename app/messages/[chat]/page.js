"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useChat } from "@/app/_utils/chat-context";
import { useUserAuth } from "@/app/_utils/auth-context";

import GradientColorButton from "@/app/components/gradientColor";
import BackgroundUnderlay from "@/app/components/background-underlay";

//Message
export default function page({ params }) {
  const { user } = useUserAuth();
  const { loadChatMessages, sendMessage } = useChat();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [openThemeBlock, setOpenThemeBlock] = useState(false);
  const [currentTheme, setCurrentTheme] = useState([" from-[#1F2937] ", " to-[#1F2937] "]);
  const themes = {
    one: " from-[#696EFF] to-[#F8ACFF] ",
    two: " from-[#17EAD9] to-[#6078EA] ",
    three: " from-[#7117EA] to-[#EA6060] ",
  };
  // NOTE: The reason the gradients are included with the operands is because
  //        Tailwind CSS tags must be statically built for them to initialize
  //        and display properly. If they are built dynamically, things break.

  // Extract chat ID from page parameters.
  const chatId = params.chat;

  useEffect(() => {
    console.log("Component mounted - should log only once");

    let isSubscribed = true;

    const fetchMessages = async () => {
      console.log(
        "Fetching messages - should log only once if component doesn't remount"
      );
      if (chatId) {
        await loadChatMessages(chatId, (msgs) => {
          if (isSubscribed) {
            setCurrentMessages(msgs);
          }
        });
      }
    };

    fetchMessages();

    return () => {
      isSubscribed = false;
      console.log("Component unmounted - should log only on component unmount");
    };
  }, []);

  const isProfanity = (text) => {
    const badWords = ["smash","john"];
    return badWords.some((word) => text.toLowerCase().includes(word.toLowerCase()));
  };


  // This function is called when the user sends a message.
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validate the new message
    if (typeof newMessage !== "string" || !newMessage.trim()) {
      alert("Please enter a valid message.");
      return;
    }

    // Check message length
    if (newMessage.length > 512) {
      alert("Your message is too long. Please limit it to 512 characters.");
      return;
    }

    // Check Profanity words
    if (isProfanity(newMessage)) {
        alert("Profanity is not allowed in the messages.");
        return;
    }

    const messageToSend = {
      text: newMessage,
      userId: user.uid,
      displayName: user.displayName || "Anonymous",
    };
    // Send the message and store the returned new message.
    try {
        const newMsg = await sendMessage(chatId, messageToSend);
        setNewMessage("");
        setCurrentMessages((prevMessages) => [...prevMessages, newMsg]);
      } catch (error) {
        // Handle sending error
        console.error("Error sending message:", error);
        alert("There was a problem sending your message.");
      }
  };

  const handleCallback = useCallback((theme) => {
      //console.log("Setting Theme: " + theme0 + " " + theme1);
      setCurrentTheme(theme);
    }
  );

  return (
    <main className="relative pb-16">
      <BackgroundUnderlay />

      <div className="pt-20 flex pb-10">
        <div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
          <span className="text-6xl pb-10 font-extrabold">Messages</span> <br />
        </div>
      </div>

      <div className=" w-4/5 mx-auto">
        <div className="bg-white dark:bg-gray-600 p-6 rounded-xl drop-shadow-lg">
          {currentMessages.map((msg, index) => (
            <div key={index} className={"flex flex-col mb-2 w-full " + (user.uid === msg.userId ? " justify-end items-end mr-auto ml-full" : " justify-start items-start mr-full ml-auto")}>
              <span className="text-lg pb-1 text-gray-500">{msg.displayName || "Unknown"}</span>
              <div className={"flex py-2 px-4 justify-end rounded-xl bg-gradient-to-r max-w-[70%] xl:max-w-[45%] " + currentTheme + (user ? " justify-end" : " justify-start")}>
                <div className="break-all">{msg.text}</div>
              </div>
              <div className="text-gray-500 dark:text-gray-300 font-normal text-sm italic">
                {msg.timestamp?.toDate
                  ? msg.timestamp.toDate().toLocaleString()
                  : "Just now"}{" "}
              </div>
            </div>
            ))
            }
          
          <div className="w-full h-full flex relative">
            <button onClick={() => setOpenThemeBlock(!openThemeBlock)} className={" text-transparent bg-clip-text bg-gradient-to-r inline-block text-5xl" + currentTheme}>+</button>
            { openThemeBlock && <div className=" absolute flex mt-20 w-full rounded-xl bg-gray-800 border-4 border-gray-900 p-4 space-x-8">
              {
                Object.values(themes).map((theme, index) => (
                  <div key={index}>
                    <GradientColorButton callback={handleCallback} theme={theme}/>
                  </div>
                ))
              }
            </div>
            }

            <form className="w-full" onSubmit={handleSendMessage}>
              <div className="flex w-full h-full m-auto">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className=" mx-4 px-6 rounded-3xl w-full text-black bg-white drop-shadow-md"
                />
                <button type="submit" className={"rounded-full bg-gradient-to-r inline-block py-2 px-4" + currentTheme}>Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
