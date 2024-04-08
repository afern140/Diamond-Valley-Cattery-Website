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
import ImageUploader from "@/app/components/ImageUploader";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
  const [userImageFile, setUserImageFile] = useState(null);
  const { user } = useUserAuth();
  const [filteredUser, setFilteredUser] = useState({role: "role", name: "name", username: "username", email: "randomemail@gmail.com", phone: "123-456-7890"});
  const [favoriteCats, setFavoriteCats] = useState();
  const [updatedUser, setUpdatedUser] = useState(filteredUser);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState("/img/Placeholder.png");
  const [chatsWithLatestUnreadMessage, setChatsWithLatestUnreadMessage] = useState([]);
  const { fetchChatsWithLatestMessage, markMessageAsRead } = useChat();
  const [unreadMessageIds, setUnreadMessageIds] = useState(new Set());

  /*useEffect(() => {
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
  }, [filteredUser]);*/

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEdit = () => {
    setEdit(true);
  };

  

  const handleSubmit = async () => {
    if (userImageFile && user) {
      const storage = getStorage();
      const storageRef = ref(storage, `users/${user.uid}/profileImage`);
  
      try {
        const uploadResult = await uploadBytes(storageRef, userImageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);
  
        const updatedUserData = {
          ...updatedUser,
          userImage: imageUrl,
        };
  
        await updateUser(updatedUserData);
        setFilteredUser(updatedUserData);
        setImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle any errors here, such as showing a message to the user
        return; // Exit the function if there was an error
      }
    } else {
      // If there is no image file to upload, just update the user with the other data
      await updateUser(updatedUser);
    }
    
    // Clear the temporary image file state and exit the edit mode
    setUserImageFile(null);
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

  const [file, setFile] = useState("");
  const [fileEnter, setFileEnter] = useState(false);

  function handleDrop(event) {
    if (event.dataTransfer.items) {
      [...event.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            let blobUrl = URL.createObjectURL(file);
            setFile(blobUrl);
            setImage(blobUrl);
          }
        }
      });
    }
  }

  return (
    <main className="pb-16 min-h-screen text-black">
      <BackgroundUnderlay />

      <div className="pt-20 flex pb-10">
          <div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
            <span className="text-6xl pb-10 font-extrabold">Dashboard</span>
          </div>
        </div>
      {filteredUser ? (
        <div>
          <div className="flex flex-row justify-center items-center bg-gradient-to-b from-white to-navbar-body-1 border-[3px] border-text-header-0 p-5 m-10 rounded-xl text-left">
            {edit ? (
              <div className="flex w-full">
                <div
                  onDragOver={(e) => { e.preventDefault();  setFileEnter(true); }}
                  onDragLeave={(e) => { setFileEnter(false); }}
                  onDragEnd={(e) => { e.preventDefault();  setFileEnter(false); }}
                  onDrop={(e) => { e.preventDefault();  setFileEnter(false);  handleDrop(e); }}
                  className={"border-4 mx-auto relative bg-white flex flex-col size-64 border-dashed items-center justify-center rounded-xl overflow-hidden"} >
                  
                  <Image alt="profile-picture" src={image} width={256} height={256} className="size-full absolute z-10 bg-red-500"/>
                  <div className="absolute size-full z-20 transition duration-300 opacity-0 hover:opacity-100">
                    <input type="file"
                      className="opacity-0 size-full hover:cursor-pointer z-10"
                      onChange={(e) => {
                        let files = e.target.files;
                        if (files && files[0]) {
                          setFile(URL.createObjectURL(files[0]));
                          handleImageChange(e);
                        }
                      }}
                    />
                    <div className="absolute top-0 size-full pointer-events-none select-none bg-gray-800 bg-opacity-70">
                      <div className=" content-center pointer-events-none select-none size-full relative">
                        <p className="text-white pointer-events-none select-none relative bg-gray-700 size-fit px-4 py-2 rounded-xl border-4 m-auto">Edit Picture</p>
                        <p className="absolute bottom-16 text-center w-full text-white">...or simply drag and drop!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-1/2 space-y-2">
                  <div className="w-full flex">
                    <p className="my-auto w-24 text-right">Name: </p>
                    <input
                      type="text"
                      name="name"
                      placeholder={filteredUser.name}
                      value={updatedUser.name}
                      onChange={handleChange}
                      className="pl-2 ml-2 p-1 rounded-xl border "
                    />
                  </div>
                  <div className="w-full flex">
                    <p className="my-auto w-24 text-right">Username: </p>
                    <input
                      type="text"
                      name="username"
                      placeholder={filteredUser.username}
                      value={updatedUser.username}
                      onChange={handleChange}
                      className="pl-2 ml-2 p-1 rounded-xl border"
                    />
                  </div>
                  <div className="w-full flex">
                    <p className="my-auto w-24 text-right">Email: </p>
                    <input
                      type="text"
                      name="email"
                      placeholder={filteredUser.email}
                      value={updatedUser.email}
                      onChange={handleChange}
                      className="pl-2 ml-2 p-1 rounded-xl border w-2/3"
                    />
                  </div>
                  <div className="w-full flex mb-12">
                    <p className="my-auto w-24 text-right">Phone: </p>
                    <input
                      type="text"
                      name="phone"
                      placeholder={filteredUser.phone}
                      value={parseInt(updatedUser.phone)}
                      onChange={handleChange}
                      className="pl-2 ml-2 p-1 rounded-xl border"
                    />
                  </div>
                  <button className=" px-4 py-2 border-[3px] border-gray-700 size-fit mx-auto bg-gradient-to-r from-white to-navbar-body-1 drop-shadow-lg rounded-xl" onClick={handleSubmit}>Submit</button>
                </div>
              </div>
            ) : (
              <div className="flex w-full">
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
                <div className="m-auto">
                  <h2>Name: {filteredUser.name}</h2>
                  <h2>Username: {filteredUser.username}</h2>
                  <h2>Email: {filteredUser.email}</h2>
                  <h2>Phone: {filteredUser.phone}</h2>
                </div>
                <button onClick={handleEdit} className="m-auto">
                  Edit
                </button>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-b from-white to-navbar-body-1 border-[3px] border-text-header-0 p-2 mx-10 rounded-xl">
            <h2 className="text-black text-2xl text-left font-bold pb-4 m-10 mb-0">
              Recent Message
            </h2>
            <div className="mx-10 my-4">
              {chatsWithLatestUnreadMessage.length > 0 ? (
                chatsWithLatestUnreadMessage.map(({ chatId, lastMessage }) => (
                  <div
                    key={chatId}
                    onClick={() => redirectToChat(chatId, lastMessage.id)}
                    className="rounded-md p-4 my-2 cursor-pointer hover:bg-opacity-80 transition duration-300 ease-in-out bg-white border bg-opacity-50"
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
          <div className="mt-10 bg-gradient-to-b from-white to-navbar-body-1 border-[3px] border-text-header-0 p-2 mx-10 rounded-xl">
            <h2 className="text-black text-2xl text-left font-bold pb-4 m-10 mb-0">
              Favorite Cats
            </h2>
            <div className="flex overflow-auto">
              {favoriteCats ? (
                favoriteCats.map((cat) => (
                  <div className="bg-[#F6DCE6] drop-shadow-lg p-10 m-10 rounded-lg text-center">
                    <span>{cat.name}</span>
                    <Link href={`./cats/${cat.id}`}>
                      <Image
                        src="/img/Placeholder.png"
                        alt="Cat"
                        width={200}
                        height={100}
                        className="border-2 border-black m-auto mt-5"
                      />
                    </Link>
                  </div>
                ))
              ) : (
                <h2 className="pl-4">Add cats to your favorites list to have them appear here</h2>
              )}
            </div>
          </div>
        </div>
      ) : (
        /*<div>
          Please <Link href="./login" className="underline text-blue-700">log in</Link> to view your dashboard
        </div>*/
        <div>
          <div className="flex flex-row justify-center items-center bg-cat-gray-1 p-5 m-10 rounded-lg text-left">
            <div className="text-center m-auto">
              <Image
                src={filteredUser.userImage || "/img/Placeholder.png"}
                alt="Profile Picture"
                width={100}
                height={100}
                className="border-2 border-black m-5 mb-2"
              />
              <h2>Role: {filteredUser.role}</h2>
            </div>
            {edit ? (
              <div className="flex flex-col">
                <ImageUploader onImageSelected={(file) => setUserImageFile(file)} />
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
          <h2 className="text-black text-2xl text-left font-bold pt-8 pb-4 m-10 mb-0">
            Favorite Cats
          </h2>
          <div className="flex">
            {favoriteCats ? (
              favoriteCats.map((cat) => (
                <h3 className="bg-cat-gray-1 p-10 m-10 rounded-lg text-black text-xl font-bold text-center">
                  {cat.name}
                  <Link href={`./cats/${cat.id}`}>
                  <img
                    src={filteredUser.userImage || '/img/Placeholder.png'}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    className="border-2 border-black m-5 mb-2"
                  />
                  </Link>
                </h3>
              ))
            ) : (
              <h2>Add cats to your favorites list to have them appear here</h2>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
