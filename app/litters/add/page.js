"use client"

import Link from "next/link";
import Image from "next/image";
import { db } from "@/app/_utils/firebase";
import { getObjects, createObject } from "@/app/_utils/firebase_services";
import CatSelection from "@/app/components/cats/cat-selection";

import React, { useState, useEffect } from "react";
import Dropdown from "@/app/components/dropdown";
import CatParentButton from "@/app/addcat/parent_button";
import { v4 } from "uuid";
import ApiDataContext from '../../_utils/api_context';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ImageUploader from "@/app/addcat/ImageUploader";
import { doc, collection, getDocs, addDoc, query, Timestamp } from "firebase/firestore";
import BackgroundUnderlay from "@/app/components/background-underlay";


export default function Page() {
	const [litter, setLitter] = useState({
		id: null,
		name: null,
		description: null,
		mother: null,
		father: null,
		expDate: null,
		completed: false,
		thumbnail: null,
		children: []
	});
	const [litters, setLitters] = useState([]);
	const [selectedParent, setSelectedParent] = useState();
	const [showParentSelection, setShowParentSelection] = useState(false);
	const [showChildSelection, setShowChildSelection] = useState(false);

	const [selectedMother, setSelectedMother] = useState("");
	const [selectedFather, setSelectedFather] = useState("");

	const { cats, setCats } = React.useContext(ApiDataContext);
	const [fieldInput_parents, setFieldInput_parents] = useState("");
	const [filteredResults_parents, setFilteredResults_parents] = useState(cats);
	//Holds list of available conditions
	const [conditions, setConditions] = useState();
	const [inputKey, setInputKey] = useState(Date.now());

	useEffect(() => {
		const fetchCats = async () => {
			const litters = await getObjects('litters');
			setLitters(litters);
		};
		fetchCats();
	}, []);

	useEffect(() => {
		const fetchCats = async () => {
			const cats = await getObjects('cats');
			setCats(cats);
		};
		fetchCats();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLitter((prevLitter) => ({ ...prevLitter, [name]: value }));
	};

	const handleImageSelected = async (file) => {
	};

	const handleDateChange = (e) => {
		const { name, value } = e.target;
		const date = new Date(value);
		const timestamp = Timestamp.fromDate(date);
		setLitter((prevLitter) => ({ ...prevLitter, [name]: timestamp }))
	};

	const handleSelectParentToUpdate = (parent) => {
		setSelectedParent(parent);
		setShowParentSelection(true);
	};

	const handleReplaceParent = (selectedCat) => {
		const updatedLitter = { ...litter, [selectedParent]: selectedCat };
		setLitter(updatedLitter);
		setShowParentSelection(false);
	};

	const handleMarkAsComplete = () => {
		setShowChildSelection(true);
	};

	const handleSelectChild = (selectedCat) => {
		setShowChildSelection(false);
		const updatedChildren = [...litter.children, selectedCat];
		setLitter((prevLitter) => ({ ...prevLitter, children: updatedChildren }));
		if (litter.completed == false) {
			setLitter((prevLitter) => ({ ...prevLitter, completed: true }));
		}
	};

	const handleAddChild = () => {
		setShowChildSelection(true);
	};

	const handleRemoveChild = (childToRemove) => {
		const updatedChildren = litter.children.filter(child => parseInt(child.id) !== parseInt(childToRemove.id));
		setLitter(prevLitter => ({ ...prevLitter, children: updatedChildren }));
	};

	const handleSubmit = async () => {
		const newId = litters.reduce((max, litter) => Math.max(max, litter.id), 0) + 1;
		const motherRef = doc(db, 'cats', litter.mother.docId);
		const fatherRef = doc(db, 'cats', litter.father.docId);
		let childrenRefs = [];
		if (litter.completed) {
			childrenRefs = litter.children.map(child => doc(db, 'cats', child.docId));
		}
		const updatedLitter = { ...litter, id: newId, mother: motherRef, father: fatherRef, children: childrenRefs }
		await createObject('litters', updatedLitter)
	};

	return (
		<main className="w-full flex-col relative justify-center text-black text-xl font-normal">
			<BackgroundUnderlay />

			<div className="pt-20 flex pb-10">
				<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-gradient-to-r from-[#A783D5] via-[#EB9839] to-[#E37B87] text-transparent bg-clip-text">
					<span className="text-6xl pb-10 font-extrabold">ADD LITTER</span> <br />
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

								<h3 className="py-2 text-lg">Expected Date</h3>
								<input type="text" name="exp_date" placeholder="Expected Date" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />

								<h3 className="py-2 text-lg">Completed</h3>
								<select name="gender" className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">
									<option value="Not Completed">Not Completed</option>
									<option value="Completed">Completed</option>
								</select>
								{/*<input type="text" name="gender" placeholder="Gender" className=" rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300" />*/}

								
								<h3 className="py-2 text-lg">Mother</h3>
								{selectedMother ? <p>{selectedMother}</p> : <p>None</p>}

								<h3 className="py-2 text-lg">Father</h3>
								{selectedFather ? <p>{selectedFather}</p> : <p>None</p>}
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

						<div className="mt-6 bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] p-4 rounded-xl">
							<h2 className="flex py-6 justify-center font-bold text-2xl text-gray-700">Kittens</h2>
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
		/*<main className="bg-white text-black">
			<h1>Add Litter</h1>
			<div>
				<h2>Details</h2>
				<input
					type="text"
					name="name"
					placeholder={litter.name ? litter.name : "Name"}
					value={litter.name}
					onChange={handleChange}
				/>
				<input
					type="text"
					name="description"
					placeholder={litter.description ? litter.description : "Description"}
					value={litter.description}
					onChange={handleChange}
				/>
				<input
					type="date"
					name="expDate"
					value={litter.expDate ? new Date(litter.expDate.toDate()).toISOString().split('T')[0] : ""}
					onChange={handleDateChange}
				/>
			</div>
			<div>
				<h2>Parents</h2>
					{litter.mother ? (
						<div>
							<h2>Mother</h2>
							<h3>{litter.mother.name}</h3>
							<Image
								src={litter.mother.thumbnail ? litter.mother.thumbnail : "/img/Placeholder.png"}
								alt="Cat"
								width={200}
								height={100}
							/>
							<button onClick={() => handleSelectParentToUpdate('mother')}>Replace Mother</button>
						</div>
					) : (<button onClick={() => handleSelectParentToUpdate('mother')}>Add Mother</button>)}
					{litter.father ? (
						<div>
							<h2>Father</h2>
							<h3>{litter.father.name}</h3>
							<Image
								src={litter.father.thumbnail ? litter.father.thumbnail : "/img/Placeholder.png"}
								alt="Cat"
								width={200}
								height={100}
							/>
							<button onClick={() => handleSelectParentToUpdate('father')}>Replace Father</button>
						</div>
					) : (<button onClick={() => handleSelectParentToUpdate('father')}>Add Father</button>)}
					<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
			</div>
			<div>
				<h2>Children</h2>
				{litter.completed ? (
					<div>
						{litter.children.map((child) => (
							<div>
								<h3>{child.name}</h3>
								<Image
									src={child.thumbnail ? child.thumbnail : "/img/Placeholder.png"}
									alt="Cat"
									width={200}
									height={100}
								/>
								<button onClick={() => handleRemoveChild(child)}>Remove {child.name}</button>
							</div>
						))}
						<div>
							<Image
								src="/img/Placeholder.png"
								alt="Cat"
								width={200}
								height={100}
							/>
							<button onClick={() => handleAddChild()}>Select Child</button>
						</div>
						<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
					</div>
				) : (<div>
						<button onClick={handleMarkAsComplete}>Mark as Complete</button>
						<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
					</div>
				)}
				<button onClick={handleSubmit}>Submit</button>
			</div>
		</main>*/
	)
}