'use client';

import React, { useState, useEffect } from 'react';
/*import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";*/
//Provides the wrapper for the data
import ApiDataProvider from '../_utils/api_provider';
//Retrieves the data from the context wrapper
//import ApiDataContext from '../_utils/api_context';

//Test component to display cats
import CatData from './catdata';

/*async function getCats() {
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
}*/

export default function Page() {

	//const [data, setData] = useState(React.useContext(ApiDataContext));
	//const {data} = React.useContext(ApiDataContext);

	/*useEffect(() => {
		loadCats();
	}, []);

	useEffect(() => {
		console.log("data:");
		console.log(data);
	}, [data]);

	async function loadCats() {
		const cats = await getCats();
		setData(cats);
	}*/

	const handleSubmit = (event) => {
		event.preventDefault();

		//Ensure fields are not empty
		const emptyFields = [];
		const form = event.target;
		if (form.name.value === "") emptyFields.push("name");
		if (form.gender.value === "") emptyFields.push("gender");
		if (form.breed.value === "") emptyFields.push("breed");
		if (form.color.value === "") emptyFields.push("color");

		if (emptyFields.length > 0) 
			alert(
				`Please fill in the following fields: ${emptyFields.join(", ")}`
			);
		else {
			alert("Added " + form.name.value + " the " + form.color.value + " " + form.breed.value + "!");

			//Add cat to page
			const newCat = {
				name: form.name.value,
				gender: form.gender.value,
				breed: form.breed.value,
				color: form.color.value
			};

			setData([...data, newCat]);

			//Add to database
			const catListRef = collection(db, "cats");
			const docRef = addDoc(catListRef, {cat_name: form.name.value,
				cat_gender: form.gender.value,
				cat_breed: form.breed.value,
				cat_color: form.color.value});
			return docRef;
		}
	}

	return (
		<ApiDataProvider>
			<CatData onSelect={() => handleSubmit()}/>
		</ApiDataProvider>
	)

	if (data) return (
		<ApiDataProvider>
			<div className="flex">
				{/* Read */}
				<div>
					<h1>DB Test</h1>
					<p>Testing database connection</p>
					{data.map((item) => (
						<div className="my-7">
						<p>Name: {item.name}</p>
						<p>Gender: {item.gender}</p>
						<p>Breed: {item.breed}</p>
						<p>Color: {item.color}</p>
						</div>
					))}
				</div>
				{/* Write */}
				<div>
					<h1>New cat</h1>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col">
							<label htmlFor="name">Name</label>
							<input type="text" name="name" id="name" />

							<label htmlFor="gender">Gender</label>
							<input type="text" name="gender" id="gender" />

							<label htmlFor="breed">Breed</label>
							<input type="text" name="breed" id="breed" />

							<label htmlFor="color">Color</label>
							<input type="text" name="color" id="color" />

							<button type="submit">Add cat</button>
						</div>
					</form>
				</div>
			</div>
		</ApiDataProvider>
	)
	else return (
		<ApiDataProvider>
		<div>
			<h1>DB Test</h1>
			<p>Awaiting database connection</p>
		</div>
		</ApiDataProvider>
	);
}
