"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { getUser, getUserCats, updateUser, useUser } from "../_utils/user_services";
import DashMessage from "@/app/components/dash_message"
import CatButton from "@/app/components/catbutton-1"

import { rtdb, auth } from "../_utils/firebase";
import { ref, onValue, off } from "firebase/database";
import { doc, setDoc } from "firebase/firestore"; 

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

export default function Page() {
	const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [favoriteCats, setFavoriteCats] = useState();
	const [updatedUser, setUpdatedUser] = useState();
	const [edit, setEdit] = useState(false);
	const [image, setImage] = useState("/img/Placeholder.png");
	const [messages, setMessages] = useState([]);

	const [oldTimestamp, setOldTimestamp] = useState();

	useEffect(() => {
		const fetchUser = async () => {
			const filteredUser = await getUser(user);
			setFilteredUser(filteredUser);
			setUpdatedUser(filteredUser);

			setOldTimestamp(filteredUser.lastDashboardVisit);
			await updateUser({ ...filteredUser, lastDashboardVisit: new Date().toISOString() }); // After finishing the user fetch, the timestamp is updated for the Message Retrieval
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
		  }
		};
	
		// Subscribe to messages node in Realtime Database
		const messagesRef = ref(rtdb, 'messages');
		onValue(messagesRef, handleIncomingMessages);
	
		// Cleanup function to unsubscribe from Realtime Database
		return () => off(messagesRef, 'value', handleIncomingMessages);
	}, []);

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
	}

	const handleEdit = () => {
		setEdit(true);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(URL.createObjectURL(file));
	}

	const handleSubmit = async () => {
		await updateUser(updatedUser);
		setEdit(false);
	}

	return(
		<main className="bg-white min-h-screen text-black">
			<h1 className="text-black text-4xl text-center font-bold pt-8 pb-4">Dashboard</h1>
			{filteredUser ? (
				<div>
					<div className="flex flex-row justify-center items-center bg-cat-gray-1 shadow p-5 m-10 rounded-lg text-left">
						<div className="text-center m-auto">
							<Image
								src={image}
								alt="Profile Picture"
								width={100}
								height={100}
								className="border-2 border-black m-5 mb-2 rounded-lg"
							/>
							<h2>Role: {filteredUser.role}</h2>
						</div>
						{edit ? (
							<div className="flex flex-col">
								<input
									type="file"
									accept="image/"
									onChange={handleImageChange}>
								</input>
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
								<div className=" m-auto grid grid-cols-2 gap-x-4">
									<h2 className="text-right">Name: </h2>     <span>{filteredUser.name}</span>
									<h2 className="text-right">Username: </h2> <span>{filteredUser.username}</span>
									<h2 className="text-right">Email: </h2>    <span>{filteredUser.email}</span>
									<h2 className="text-right">Phone: </h2>    <span>{filteredUser.phone}</span>
								</div>
								<button onClick={handleEdit} className="m-auto">Edit</button>
							</>
						)}
					</div>

					{/* Messages and Posts Section */}
					<div className="flex mx-auto w-full justify-evenly px-5 space-x-5">
						<div className="w-full pl-5 pr-1">
							<h2 className="text-black text-2xl font-bold pb-4 w-full text-center">Unread Messages</h2>
							
							<div className=" bg-cat-gray-0 shadow w-full flex-col space-y-3 rounded-lg px-3 pt-5 pb-7 scroll-smooth max-h-64 overflow-auto">
							{messages.length > 0 ? (
								messages.map((message) => (
									<div>
										{ (message.uid !== filteredUser.uid) && (message.timestamp > oldTimestamp) &&
										<DashMessage key={message.id} message={message}/>
									}</div>
								))
								) : (
									<p className="text-center mt-4">No messages yet.</p>
							)}
								<DashMessage />
								<DashMessage />
							</div>
						</div>
						<div className="w-full pr-5 pl-1">
							<h2 className="text-black text-2xl font-bold pb-4 w-full text-center">New Posts</h2>
							
							<div className=" bg-cat-gray-0 shadow w-full flex-col space-y-3 rounded-lg px-3 pt-5 pb-7">
								<div className="opacity-0 space-y-3">
									<DashMessage />
									<DashMessage />
									<DashMessage />
								</div>
							</div>
						</div>
					</div>

					<h2 className="text-black text-2xl text-left font-bold pt-8 pb-4 m-10 mb-0">Favorite Cats</h2>
					<div className="w-full px-10 pb-10">
						<div className="bg-[#EFEFEF] shadow flex rounded-lg py-8 px-4 space-x-2 justify-start">
							{favoriteCats ? (favoriteCats.map((cat, i) => (
								<CatButton id={cat.id} name={cat.name} breed={cat.breed} imageID={i} imageSize={200} />
							))) : <h2 className="px-5">Add cats to your favorites list to have them appear here</h2>}
						</div>
					</div>
				</div>
				) : (
				<div>Please <Link href="./login">log in</Link> to view your dashboard</div>
				)}
		</main>
	);
}