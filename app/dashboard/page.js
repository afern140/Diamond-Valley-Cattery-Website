"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { getUser, getUserCats, updateUser, useUser } from "../_utils/user_services";
import DashMessage from "@/app/components/dash_message"
import CatButton from "@/app/components/catbutton-1"

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

	useEffect(() => {
		const fetchUser = async () => {
			const filteredUser = await getUser(user);
			setFilteredUser(filteredUser);
			setUpdatedUser(filteredUser);
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
					<div className="flex flex-row justify-center items-center bg-cat-gray-1 p-5 m-10 rounded-lg text-left">
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
								<div className="m-auto">
									<h2>Name: {filteredUser.name}</h2>
									<h2>Username: {filteredUser.username}</h2>
									<h2>Email: {filteredUser.email}</h2>
									<h2>Phone: {filteredUser.phone}</h2>
								</div>
								<button onClick={handleEdit} className="m-auto">Edit</button>
							</>
						)}
					</div>

					{/* Messages and Posts Section */}
					<div className="flex mx-auto w-full justify-evenly px-5 space-x-5">
						<div className="w-full pl-5 pr-1">
							<h2 className="text-black text-2xl font-bold pb-4 w-full text-center">Unread Messages</h2>
							
							<div className=" bg-cat-gray-0 w-full flex-col space-y-3 rounded-lg px-3 pt-5 pb-7">
								<DashMessage />
								<DashMessage />
								<DashMessage />
							</div>
						</div>
						<div className="w-full pr-5 pl-1">
							<h2 className="text-black text-2xl font-bold pb-4 w-full text-center">New Posts</h2>
							
							<div className=" bg-cat-gray-0 w-full flex-col space-y-3 rounded-lg px-3 pt-5 pb-7">
								<div className="opacity-0">
									<DashMessage />
									<DashMessage />
									<DashMessage />
								</div>
							</div>
						</div>
					</div>

					<h2 className="text-black text-2xl text-left font-bold pt-8 pb-4 m-10 mb-0">Favorite Cats</h2>
					<div className="w-full px-10 pb-10">
						<div className="bg-[#EFEFEF] flex rounded-lg py-8 px-4 space-x-2 justify-start">
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