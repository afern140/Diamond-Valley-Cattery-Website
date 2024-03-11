//Used to hold api data and provide it to the app
import React, { useEffect, useState } from 'react';
import ApiDataContext from './api_context';

//db contains initialized firebase db credentials
import { db } from "../_utils/firebase";
//Various firestore functions
import { collection, getDocs, addDoc, query } from "firebase/firestore";

async function getCats() {
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
}

const ApiDataProvider = ({ children }) => {
	//Holds raw data from firestore
	const [data, setData] = useState(null);

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
	const q = query(catRef);
	const catListSnapshot = await getDocs(q);
	const catList = [];
	catListSnapshot.forEach((doc) => {
		//catList.push(doc.data());
		//console.log("doc:");
		//console.log(doc.data());
		const item = doc.data();
		const newItem = {
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
		};
		catList.push(newItem);
	});
	console.log(catList);
	setData(catList);
	}

	//Creates a context wrapper of some sort that provides the data to the app
	return (
		<ApiDataContext.Provider value={data}>
			{children}
		</ApiDataContext.Provider>
	);
}

export default ApiDataProvider;