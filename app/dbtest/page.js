'use client';

import { useState, useEffect } from 'react';
import { db } from "../_util/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

async function getCats() {
	const catRef = collection(db, "cats");
	const q = query(catRef);
	const shoppingListSnapshot = await getDocs(q);
	const shoppingList = [];
	shoppingListSnapshot.forEach((doc) => {
		//shoppingList.push(doc.data());
		console.log("doc:");
		console.log(doc.data());
		const item = doc.data();
		const newItem = {
			name: item.cat_name,
			breed: item.cat_breed,
			gender: item.cat_gender,
			color: item.cat_color,
		};
		shoppingList.push(newItem);
	});
	//console.log(shoppingList);
	return shoppingList;
}

export default function Page() {

	const [data, setData] = useState(null);

	useEffect(() => {
		loadCats();
	}, []);

	useEffect(() => {
		console.log("data:");
		console.log(data);
	}, [data]);

	async function loadCats() {
		const cats = await getCats();
		setData(cats);
	}

	if (data) return (
		<div>
			<h1>DB Test</h1>
			<p>Testing database connection</p>
			{data.map((item) => (
				<p>Name: {item.name}</p>
			))}
		</div>
	)
	else return (
		<div>
			<h1>DB Test</h1>
			<p>Awaiting database connection</p>
		</div>
	);
}