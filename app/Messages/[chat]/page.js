"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useChat } from "@/app/_utils/chat-context";
import { useUserAuth } from "@/app/_utils/auth-context";

import GradientColorButton from "@/app/components/gradientColor";

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
    if (chatId) {
      loadChatMessages(chatId, setCurrentMessages);
    }
    
    if (currentTheme[0] === "" && currentTheme[1] === "") {
      setCurrentTheme([" from-[#696EFF] ", " to-[#F8ACFF]"])
    }
  }, [currentTheme]);

  // This function is called when the user sends a message.
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = {
      text: newMessage,
      userId: user.uid,
      displayName: user.displayName || "Anonymous",
    };
    // Send the message and store the returned new message.
    const newMsg = await sendMessage(chatId, messageToSend);
    setNewMessage("");
    // Add the new message to the current messages.
    setCurrentMessages((prevMessages) => [...prevMessages, newMsg]);
    
  };

  const handleCallback = useCallback((theme) => {
      //console.log("Setting Theme: " + theme0 + " " + theme1);
      setCurrentTheme(theme);
    }
  );

  return (
    <main className="relative">
      <div className="w-full h-full grow absolute -z-10 bg-gradient-to-b from-[#EBB7A6] to-[#F1C4EA]"/>
      
      <div className="pt-20 flex pb-10">
        <div className="w-4/5 space-x-6 m-auto justify-center flex-row text-center mx-auto inline-block font-bold bg-gradient-to-r from-[#A783D5] via-[#EB9839] to-[#E37B87] text-transparent bg-clip-text">
          <span className="text-6xl pb-10 font-extrabold uppercase">Messages</span>
        </div>
      </div>

      <div className=" px-20 pb-20">
        <div className="p-4 border-2 flex flex-col bg-white bg-opacity-30 rounded-xl">
          {currentMessages.map((msg, index) => (
            <div key={index} className={"flex flex-col mb-2 justify-end items-end w-full " + (user ? " justify-end items-end mr-auto ml-full" : " justify-start items-start mr-full ml-auto")}>
              <div className={"flex p-2 justify-end rounded-xl bg-gradient-to-r" + currentTheme + (user ? " justify-end" : " justify-start")}>
                <strong className="pr-2">{msg.displayName || "Unknown"}:</strong>
                <div>{msg.text}</div>
              </div>
              <div className="text-gray-500 font-normal text-sm italic">
                {msg.timestamp?.toDate
                  ? msg.timestamp.toDate().toLocaleString()
                  : "Just now"}{" "}
              </div>
            </div>
            ))
            }
          <div className="flex flex-col justify-end items-end mr-auto ml-full w-full">
            <div className={"flex p-2 justify-end rounded-xl " + " bg-gradient-to-r" + currentTheme}>
              <strong className="pr-2">User: </strong>
              <div>Message</div>
            </div>
            <div className="text-gray-500 font-normal text-sm italic">Date</div>
          </div>
          <div className="flex flex-col justify-start items-start mr-full ml-auto w-full">
            <div className={"flex p-2 justify-start rounded-xl " + " bg-gradient-to-r " + currentTheme}>
              <strong className="pr-2">Admin: </strong>
              <div>Message</div>
            </div>
            <div className="text-gray-500 font-normal text-sm italic">Date</div>
          </div>
          
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
                  className=" mx-4 px-2 rounded-3xl w-full text-black"
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
