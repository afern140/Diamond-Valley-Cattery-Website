"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import {
getUser,
getUserCats,
updateUser,
useUser,
} from "../_utils/user_services";
import { useChat } from "@/app/_utils/chat-context";

export default function Page() {
	const { user } = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [favoriteCats, setFavoriteCats] = useState();
	const [updatedUser, setUpdatedUser] = useState();
	const [edit, setEdit] = useState(false);
	const [image, setImage] = useState("/img/Placeholder.png");
    const [chatsWithLatestUnreadMessage, setChatsWithLatestUnreadMessage] =
    useState([]);
  const { fetchChatsWithLatestUnreadMessage, markMessageAsRead } = useChat();
	
  useEffect(() => {
		const fetchUser = async () => {
		const newUser = await getUser(user);
		setFilteredUser(newUser);
		setUpdatedUser(newUser);
		};
		fetchUser();
	}, [user]);
	
	useEffect(() => {
		const fetchUserCats = async () => {
		const favoriteCats = await getUserCats(filteredUser);
		setFavoriteCats(favoriteCats);
		};
		fetchUserCats();
	}, [filteredUser]);
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
	};
	
	const handleEdit = () => {
		setEdit(true);
	};
	
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(URL.createObjectURL(file));
	};
	
	const handleSubmit = async () => {
		await updateUser(updatedUser);
		setEdit(false);
	};
	
	// Recent message
    useEffect(() => {
        console.log("Fetching chats with latest unread messages...");
        let isSubscribed = true;
    
        const fetchAndSetChats = async () => {
          try {
            if (user) {
              const chats = await fetchChatsWithLatestUnreadMessage(user.uid);
              if (isSubscribed) {
                setChatsWithLatestUnreadMessage(chats);
              }
            }
          } catch (error) {
            console.error("Error fetching chats:", error);
          }
        };
    
        if (user) {
          fetchAndSetChats();
        }
    
        // Cleanup function to avoid setting state after component unmount
        return () => {
          isSubscribed = false;
        };
      }, [user]);
	
      
	const formatTimestamp = (timestamp) => {
		if (!timestamp) return "No date";
	
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		return date.toLocaleString();
	};
	
	return (
		<main className="bg-white min-h-screen text-black">
		<h1 className="text-black text-4xl text-center font-bold pt-8 pb-4">
			Dashboard
		</h1>
		{filteredUser ? (
			<div>
			<div className="flex flex-row justify-center items-center bg-cat-gray-1 p-5 m-10 rounded-lg text-left">
				<div className="text-center m-auto">
				<Image
					src={image}
					alt="Profile Picture"
					width={100}
					height={100}
					className="border-2 border-black m-5 mb-2"
				/>
				<h2>Role: {filteredUser.role}</h2>
				</div>
				{edit ? (
				<div className="flex flex-col">
					<input
					type="file"
					accept="image/"
					onChange={handleImageChange}
					></input>
					<input
					type="text"
					name="name"
					placeholder={filteredUser.name}
					value={updatedUser.name}
					onChange={handleChange}
					/>
					<input
					type="text"
					name="username"
					placeholder={filteredUser.username}
					value={updatedUser.username}
					onChange={handleChange}
					/>
					<input
					type="text"
					name="email"
					placeholder={filteredUser.email}
					value={updatedUser.email}
					onChange={handleChange}
					/>
					<input
					type="text"
					name="phone"
					placeholder={filteredUser.phone}
					value={parseInt(updatedUser.phone)}
					onChange={handleChange}
					/>
					<button onClick={handleSubmit}>Submit</button>
				</div>
				) : (
				<>
					<div className="m-auto">
					<h2>Name: {filteredUser.name}</h2>
					<h2>Username: {filteredUser.username}</h2>
					<h2>Email: {filteredUser.email}</h2>
					<h2>Phone: {filteredUser.phone}</h2>
					</div>
					<button onClick={handleEdit} className="m-auto">
					Edit
					</button>
				</>
				)}
			</div>
			<h2 className="text-black text-2xl text-left font-bold pt-8 pb-4 m-10 mb-0">
				Recent Message
			</h2>
            <div className="mx-10 my-4">
            {chatsWithLatestUnreadMessage.length > 0 ? (
              chatsWithLatestUnreadMessage.map(({ chatId, lastMessage }) => (
                <div key={chatId} className="rounded-md p-2 my-1 bg-blue-100">
                  <Link href={`/messages/${chatId}`}>
                    <div
                      className="cursor-pointer hover:bg-blue-200 transition duration-300 ease-in-out"
                      onClick={async () => {
                        // Check if the message is not sent by the current user
                        if (user.uid !== lastMessage.userId) {
                          await markMessageAsRead(lastMessage.id);
                        }
                        // Navigation to the chat page is handled by Link component
                      }}
                    >
                      <span>
                        {lastMessage.displayName || "Unknown"}:{" "}
                        {lastMessage.text}
                      </span>
                      <span className="block text-sm text-gray-600">
                        {formatTimestamp(lastMessage.timestamp)}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent messages.</p>
            )}
          </div>

			<h2 className="text-black text-2xl text-left font-bold pt-8 pb-4 m-10 mb-0">
				Favorite Cats
			</h2>
			<div className="flex">
				{favoriteCats ? (
				favoriteCats.map((cat) => (
					<h3 className="bg-cat-gray-1 p-10 m-10 rounded-lg text-black text-xl font-bold text-center">
					{cat.name}
					<Link href={`./cats/${cat.id}`}>
						<Image
						src="/img/Placeholder.png"
						alt="Cat"
						width={200}
						height={100}
						className="border-2 border-black m-5"
						/>
					</Link>
					</h3>
				))
				) : (
				<h2>Add cats to your favorites list to have them appear here</h2>
				)}
			</div>
			</div>
		) : (
			<div>
			Please <Link href="./login">log in</Link> to view your dashboard
			</div>
		)}
		</main>
	);
}