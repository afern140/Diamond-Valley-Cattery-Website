"use client";
// pages/chats/[chatId].js
import { useRouter } from 'next/router';
import Chat from '@/app/chat/Chat/Chat'; 

const ChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query;

  return <Chat chatId={chatId} />;
};

export default ChatPage;
