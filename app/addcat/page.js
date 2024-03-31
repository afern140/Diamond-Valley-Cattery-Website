"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Dropdown from "@/app/components/dropdown";
import CatParentButton from "./parent_button";
//import cats from "@/app/cats/[cat]/cat.json"
import { v4 } from "uuid";
// import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';
import { doc } from "firebase/firestore";
import { getObjects, getObject } from "../_utils/firebase_services";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb, db } from "../_utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import ImageUploader from "./ImageUploader";
export default function CatList() {
	const { cats, addCatToList } = React.useContext(ApiDataContext);
	const [fieldInput_parents, setFieldInput_parents] = useState("");
	const [filteredResults_parents, setFilteredResults_parents] = useState(cats);
	//Holds list of available conditions
	const [conditions, setConditions] = useState();
	const [inputKey, setInputKey] = useState(Date.now());

	useEffect(() => {
		const fetchConditions = async () => {
			const conditions = await getObjects('conditions');
			setConditions(conditions);
		};
		fetchConditions();
	}, []);

	//Stores docIDs for selected parents
	const [selectedMother, setSelectedMother] = useState("");
	const [selectedFather, setSelectedFather] = useState("");

	//Handles selection of parents
	const handleSelect = (docid) => {
		const selectedCat = cats.find(cat => cat.docid === docid);
		if (!selectedCat) {
			console.log("Error: selected cat not found");
			return;
		}
		if (selectedCat.gender == "Male")
			setSelectedFather(docid);
		else
			setSelectedMother(docid);
	}

	const handleImageSelected = async (file) => {
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const form = event.target;
		const emptyFields = [];
		const fields = ['name', 'age', 'color', 'eye_color', 'breed', 'gender', 'vaccinations'];

		fields.forEach(field => {
			if (!form[field].value) emptyFields.push(field);
		});

		if (emptyFields.length > 0) {
			alert(`Please fill in the following fields: ${emptyFields.join(", ")}`);
			return;
		}

		const fileInput = document.querySelector('input[type="file"]');
		const imgFile = fileInput.files[0];
		if (!imgFile) {
			alert("Please select an image for upload.");
			return;
		}

		try {
			const imgRef = ref(imageDb, `images/${v4()}`);
			const snapshot = await uploadBytes(imgRef, imgFile);
			const url = await getDownloadURL(snapshot.ref);

			const newData = {
				name: form.name.value,
				age: form.age.value,
				color: form.color.value,
				eye_color: form.eye_color.value,
				breed: form.breed.value,
				gender: form.gender.value,
				vaccinations: form.vaccinations.value,
				mother: selectedMother ? doc(db, "cats", selectedMother) : null,
				father: selectedFather ? doc(db, "cats", selectedFather) : null,
				conditions: form.conditions.value ? [doc(db, "conditions", form.conditions.value)] : [],
				thumbnail: url,
			};
			const docRef = await addDoc(collection(db, "cats"), newData);
			const newCat = { docid: docRef.id, ...newData };
			addCatToList(newCat);
			alert("Cat added successfully!");
			form.reset();
			setInputKey(Date.now());
		} catch (error) {
			console.error("Error adding document: ", error);
			alert("An error occurred while adding the cat.");
		}
	};

	useEffect(() => {
		searchItems_parents("", "");
	}, [cats]);

	const searchItems_parents = (searchValue, filterValue) => {
		let filteredData_parents = cats;
		if (filterValue === "") { setFieldInput_parents(searchValue.trim()); }
		if (fieldInput_parents !== "") {
			filteredData_parents = filteredData_parents.filter((cat) => Object.values(cat.name).join('').toLowerCase().includes(searchValue.toLowerCase()));
		}
		setFilteredResults_parents(filteredData_parents);
	}


	//Quick test for condition dropdown output
	const handleCondTest = (value) => {
		console.log("Condition selected:");
		console.log(value);
	}

	return (
		<main className="w-full flex-col justify-center text-black text-xl font-normal bg-white">
			<div>
				<h1 className=" font-normal m-auto text-4xl flex text-center justify-center text-black pt-16 pb-4">Add Cat</h1>
				{/* Search Field */}
			</div>

			<div className="flex py-6 w-full justify-center">
				<div className="flex w-4/5">

					{/* First split of the page */}
					<div className=" w-1/3 mr-6 align-middle justify-start flex-col flex items-center">
						<form onSubmit={handleSubmit}>
							<h2 className="py-6 text-2xl font-semibold">Parameters</h2>


							<h3 className="py-2 text-lg">Name</h3>
							<input type="text" name="name" placeholder="Name" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

							<h3 className="py-2 text-lg">Breed</h3>
							<input type="text" name="breed" placeholder="Breed" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

							<h3 className="py-2 text-lg">Gender</h3>
							<select name="gender" className="border border-black rounded-xl text-xl pl-4 w-full h-10">
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
							{/*<input type="text" name="gender" placeholder="Gender" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />*/}

							<h3 className="py-2 text-lg">Age</h3>
							<input type="text" name="age" placeholder="Age" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

							<h3 className="py-2 text-lg">Color</h3>
							<input type="text" name="color" placeholder="Color" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

							<h3 className="py-2 text-lg">Eye Color</h3>
							<input type="text" name="eye_color" placeholder="Eye Color" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

							<h3 className="py-2 text-lg">Mother</h3>
							{selectedMother ? <p>{selectedMother}</p> : <p>None</p>}

							<h3 className="py-2 text-lg">Father</h3>
							{selectedFather ? <p>{selectedFather}</p> : <p>None</p>}

							<h2 className="py-6 text-2xl font-semibold">Medical</h2>
							<h3 className="py-2 text-lg">Conditions</h3>
							<select onChange={(e) => handleCondTest(e.target.value)} name="conditions" className="border border-black rounded-xl text-xl pl-4 w-full h-10">
								<option value="">None</option>
								{conditions ? conditions.map((condition) => (
									<option value={condition.docId}>{condition.name}</option>
								)) : "Loading..."}
							</select>
							{/*<input type="text" name="conditions" placeholder="Conditions" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />*/}


							<h3 className="py-2 text-lg">Vaccinations</h3>
							<input type="text" name="vaccinations" placeholder="Vaccinations" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

							<h2 className="py-6 text-2xl font-semibold">Notes</h2>
							<div className="align-top justify-start mx-autoflex">
								<textarea type="text"
									name="catlist-search"
									placeholder="Write notes here..."
									className=" border placeholder:italic pt-2 -mr-2 pr-2 border-black rounded-xl text-xl pl-4 m-auto min-h-48 h-10 text-start" />

								{/* Insert icon here... */}
								{/* ^ What? */}
							</div>
							<button className="flex justify-center bg-zinc-500 text-white py-3 px-5 rounded-xl">Submit</button>
						</form>
					</div>

					{/* Second split of the page */}
					<div className="w-full flex-col">
						<h2 className="flex py-6 justify-center font-bold text-2xl">Images</h2>
						<div className="h-6" />
						<div className="grid border border-black w-full grid-cols-3">
							<ImageUploader onImageSelected={handleImageSelected} inputKey={inputKey} />
						</div>

						<h2 className="flex py-6 justify-center font-bold text-2xl">Parents</h2>
						<div className="border border-black w-full">
							<div className="align-middle flex justify-center p-2">
								<input type="text"
									name="catlist-search"
									placeholder="Search"
									className=" border border-black rounded-3xl text-xl pl-4 w-full h-10"
									onChange={(Event) => searchItems_parents(Event.target.value, "")} />
								{/* Insert icon here... */}
							</div>
							<div className="flex flex-wrap justify-between overflow-scroll max-h-screen">
								{/* Populating the list with cats */}
								{
									filteredResults_parents ? filteredResults_parents.map((cat, i) => (
										<div>
											{<CatParentButton docid={cat.docid} id={cat.id} name={cat.name} imgUrl={cat.thumbnail} breed={cat.breed} onSelect={() => handleSelect(cat.docid)} />}
										</div>
									))
										: "Loading..."
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}