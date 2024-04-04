"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "@/app/components/dropdown";
import CatParentButton from "@/app/addcat/parent_button";
//import cats from "@/app/cats/[cat]/cat.json"
import { v4 } from "uuid";
// import ApiDataProvider from '../../_utils/api_provider';
import ApiDataContext from '../../_utils/api_context';
import { getObjects, getObject } from "../../_utils/firebase_services";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb, db } from "../../_utils/firebase";
import ImageUploader from "@/app/addcat/ImageUploader";
import { doc, collection, getDocs, addDoc, query, Timestamp } from "firebase/firestore";
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
	const [cat, setCat] = useState({
		id: null,
		name: null,
		age: null,
		color: null,
		eye_color: null,
		breed: null,
		gender: null,
		vaccinations: null,
		conditions: null,
		fatherID: null,
		motherID: null,
		children: null
	});

	const Cats = null;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCat((prevCat) => ({ ...prevCat, [name]: value }));
	}

	//const handleSubmit = async () => {
	//	console.log(cat)
	//}

	// New
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

		if (form.name.value === "") emptyFields.push("name");
		//if (form.age.value === "") emptyFields.push("age");
		if (form.birthdate.value === "") emptyFields.push("birthdate");
		if (form.color.value === "") emptyFields.push("color");
		if (form.eye_color.value === "") emptyFields.push("eye_color");
		if (form.breed.value === "") emptyFields.push("breed");
		//if (form.gender.value === "") emptyFields.push("gender");

		//Choose new ID by finding the highest current ID
		let newID = 0;
		cats.forEach(cat => {
			if (cat.id > newID)
				newID = cat.id;
		});
		
		//Create timestamp from date from input
		//It must be converted from a date string to a date object
		//Then to a timestamp object so Firebase will accept it
		//I hate it
		const date = new Date(form.birthdate.value);
		const timestamp = Timestamp.fromDate(date);

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
				birthdate: timestamp,
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

	return(
		<main className="w-full flex-col relative justify-center text-black text-xl font-normal">
			<BackgroundUnderlay />
						
			<div className="pt-20 flex pb-10">
				<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-gradient-to-r from-[#A783D5] via-[#EB9839] to-[#E37B87] text-transparent bg-clip-text">
					<span className="text-6xl pb-10 font-extrabold">ADD CAT</span> <br />
					<div className="mt-8"><span className="">ADD YOUR NEW BEST FRIEND TO THE DIAMOND VALLEY CATTERY.</span></div>
				</div>
			</div>

			<div className="flex py-6 w-full justify-center">
				<div className="flex px-16 xl:px-32">

					{/* First split of the page */}
					<div className=" w-1/3 mr-6 align-middle justify-start flex-col flex items-center text-gray-700">
						<form className="" onSubmit={handleSubmit}>
							<div className="rounded-xl p-4 bg-gradient-to-b from-[#696EFF] to-[#F8ACFF]">
								<h2 className="py-6 text-2xl font-semibold text-center">Parameters</h2>

								<h3 className="py-2 text-lg">Name</h3>
								<input type="text" name="name" placeholder="Name" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />

								<h3 className="py-2 text-lg">Breed</h3>
								<input type="text" name="breed" placeholder="Breed" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />

								<h3 className="py-2 text-lg">Gender</h3>
								<select name="gender" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
								{/*<input type="text" name="gender" placeholder="Gender" className=" rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />*/}

								<h3 className="py-2 text-lg">Age</h3>
								<input type="text" name="age" placeholder="Age" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />
								
								<h3 className="py-2 text-lg">Color</h3>
								<input type="text" name="color" placeholder="Color" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />

								<h3 className="py-2 text-lg">Eye Color</h3>
								<input type="text" name="eye_color" placeholder="Eye Color" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />

								<h3 className="py-2 text-lg">Mother</h3>
								{selectedMother ? <p>{selectedMother}</p> : <p>None</p>}

								<h3 className="py-2 text-lg">Father</h3>
								{selectedFather ? <p>{selectedFather}</p> : <p>None</p>}
							</div>

							{/* Medical */}
							<div className="rounded-xl mt-10 p-4 bg-gradient-to-b from-[#696EFF] to-[#F8ACFF]">
								<h2 className="py-6 text-2xl font-semibold">Medical</h2>
								<h3 className="py-2 text-lg">Conditions</h3>
								<select onChange={(e) => handleCondTest(e.target.value)} name="conditions" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">
									<option value="">None</option>
									{conditions ? conditions.map((condition) => (
										<option value={condition.docId}>{condition.name}</option>
									)) : "Loading..."}
								</select>
								{/*<input type="text" name="conditions" placeholder="Conditions" className=" rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />*/}


								<h3 className="py-2 text-lg">Vaccinations</h3>
								<input type="text" name="vaccinations" placeholder="Vaccinations" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />

								<h2 className="py-6 text-2xl font-semibold">Notes</h2>
								<div className="align-top justify-start mx-autoflex">
									<textarea type="text"
										name="catlist-search"
										placeholder="Write notes here..."
										className=" drop-shadow-md placeholder:italic pt-2 rounded-xl text-xl pl-4 m-auto min-h-48 w-full text-start bg-[#BDB2FF] text-gray-700 border border-gray-300" />
								</div>
								<button className=" drop-shadow-md m-auto flex py-2 z-10 relative px-4 mt-10 bg-gradient-to-r from-[#F492F0] to-[#A18DCE] text-gray-700 rounded-xl font-semibold">Submit</button>
							</div>
						</form>
					</div>

					{/* Second split of the page */}
					<div className="w-full flex-col">
						<div className="bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] p-4 rounded-xl">
							<h2 className="flex py-6 justify-center font-bold text-2xl text-gray-700">Images</h2>
							<div className="h-6" />
							<div className="grid border border-white bg-white bg-opacity-40 w-full grid-cols-3 p-4 rounded-xl">
								<ImageUploader onImageSelected={handleImageSelected} inputKey={inputKey} />
							</div>
						</div>

						<div className="mt-6 bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] p-4 rounded-xl">
							<h2 className="flex py-6 justify-center font-bold text-2xl text-gray-700">Parents</h2>
							<div className="border border-white bg-white bg-opacity-50 w-full p-4 rounded-xl">
								<div className="align-middle flex justify-center p-2">
									<input type="text"
										name="catlist-search"
										placeholder="Search"
										className=" bg-purple-100 bg-opacity-50 border-2 placeholder-gray-700 shadow rounded-3xl text-xl pl-4 w-full h-10"
										onChange={(Event) => searchItems_parents(Event.target.value, "")} />
									<Image className="relative -translate-x-12" alt="Search..." src="/img/search-icon.svg" width={30} height={30} />
								</div>
								<div className="flex flex-wrap justify-between overflow-scroll max-h-[107.5vh]">
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
			</div>
		</main>
		/*<main className="bg-gray-100">
			<h1 className="text-black text-4xl text-center font-bold p-5 pb-0">Add Cat</h1>
			<div className="flex flex-col">
				<h2 className="text-black text-2xl font-bold p-5 pb-0">Details</h2>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="name"
					placeholder="Cat Name"
					value={cat.name}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="breed"
					placeholder="Cat Breed"
					value={cat.breed}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="gender"
					placeholder="Cat Gender"
					value={cat.gender}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="age"
					placeholder="Cat Age"
					value={cat.age}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="color"
					placeholder="Cat Color"
					value={cat.color}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="eye-color"
					placeholder="Cat Eye Color"
					value={cat.eye_color}
					onChange={handleChange}
				/>
			</div>
			<button className="text-white text-2xl rounded-lg px-5 py-3 m-5 bg-[#305B73]" onClick={handleSubmit}>Next</button>
		</main>*/
	)
}