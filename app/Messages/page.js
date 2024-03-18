"use client";
import React from "react";
import Sidebar from "./components/sidebar";
import Chat from "./components/chat";

const Page = () => {
  return (
    <div className='Messages'>
      <div className='messageContainer'>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Page;
