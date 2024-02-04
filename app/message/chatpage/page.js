"use client";
import React from 'react';
import { useRouter } from 'next/router';
import ChatRoom from '../chatroom/page';
import ChatInput from '../../_utils/chatInput';

const ChatPage = () => {
  const router = useRouter();
  const { roomId } = router.query;

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
};

export default ChatPage;
