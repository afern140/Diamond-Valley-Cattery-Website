'use client';

import React, { useState, useEffect } from 'react';
/*import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";*/
//Provides the wrapper for the data
import ApiDataProvider from '../_utils/api_provider';
//Retrieves the data from the context wrapper
//import ApiDataContext from '../_utils/api_context';
import Comments from '../components/comments';

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
	}

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
			const docRef = addDoc(catListRef, {
				id: data.length + 1,
				name: form.name.value,
				age: form.age.value,
				color: form.color.value,
				eye_color: form.eye_color.value,
				breed: form.breed.value,
				gender: form.gender.value,
				vaccinations: form.vaccinations.value,
				conditions: form.conditions.value,
				//Randomly assign parents for now
				motherID: Math.floor(Math.random() * 30),
				fatherID: Math.floor(Math.random() * 30)
			});
			return docRef;
		}
	}*/

	return (
		<ApiDataProvider>
			<Comments/>
		</ApiDataProvider>

	)

	
}
