//Used to hold api data and provide it to the app
import React, { useEffect, useState } from 'react';
import ApiDataContext from './api_context';

//db contains initialized firebase db credentials
import { db } from "../_utils/firebase";
//Various firestore functions
import { collection, getDocs, addDoc, query, doc, updateDoc } from "firebase/firestore";
import { set } from 'firebase/database';

/*async function getCats() {
	//Finds the collection, queries the collection, makes a snapshot of the collection, then dumps that snapshot into an array
	//whew
	const catRef = collection(db, "cats");
	const q = query(catRef);
	const catListSnapshot = await getDocs(q);
	const catList = [];
	catListSnapshot.forEach((doc) => {
		//catList.push(doc.data());
		console.log("doc:");
		console.log(doc.data());
		const item = doc.data();
		const newItem = {
			name: item.cat_name,
			breed: item.cat_breed,
			gender: item.cat_gender,
			color: item.cat_color,
		};
		catList.push(newItem);
	});
	console.log(catList);
	return catList;
}*/

const ApiDataProvider = ({ children }) => {
	//Holds raw data from firestore
	const [cats, setCats] = useState(null);
	const [users, setUsers] = useState(null);
	const [comments, setComments] = useState(null);
	const [litters, setLitters] = useState(null);
	const [forums, setForum] = useState(null);

	//Loads data from firestore when component mounts
	useEffect(() => {
		loadCats();
	}, []);

	//I forget why this is a separate async function
	async function loadCats() {
		//const cats = await getCats();
		//setData(cats);
		//Finds the collection, queries the collection, makes a snapshot of the collection, then dumps that snapshot into an array
	//whew
	const catRef = collection(db, "cats");
	const catQuery = query(catRef);
	const catListSnapshot = await getDocs(catQuery);
	const catList = [];
	const updatePromises = [];
	catListSnapshot.forEach((docSnapshot) => {
		//catList.push(doc.data());
		//console.log("doc:");
		//console.log(doc.data());
		//const item = doc.data();
		//New method: Loads entire document into array
		//Now changes to the document structure can be made without breaking the app

		const catsData = { docid: docSnapshot.id, ...docSnapshot.data() };

		/*const newItem = {
			docid: doc.id,
			id: item.id,
			name: item.name,
			age: item.age,
			color: item.color,
			eye_color: item.eye_color,
			breed: item.breed,
			gender: item.gender,
			vaccinations: item.vaccinations,
			conditions: item.conditions,
			motherID: item.motherID,
			fatherID: item.fatherID,
			docID: doc.id
		};*/
		catList.push(catsData);
	});
	//console.log(catList);
	setCats(catList);

	//Load user data
	const userRef = collection(db, "users");
	const userQuery = query(userRef);
	const userListSnapshot = await getDocs(userQuery);
	const userList = [];
	userListSnapshot.forEach((doc) => {
		const item = doc.data();
		const newItem = {
			name: item.name,
			role: item.role,
			uid: item.uid
		};
		userList.push(newItem);
	});
	await Promise.all(updatePromises);
	console.log(userList);
	setUsers(userList);


	//Load comment data
	const commentRef = collection(db, "comments");
	const commentQuery = query(commentRef);
	const commentListSnapshot = await getDocs(commentQuery);
	const commentList = [];
	commentListSnapshot.forEach((doc) => {
		const item = doc.data();
		const newComment = {
			catID: item.catID,
			catName: item.catName,
			createID: item.createID,
			createName: item.createName,
			message: item.message,
		}
		commentList.push(newComment);
	});
	//console.log(commentList);
	setComments(commentList);

	//load forum data
	const forumRef = collection(db, "forums");
	const forumQuery = query(forumRef);
	const forumListSnapshot = await getDocs(forumQuery);
	const forumList = [];
	forumListSnapshot.forEach((doc) => {
		const forumData = {id: doc.id, ...doc.data()};
		forumList.push(forumData);
	});
	setForum(forumList);

	/* Litter Addition */
	const litterRef = collection(db, "litters");
	const litterQuery = query(litterRef);
	const litterListSnapshot = await getDocs(litterQuery);
	const litterList = [];

	litterListSnapshot.forEach((doc) => {
		const littersData = {id: doc.id, ...doc.data()};
		litterList.push(littersData);
	});
	setLitters(litterList);

	}

	const addCatToList = (newCat) => {
		setCats((prevCats) => [...prevCats, newCat]);
	};
	//Creates a context wrapper of some sort that provides the data to the app
	return (
		<ApiDataContext.Provider value={{cats, users, litters, comments, forums, addCatToList}}>
			{children}
		</ApiDataContext.Provider>
	);
}

export default ApiDataProvider;