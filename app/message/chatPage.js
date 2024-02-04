"use client";
import React from 'react';
import { useRouter } from 'next/router';
import ChatRoom from './chatRoom';
import ChatInput from '../_utils/chatInput';

export default function chatPage() {
console.log("Executing ChatPage");
  const router = useRouter();
  const { roomId } = router.query;
console.log("roomId:", roomId);

  if (!roomId) {
    return <p>Loading...</p>; // Handle the loading state or redirect
  }

  return (
    <Layout>
      <h1>Chat Room: {roomId}</h1>
      <ChatRoom roomId={roomId} />
      <ChatInput roomId={roomId} />
    </Layout>
  );
}