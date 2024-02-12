'use client'

import React, { useState, useEffect } from 'react';
import ApiDataContext from '../_utils/api_context';

import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export default function CatData(onSubmit){
	const dbdata = React.useContext(ApiDataContext);
	const [data, setData] = useState(React.useContext(ApiDataContext));

	useEffect(() => {
		setData(dbdata);
	}, [dbdata]);

	const handleSubmit = (event) => {
		event.preventDefault();
		//onSubmit(event);
		const emptyFields = [];
		const form = event.target;
		/*if (form.name.value === "") emptyFields.push("name");
		if (form.gender.value === "") emptyFields.push("gender");
		if (form.breed.value === "") emptyFields.push("breed");
		if (form.color.value === "") emptyFields.push("color");*/

		if (emptyFields.length > 0) 
			alert(
				`Please fill in the following fields: ${emptyFields.join(", ")}`
			);
		else {
			alert("Added " + form.name.value + " the " + form.color.value + " " + form.breed.value + "!");

			//Add cat to page
			const newCat = {
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
			//Clear form

			form.reset();
			return docRef;
		}
	};

	if (data) return (
			<div className="flex">
				{/* Read */}
				<div>
					<h1>DB Test</h1>
					<p>Testing database connection</p>
					{data.map((item) => (
						<div className="my-7">
						<p>ID: {item.id}</p>
						<p>Name: {item.name}</p>
						<p>Age: {item.age}</p>
						<p>Color: {item.color}</p>
						<p>Eye color: {item.eye_color}</p>
						<p>Breed: {item.breed}</p>
						<p>Gender: {item.gender}</p>
						<p>Vaccinations: {item.vaccinations}</p>
						<p>Conditions: {item.conditions}</p>
						<p>Mother: {item.motherID}</p>
						<p>Father: {item.fatherID}</p>

						</div>
					))}
				</div>
				{/* Write */}
				<div>
					<h1>New cat</h1>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col">
							{/*<label htmlFor="ID">ID</label>
							<input type="text" name="ID" id="id" />*/}

							<label htmlFor="name">Name</label>
							<input type="text" name="name" id="name" />

							<label htmlFor="age">Age</label>
							<input type="text" name="age" id="age" />

							<label htmlFor="color">Color</label>
							<input type="text" name="color" id="color" />

							<label htmlFor="eye_color">Eye Color</label>
							<input type="text" name="eye_color" id="eye_color" />

							<label htmlFor="breed">Breed</label>
							<input type="text" name="breed" id="breed" />

							<label htmlFor="gender">Gender</label>
							<input type="text" name="gender" id="gender" />

							<label htmlFor="vaccinations">Vaccinations</label>
							<input type="text" name="vaccinations" id="vaccinations" />

							<label htmlFor="conditions">Conditions</label>
							<input type="text" name="conditions" id="conditions" />

							<button type="submit">Add cat</button>
						</div>
					</form>
				</div>
			</div>
	)
	else return (
		<div>
			<h1>DB Test</h1>
			<p>Awaiting database connection</p>
		</div>
	);
}