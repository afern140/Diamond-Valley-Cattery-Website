"use client"
import { collection, doc, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../_utils/firebase";

export const getUser = async (userAuth) => {
	if (!userAuth) return;
	const users = await getDocs(collection(db, 'users'));
	const usersData = users.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	const user = usersData.find(userItem => userItem.uid == userAuth.uid);
	if (user.favorites.cats) {
		const favoriteCats = await Promise.all(user.favorites.cats.map(async (catRef) => {
			const catDoc = await getDoc(catRef);
			return {docId: catDoc.id, ...catDoc.data()};
		}));
		user.favorites.cats = favoriteCats;
	}
	console.log(`Fetched ${user.name}`)
	return user;
}

// export const getUserCats = async (filteredUser) => {
// 	if (!filteredUser) return;
// 	const usersCatData = Promise.all(filteredUser.favorites.cats.map(async (catRef) => {
// 		const catDoc = await getDoc(catRef);
// 		return { ...catDoc.data() };
// 	}));
// 	console.log(`Fetched ${filteredUser.name}'s favorite cats`)
// 	return usersCatData
// }

export const updateUser = async (updatedUser) => {
	const { docId, ...updatedUserPrunedID } = updatedUser;
	const userRef = doc(db, 'users', docId);
	await updateDoc(userRef, updatedUserPrunedID);
	alert("Updated user data");
} 