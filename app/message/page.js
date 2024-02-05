"use client";
import React from 'react';
import { useRouter } from 'next/router';
import ChatRoom from '../message/chatpage/chatRoom';
import ChatInput from '../_utils/chatInput';
import { useUserAuth } from '../_utils/auth-context';

const Page = () => {
    const router = useRouter();
    const { roomId } = router.query;
    const { user, firebaseSignOut } = useUserAuth();
  
    if (!roomId) {
      return <p>Loading...</p>;
    }
  
    return (
      <div>
        <h1>Chat Room: {roomId}</h1>
  
        {user ? (
          <div>
            <p>Welcome, {user.displayName} ({user.email})</p>
            <button onClick={firebaseSignOut}>Sign Out</button>
          </div>
        ) : (
          <p>Not signed in</p>
        )}
  
        <ChatRoom roomId={roomId} />
        <ChatInput roomId={roomId} />
      </div>
    );
  };
  
  export default Page;
