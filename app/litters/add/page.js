"use client"

import { useState, useEffect } from "react";
import { doc, Timestamp, collection, addDoc } from "firebase/firestore";
import { strg, db } from "@/app/_utils/firebase";
import { getObjects, createObject } from "@/app/_utils/firebase_services";
import CatSelection from "@/app/components/cats/cat-selection";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import CatButton from "@/app/components/cats/cat-button";
import AddCatButton from "@/app/components/cats/add-cat-button";
import EditThumbnail from "@/app/components/images/EditThumbnail";

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
	const [thumbnail, setThumbnail] = useState();
	const [cats, setCats] = useState([]);
	const [litters, setLitters] = useState([]);
	const [selectedParent, setSelectedParent] = useState();
	const [showParentSelection, setShowParentSelection] = useState(false);
	const [showChildSelection, setShowChildSelection] = useState(false);

	useEffect(() => {
		const fetchLitters = async () => {
			const litters = await getObjects('litters');
			setLitters(litters);
		};
		fetchLitters();
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

	const handleThumbnailChange = async (e) => {
		const file = e.target.files[0];
		const thumbnailRef = ref(strg, `thumbnails/litters/${litter.id}`);
		await uploadBytes(thumbnailRef, file);
		const thumbnailUrl = await getDownloadURL(thumbnailRef);
		setThumbnail(thumbnailUrl);
		setLitter((prevLitter) => ({ ...prevLitter, thumbnail: thumbnailUrl }));
	};

	const handleSubmit = async () => {
		const newId = litters.reduce((max, litter) => Math.max(max, litter.id), 0) + 1;
		const motherRef = doc(db, 'cats', litter.mother.docId);
		const fatherRef = doc(db, 'cats', litter.father.docId);
		let childrenRefs = [];
		if (litter.completed) {
			childrenRefs = litter.children.map(child => doc(db, 'cats', child.docId));
		}
		const updatedLitter = { ...litter, id: newId, mother: motherRef, father: fatherRef, children: childrenRefs };
		await createObject('litters', updatedLitter);
	};
	  
	return (
		<main className=" relative text-header-text-0 pb-16">
			<BackgroundUnderlay />

			<div className="w-4/5 mx-auto">
				<div className="pt-20 flex pb-10">
					<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
						<span className="text-6xl pb-10 font-extrabold">Add Litter</span> <br />
					</div>
				</div>

				<div className="mt-10 bg-white dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg">
					<h2 className="text-2xl mb-4">Details</h2>
					<div className="flex flex-col xl:flex-row justify-evenly">
						<div className="mx-auto w-[300px] h-[300px] justify-evenly">
							<EditThumbnail handleThumbnailChange={handleThumbnailChange} thumbnail={thumbnail}/>
						
							{/*<div>
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
							</div>*/}
						</div>

						<div className="w-fit m-4 h-fit flex-col -translate-x-[20px] space-y-2 bg-navbar-body-1 dark:bg-gray-300 p-4 rounded-xl drop-shadow-lg">
							<h2 className="text-2xl mb-2 font-bold dark:text-dark-header-text-0">Details</h2>
							<div className="flex space-x-3">
								<h3 className="my-auto w-32 text-right">Name: </h3>
								<input
								className="p-1 rounded-md bg-white pl-2 drop-shadow-lg w-40"
								type="text"
								name="name"
								placeholder={litter.name ? litter.name : "Name"}
								value={litter.name}
								onChange={handleChange}
							/>
							</div>
							<div className="flex space-x-3">
								<h3 className="my-auto w-32 text-right">Date Expected: </h3>
								<input
									className="p-1 rounded-md bg-white pl-2 drop-shadow-lg w-40"
									type="date"
									name="expDate"
									value={litter.expDate ? new Date(litter.expDate.toDate()).toISOString().split('T')[0] : ""}
									onChange={handleDateChange}
								/>
							</div>
						</div>
						<div className=" w-full max-w-[40%] h-fit translate-x-[20px] bg-navbar-body-1 dark:bg-gray-300 m-4 p-4 rounded-xl drop-shadow-lg">	
							<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
							<div className="size-full">
								<textarea
									className=" rounded-xl bg-white p-2 w-full min-h-32 drop-shadow-lg"
									type="text"
									name="description"
									placeholder={litter.description ? litter.description : "Description"}
									value={litter.description}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Parents */}
				<div className="mt-10 bg-white dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg">
					<div>
						<h2 className="text-2xl dark:text-dark-header-text-0">Parents</h2>
						<div className="flex px-10 space-x-10 mt-6">
							{litter.mother ? (
								<div className="m-4 p-4 bg-navbar-body-1 dark:bg-gray-300 rounded-xl drop-shadow-lg items-center text-center">
									<h2>Mother</h2>
									<CatButton cat={litter.mother}/>
									<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('mother')}>Replace Mother</button>
								</div>
							) : (
							<div className=" flex justify-center flex-col m-2 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
								<AddCatButton/>
								<button onClick={() => handleSelectParentToUpdate('mother')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Add Mother</button>
							</div>)}
							{litter.father ? (
								<div className="m-4 p-4 bg-navbar-body-1 dark:bg-gray-300 rounded-xl drop-shadow-lg items-center text-center">
									<h2>Father</h2>
									<CatButton cat={litter.father}/>
									<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('father')}>Replace Father</button>
								</div>
							) : (
								<div className=" flex justify-center flex-col m-2 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
									<AddCatButton/>
									<button onClick={() => handleSelectParentToUpdate('father')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Add Father</button>
								</div>)}
						</div>
						<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
					</div>
				</div>

				{/* Children */}
				<div className="mt-10 bg-white dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg">
				<h2 className="text-2xl dark:text-dark-header-text-0">Children</h2>
					
					{litter.completed ? (
						<div className="flex px-10 space-x-10 mt-6">
							<h2 className="text-2xl dark:text-dark-header-text-0">Children</h2>
							{litter.children.map((child) => (
								<div className="m-4 p-4 bg-navbar-body-1 dark:bg-gray-300 rounded-xl drop-shadow-lg items-center text-center">
									<CatButton cat={child}/>
									<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleRemoveChild(child)}>Remove {child.name}</button>
								</div>
							))}
							<div className=" flex justify-center flex-col m-2 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
								<AddCatButton/>
								<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleAddChild()}>Select Child</button>
							</div>
							<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
						</div>
					) : (
					<div className={showChildSelection ? "h-[330px]  " : "h-fit"}>
						<button className="p-4 bg-navbar-body-1 dark:bg-gray-300 rounded-xl drop-shadow-lg mt-6" onClick={handleMarkAsComplete}>Mark as Complete</button>
						<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
					</div>
					)}
				</div>
				<div>
					<button className="flex m-auto px-6 py-4 drop-shadow-lg bg-navbar-body-0 dark:bg-gray-600 rounded-xl mt-16 text-2xl hover:scale-105 text-white transition duration-300" onClick={handleSubmit}>Submit</button>
				</div>
			</div>
		</main>
	)
}