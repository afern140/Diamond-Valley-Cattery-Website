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
import ImageUploader from "./ImageUploader";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// const getUser = async(userAuth) => {
// 	const usersCollection = await getDocs(collection(db, 'users'));
// 	const usersDataPromise = usersCollection.docs.map(async (userDoc) => {
// 		const userData = {id: userDoc.id, ...userDoc.data() };
// 		const subCollections = await userDoc.ref.listCollections();
// 		await Promise.all(subCollections.map(async (subCollection) => {
// 			const subCollectionDocs = await getDocs(subCollection);
// 			const subCollectionData = subCollectionDocs.map((doc) => ({ id: doc.id, ...doc.data() }));
// 			userData[subCollection.id] = subCollectionData;
// 		}));
// 		return userData;});

// 	const usersData = await Promise.all(usersDataPromise);
// 	const user = usersData.find(userItem => userItem.uid == userAuth.uid)
// 	return user;
// }

// const getUser = async(userAuth) => {
// 	const usersCollection = await getDocs(collection(db, 'users'));
// 	const usersDataPromise = usersCollection.docs.map(async (userDoc) => {
// 		const userData = {id: userDoc.id, ...userDoc.data()};
// 		const favoritesCollection = await getDocs(collection(userDoc.ref, 'favorites'));
// 		const favoritesData = Object.fromEntries(favoritesCollection.docs.map((favoritesDoc) => [favoritesDoc.id, { id: favoritesDoc.id, ...favoritesDoc.data() }]));
// 		userData.favorites = favoritesData;
// 		return userData;});
// 	const usersData = await Promise.all(usersDataPromise);
// 	const user = usersData.find(userItem => userItem.uid == userAuth.uid)
// 	return user;
// }
// Dashboard
export default function Page() {
  const [userImageFile, setUserImageFile] = useState(null);
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
        console.error("Error uploading image:", error);
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

  const redirectToChat = async (chatId, messageId, isOwnMessage) => {
    if (!isOwnMessage) {
      await markMessageAsRead(messageId);
    }
  };

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
              <img
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
                <ImageUploader
                  onImageSelected={(file) => setUserImageFile(file)}
                />
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
          <h2 className="text-black text-2xl text-left font-bold pt-8 pb-4">
            Recent Messages
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
                    <img
                      src={filteredUser.userImage || "/img/Placeholder.png"}
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
      ) : (
        <div>
          Please <Link href="./login">log in</Link> to view your dashboard
        </div>
      )}
    </main>
  );
}
