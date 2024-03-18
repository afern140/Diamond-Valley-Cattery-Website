"use client"
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../_utils/auth-context";
import { db } from "../../_utils/firebase";
import { onSnapshot, doc } from "firebase/firestore";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { user: currentUser, setSelectedUser } = useUserAuth();

  useEffect(() => {
    if (currentUser?.uid) {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (docSnapshot) => {
        setChats(docSnapshot.data() ? Object.entries(docSnapshot.data()).map(([key, value]) => ({ id: key, ...value })) : []);
      });
      return () => unsub();
    }
  }, [currentUser?.uid]);

  const handleSelectChat = (userInfo) => {
   // setSelectedUser(userInfo); // Use setSelectedUser from AuthContext to set the current chat user
  };

  return (
    <div className="chats">
      {chats.map((chat) => (
        <div className="userChat" key={chat.id} onClick={() => handleSelectChat(chat.userInfo)}>
          <img src={chat.userInfo.photoURL}/>
          <div className="userChatInfo">
            <span>{chat.userInfo.displayName}</span>
            <p>{chat.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
