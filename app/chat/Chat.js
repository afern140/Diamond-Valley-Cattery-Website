import React, { useState, useEffect, useRef } from "react";
import Message from "./message/message";
import SendMessage from "./sendmessage/sendMessage"; 
import { rtdb, auth } from "../_utils/firebase";
import { ref, onValue, off } from "firebase/database";
import { useUserAuth } from "../_utils/auth-context";
import { getUser, getUserCats, updateUser, useUser } from "../_utils/user_services";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [showSendMessage, setShowSendMessage] = useState(true);
  const scroll = useRef();

  const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();

	useEffect(() => {
		const fetchUser = async () => {
			const filteredUser = await getUser(user);
			setFilteredUser(filteredUser);
			setUpdatedUser(filteredUser);
      console.log(user);
		};
		fetchUser();
	}, [user]);

  useEffect(() => {
    // Function to handle incoming messages from Realtime Database
    const handleIncomingMessages = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setMessages(messagesArray);
        // Check if user is at the bottom of the chat window and show send message component accordingly
        setShowSendMessage(true);//isUserAtBottom());
      }
    };

    // Subscribe to messages node in Realtime Database
    const messagesRef = ref(rtdb, 'messages');
    onValue(messagesRef, handleIncomingMessages);

    // Cleanup function to unsubscribe from Realtime Database
    return () => off(messagesRef, 'value', handleIncomingMessages);
  }, []);

  // Function to check if the user is at the bottom of the chat window
  const isUserAtBottom = () => {
    const element = scroll.current;
    if (element) {
      return element.scrollTop + element.clientHeight >= element.scrollHeight;
    }
    return true; 
  };

  // Function to handle scroll event
  const handleScroll = () => {
    setShowSendMessage(true);//isUserAtBottom());
  };

  return (
    <main className="h-[500px] mb-32 shadow-xl bg-gray-100 rounded-xl">
        <div className="h-full flex flex-col rounded-xl border-4 border-[#305B73] pb-[3.4rem]">
        <div className="flex flex-col h-full rounded-l bg-clip-content">
          <div className="overflow-y-auto h-full max-h-[calc(100vh - 200px)] " ref={scroll} onScroll={handleScroll}>
            {messages.length > 0 ? (
              messages.map((message) => (
                <div><Message key={message.id} message={message} isCurrentUser={user.uid === message.uid} /></div>
              ))
            ) : (
              <p className="text-center mt-4">No messages yet.</p>
            )}
          </div>
        </div>
        {/* Send Message Component */}
        <div className="my-auto border-[#305B73] shadow-xl">
          {showSendMessage && <SendMessage scroll={scroll} />} {/* Pass scroll ref as prop */}
        </div>
      </div>
    </main>
  );
};

export default Chat;
