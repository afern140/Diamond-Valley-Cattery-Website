"use client"
import { collection, doc, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../_utils/firebase";
import {updateProfile,updateEmail,updatePassword} from "firebase/auth";

export const getUser = async (userAuth) => {
	if (!userAuth) return;
	const usersCollection = await getDocs(collection(db, 'users'));
	const usersData = usersCollection.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	const user = usersData.find(userItem => userItem.uid == userAuth.uid)
	console.log(`Fetched ${user.name}`)
	return user;
}

export const getUserCats = async (filteredUser) => {
	const usersCatData = Promise.all(filteredUser.favorites.cats.map(async (catRef) => {
		const catDoc = await getDoc(catRef);
		return { ...catDoc.data() };
	}));
	console.log(`Fetched ${filteredUser.name}'s favorite cats`)
	return usersCatData
}

export const updateUser = async (updatedUser) => {
	const { id, ...updatedUserPrunedID } = updatedUser;
	const userRef = doc(db, 'users', id);
	await updateDoc(userRef, updatedUserPrunedID);
	alert("Updated user data");
} 

/*
  * Updates the user's profile with a new display name and/or photo URL.
  *
  * @param {string} newDisplayName - The new display name for the user.
  * @param {string} newPhotoURL - The new photo URL for the user. Use dowlnoadURL from firebase storage.
  * 
  * If either parameter is provided, it will update the corresponding field in the user's profile.
  * If the update is successful, an alert will be shown with the message "Profile updated".
  * If the update fails, an alert will be shown with the message "Profile update failed".
*/
export function upateUserProfile(newDisplayName, newPhotoURL){
	const updateObject = {};
	if (newDisplayName) {
	  updateObject.displayName = newDisplayName;
	}
	if (newPhotoURL) {
	  updateObject.photoURL = newPhotoURL;
	}
	if (newDisplayName || newPhotoURL) {
	  updateProfile(auth.currentUser, updateObject)
		.then(() => {
		  alert ("Profile updated");
		})
		.catch((error) => {
		  console.log(error);
		  alert("Profile update failed");
		});
	}
  }
/*
* Updates the user's email with a new email.
*
* @param {string} newEmail - The new email for the user.
*
* If the update is successful, an alert will be shown with the message "Email updated".
* If the update fails, an alert will be shown with the message "Email update failed".
*/
export function changeEmail(newEmail){
	updateEmail(auth.currentUser, newEmail)
	.then(() => {
		alert("Email updated");
	})
	.catch((error) => {
		console.log(error);
		alert("Email update failed");
	});
}

/*
* Updates the user's password with a new password.
*
* @param {string} newPassword - The new password for the user.
*
* If the update is successful, an alert will be shown with the message "Password updated".
* If the update fails, an alert will be shown with the message "Password update failed".
*/
export function changePassword(newPassword){
	updatePassword(auth.currentUser, newPassword)
	.then(() => {
		alert("Password updated");
	})
	.catch((error) => {
		console.log(error);
		alert("Password update failed");
	});
}
