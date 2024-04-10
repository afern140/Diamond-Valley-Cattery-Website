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

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
	const { user } = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [favoriteCats, setFavoriteCats] = useState();
	const [updatedUser, setUpdatedUser] = useState();
	const [edit, setEdit] = useState(false);
	const [image, setImage] = useState("/img/Placeholder.png");
	const [chatsWithLatestUnreadMessage, setChatsWithLatestUnreadMessage] =
		useState([]);
	const { fetchChatsWithLatestMessage, markMessageAsRead } = useChat();
	const [unreadMessageIds, setUnreadMessageIds] = useState(new Set());
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
		console.log("No loops or leaks");
		let isSubscribed = true;
	
		const fetchAndSetChats = async () => {
		const chats = await fetchChatsWithLatestMessage(user.uid);
		if (isSubscribed) {
			setChatsWithLatestUnreadMessage(chats);
		}
		};
	
		if (user) {
		fetchAndSetChats();
		}
	
		return () => {
		isSubscribed = false;
		};
	}, [user]);
	
	const redirectToChat = async (chatId, messageId) => {
		try {
		// Remove the message ID from the unreadMessageIds set to update the UI
		setUnreadMessageIds((prev) => {
			const newSet = new Set(prev);
			newSet.delete(messageId);
			return newSet;
		});
	
		// Update the message's read status in the database
		await markMessageAsRead(messageId);
	
		// Navigate to the chat page
		window.location.href = `/messages/${chatId}`;
		} catch (error) {
		console.error("Error marking message as read or redirecting:", error);
		}
	};
	
	const formatTimestamp = (timestamp) => {
		if (!timestamp) return "No date";
	
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		return date.toLocaleString();
	};
	
	return (
		<main className=" min-h-screen text-header-text-0 relative pb-16">
		<BackgroundUnderlay />
		
		{/* Title */}
		<div className="pt-20 flex pb-10">
			<div className="w-full m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
				<span className="text-6xl pb-10 font-extrabold">Dashboard</span> <br />
			</div>
		</div>

		{filteredUser ? (
			<div className="w-4/5 mx-auto">
				<div className="flex flex-row justify-center items-center bg-white rounded-xl drop-shadow-xl w-full mx-auto p-10 text-left">
					<div className="text-center m-auto">
						<div className="relative">
							<Image
								src={image}
								alt="Profile Picture"
								width={200}
								height={200}
								className="border-2 border-black m-5 mb-2"
							/>
							<input
								type="file"
								accept="image/"
								onChange={handleImageChange}
								className="bg-navbar-body-1 absolute top-0 left-0 rounded-md drop-shadow-lg"
							/>
						</div>
						<h2 className="mt-2 bg-navbar-body-1 rounded-xl w-fit mx-auto px-4 py-2 drop-shadow-lg">Role: {filteredUser.role}</h2>
					</div>
					
					{edit ? (
					<div className="flex flex-col bg-navbar-body-1 p-4 rounded-xl drop-shadow-lg space-y-2 mx-auto">
						
						<h2 className="text-xl mb-4 text-center">Edit Details</h2>
						<input
							type="text"
							name="name"
							placeholder={filteredUser.name}
							value={updatedUser.name}
							onChange={handleChange}
							className="bg-white rounded-md drop-shadow-lg p-2"
						/>
						<input
							type="text"
							name="username"
							placeholder={filteredUser.username}
							value={updatedUser.username}
							onChange={handleChange}
							className="bg-white rounded-md drop-shadow-lg p-2"
						/>
						<input
							type="text"
							name="email"
							placeholder={filteredUser.email}
							value={updatedUser.email}
							onChange={handleChange}
							className="bg-white rounded-md drop-shadow-lg p-2"
						/>
						<input
							type="text"
							name="phone"
							placeholder={filteredUser.phone}
							value={parseInt(updatedUser.phone)}
							onChange={handleChange}
							className="bg-white rounded-md drop-shadow-lg p-2"
						/>
						<div className="flex mr-auto ml-full justify-end w-full">
							<button onClick={handleSubmit} className=" px-4 py-2 bg-white rounded-md drop-shadow-lg">Submit</button>
						</div>
					</div>
					) : (
					<div className="m-auto space-y-2 bg-navbar-body-1 p-4 rounded-xl drop-shadow-lg">
						<h2 className="text-xl mb-4 text-center">Details</h2>
						<h2 className="bg-white rounded-md drop-shadow-lg p-2">Name: {filteredUser.name}</h2>
						<h2 className="bg-white rounded-md drop-shadow-lg p-2">Username: {filteredUser.username}</h2>
						<h2 className="bg-white rounded-md drop-shadow-lg p-2">Email: {filteredUser.email}</h2>
						<h2 className="bg-white rounded-md drop-shadow-lg p-2">Phone: {filteredUser.phone}</h2>
						
						<div className="flex mr-auto ml-full justify-end w-full">
							<button onClick={handleEdit} className=" px-4 py-2 bg-white rounded-md drop-shadow-lg">
								Edit
							</button>
						</div>
					</div>
					)}
				</div>

				{/* Recent Messages */}
				<div className="bg-white rounded-xl drop-shadow-lg p-10 mt-10">
					<h2 className=" text-2xl text-left font-bold">
						Recent Messages
					</h2>
					<div className="mx-10 my-4">
						{chatsWithLatestUnreadMessage.length > 0 ? (
						chatsWithLatestUnreadMessage.map(({ chatId, lastMessage }) => (
							<div
							key={chatId}
							onClick={() => redirectToChat(chatId, lastMessage.id)}
							className="rounded-md p-4 my-2 cursor-pointer hover:bg-blue-200 transition duration-300 ease-in-out bg-blue-100"
							>
							<span>
								{lastMessage.displayName || "Unknown"}: {lastMessage.text}
							</span>
							<span className="block text-sm text-gray-600">
								{formatTimestamp(lastMessage.timestamp)}
							</span>
							</div>
						))
						) : (
						<p className="text-gray-500">No recent messages.</p>
						)}
					</div>
				</div>
				
				{/* Favorite Cats */}
				<div className="bg-white rounded-xl drop-shadow-lg p-10 mt-10">
					<h2 className="text-black text-2xl text-left font-bold pb-4 ">
						Favorite Cats
					</h2>
					<div className="flex">
						{favoriteCats ? (
						favoriteCats.map((cat) => (
							<div className="text-center bg-navbar-body-1 p-4 rounded-xl drop-shadow-lg">
								<Link href={`./cats/${cat.id}`}>
									<Image
									src="/img/Placeholder.png"
									alt="Cat"
									width={200}
									height={100}
									className="border-2 border-black m-5"
									/>
									<span className="text-xl">{cat.name}</span><br />
									<span>{cat.breed}</span>
								</Link>
							</div>
						))
						) : (
						<h2>Add cats to your favorites list to have them appear here</h2>
						)}
					</div>
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