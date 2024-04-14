"use client";

import NextImage from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { db, strg } from "@/app/_utils/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateObject } from "../_utils/firebase_services";
import { useUserAuth } from "../_utils/auth-context";
import { updateUser } from "../_utils/user_services";
import { useChat } from "@/app/_utils/chat-context";
import CatButton from "../components/cats/cat-button";

import BackgroundUnderlay from "@/app/components/background-underlay";
import EditThumbnail from "../components/images/edit-thumbnail";

export default function Page() {
	const { user, dbUser } = useUserAuth();
	const [updatedUser, setUpdatedUser] = useState();
	const [edit, setEdit] = useState(false);
	const [thumbnail, setThumbnail] = useState();
    const [chatsWithLatestUnreadMessage, setChatsWithLatestUnreadMessage] = useState([]);
	const { fetchChatsWithLatestUnreadMessage, markMessageAsRead } = useChat();

	useEffect(() => {
		if (dbUser) {
			setUpdatedUser(dbUser);
			if (dbUser.thumbnail) {
				setThumbnail(dbUser.thumbnail);
			}
		}
	}, [dbUser]);
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
	};
	
	const handleEdit = () => {
		setEdit(true);
	};

	const handleThumbnailChange = async (e) => {
		const file = e.target.files[0];
		const thumbnailRef = ref(strg, `thumbnails/users/${dbUser.uid}`);
		await uploadBytes(thumbnailRef, file);
		const thumbnailUrl = await getDownloadURL(thumbnailRef);
		setThumbnail(thumbnailUrl);
		setUpdatedUser((prevUser) => ({ ...prevUser, thumbnail: thumbnailUrl }));
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
		<main className=" min-h-screen text-header-text-0 relative pb-16">
		<BackgroundUnderlay />
		
		{/* Title */}
		<div className="pt-20 flex pb-10">
			<div className="w-full m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
				<span className="text-6xl pb-10 font-extrabold">Dashboard</span> <br />
			</div>
		</div>
		{dbUser ? (
			<div className="w-4/5 mx-auto">
				<div className="flex flex-row justify-center items-center bg-white dark:bg-gray-500 rounded-xl drop-shadow-xl w-full mx-auto p-10 text-left">
					<div className="text-center m-auto">
						<div className="relative">

							{ edit ? (	// Putting another edit check here for proper positioning on window size
								<div className="size-[200px] m-5">
									<EditThumbnail handleThumbnailChange={handleThumbnailChange} thumbnail={thumbnail} />
								</div>
								) : (
									<NextImage
										src={thumbnail}
										alt="Profile Picture"
										width={200}
										height={200}
										className="border-2 relative border-black m-5 mb-2"
									/>
								)
							// <label htmlFor="pfpImage" className="absolute top-0 left-5 size-[200px]">
							// 	<label htmlFor="pfpImage" className="bg-gray-700 border-[4px] border-dashed border-gray-200 size-[200px] absolute left-0 z-[100] bg-opacity-70 opacity-0 hover:opacity-100 transition duration-300">
							// 		<div htmlFor="pfpImage" className="size-full relative flex">
							// 			<p htmlFor="pfpImage" className=" m-auto px-4 py-2 border-2 border-white rounded-xl bg-gray-800 text-white">Upload Image</p>
							// 		</div>
							// 	</label>
							// 	<input
							// 		id="pfpImage"
							// 		name="thumbnail"
							// 		type="file"
							// 		accept="image/"
							// 		onChange={handleImageChange}
							// 		className="bg-navbar-body-1 dark:bg-gray-300 z-30 absolute rounded-md drop-shadow-lg size-[200px] left-0 opacity-0"
							// 	/>
							// </label>
							}
						</div>
						<h2 className="mt-2 bg-navbar-body-1 dark:bg-gray-300 rounded-xl w-fit mx-auto px-4 py-2 drop-shadow-lg">Role: {dbUser.role}</h2>
					</div>
					{edit ? (
					<div className="flex flex-col bg-navbar-body-1 dark:bg-gray-300 p-4 rounded-xl drop-shadow-lg space-y-2 mx-auto mb-auto">
						
						<h2 className="text-xl mb-4 text-center">Edit Details</h2>
						<div className="flex flex-row">
							<h2 className="text-right pr-2 py-2 w-[100px]">Name: </h2>
							<input
								type="text"
								name="name"
								placeholder={dbUser.name}
								value={updatedUser.name}
								onChange={handleChange}
								className="bg-white rounded-md drop-shadow-lg p-2"
							/>							
						</div>
						<div className="flex flex-row">
							<h2 className="text-right pr-2 py-2 w-[100px]">Username: </h2>
							<input
								type="text"
								name="username"
								placeholder={dbUser.username}
								value={updatedUser.username}
								onChange={handleChange}
								className="bg-white rounded-md drop-shadow-lg p-2"
							/>							
						</div>
						<div className="flex flex-row">
							<h2 className="text-right pr-2 py-2 w-[100px]">Email: </h2>
							<input
								type="text"
								name="email"
								placeholder={dbUser.email}
								value={updatedUser.email}
								onChange={handleChange}
								className="bg-white rounded-md drop-shadow-lg p-2"
							/>							
						</div>
						<div className="flex flex-row">
							<h2 className="text-right pr-2 py-2 w-[100px]">Phone: </h2>
							<input
								type="text"
								name="phone"
								placeholder={dbUser.phone}
								value={parseInt(updatedUser.phone)}
								onChange={handleChange}
								className="bg-white rounded-md drop-shadow-lg p-2"
							/>							
						</div>
						<div className="flex flex-row">
							<div className="flex ml-auto mr-full justify-beginning w-full">
								<button onClick={() => setEdit(false)} className=" px-4 py-2 bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0 rounded-md drop-shadow-lg">Cancel</button>
							</div>							
							<div className="flex mr-auto ml-full justify-end w-full">
								<button onClick={handleSubmit} className=" px-4 py-2 bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0 rounded-md drop-shadow-lg">Submit</button>
							</div>
						</div>
					</div>
					) : (
					<div className="m-auto space-y-2 bg-navbar-body-1 dark:bg-gray-300 p-4 rounded-xl drop-shadow-lg max-w-[360px] w-fit">
						<h2 className="text-xl mb-4 text-center">Details</h2>
						<div className="flex flex-col space-y-2">
							<div className="flex text-ellipsis">
								<h2 className="text-right pr-2 py-2 w-[100px]">Name: </h2>
								<h2 className="bg-white rounded-md drop-shadow-lg p-2 w-[200px]">{dbUser.name}</h2>
							</div>
							<div className="flex">
								<h2 className="text-right pr-2 py-2 w-[100px]">Username: </h2>
								<h2 className="bg-white rounded-md drop-shadow-lg p-2  w-[200px]">{dbUser.username}</h2>
							</div>
							<div className="flex">
								<h2 className="text-right pr-2 py-2 w-[100px]">Email: </h2>
								<h2 className="bg-white rounded-md drop-shadow-lg p-2  w-[200px] text-ellipsis truncate">{dbUser.email}</h2>
							</div>
							<div className="flex">
								<h2 className="text-right pr-2 py-2 w-[100px]">Phone: </h2>
								<h2 className="bg-white rounded-md drop-shadow-lg p-2  w-[200px]">{dbUser.phone}</h2>
							</div>
						</div>

						<div className="flex mr-auto ml-full justify-end w-full">
							<button onClick={handleEdit} className=" px-4 py-2 bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0 rounded-md drop-shadow-lg">
								Edit
							</button>
						</div>
					</div>
					)}
					<div className="bg-navbar-body-1 dark:bg-gray-300 mx-auto mb-auto p-4 w-[240px] h-full rounded-xl drop-shadow-lg">
						<h2 className="text-lg text-center pb-2">Settings</h2>
						<div className="space-y-2">
							<Link href="../messages" >
								<p className=" w-full bg-white text-center p-2 rounded-xl drop-shadow-lg mb-2">Messages</p>
							</Link>
							<Link href="../login/forgotpassword" >
								<p className=" w-full bg-white text-center p-2 rounded-xl drop-shadow-lg mb-2">Reset Password</p>
							</Link>
						</div>
					</div>
				</div>
				{/* Recent Messages */}
				<div className="bg-white dark:bg-gray-500 rounded-xl drop-shadow-lg p-10 mt-10">
					<h2 className=" text-2xl text-left font-bold dark:text-dark-header-text-0">
						Recent Messages
					</h2>
                    <div className=" my-4 overflow-y-auto max-h-[400px]">
                    {chatsWithLatestUnreadMessage.length > 0 ? (
                     chatsWithLatestUnreadMessage.map(({ chatId, lastMessage }) => (
                        <div key={chatId} className="rounded-md my-1 bg-blue-100 w-full max-w-[100%] overflow-hidden">
                            <Link href={`/messages/${chatId}`} className="rounded-xl">
                                <div
                                className="cursor-pointer p-4 hover:bg-blue-200 transition duration-300 ease-in-out"
                                onClick={async () => {
                                    // Check if the message is not sent by the current user
                                    if (user.uid !== lastMessage.userId) {
                                    await markMessageAsRead(lastMessage.id);
                                    }
                                    // Navigation to the chat page is handled by Link component
                                    }}
                                    >
                                    <span className="text-ellipsis break-words">
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
				</div>
				
				{/* Favorite Cats */}
				<div className="bg-white dark:bg-gray-500 rounded-xl drop-shadow-lg p-10 mt-10">
					<h2 className="dark:text-dark-header-text-0 text-2xl text-left font-bold pb-4 ">Favorite Cats</h2>
					<div className="flex flex-wrap max-h-[650px] overflow-y-auto">
						{dbUser.favorites.cats ? (
							dbUser.favorites.cats.map((cat) => (
								<div key={cat.id} className=" flex justify-center flex-col m-2 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
									<CatButton cat={cat} />
								</div>
							))
						) : (
						<h2>Add cats to your favorites list to have them appear here</h2>
						)}
					</div>
				</div>
			</div>
		) : (
			<div>Please <Link href="./login">log in</Link> to view your dashboard</div>
		)}
		</main>
	);
}