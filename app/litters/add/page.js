"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { doc, Timestamp, collection, addDoc } from "firebase/firestore";
import { imageDb, db } from "@/app/_utils/firebase";
import { getObjects, createObject } from "@/app/_utils/firebase_services";
import CatSelection from "@/app/components/cats/cat-selection";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ImageUploader from "@/app/components/ImageUploader";

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
	const [thumbnail, setThumbnail] = useState(null);
	const handleImageSelected = (file) => {
		setThumbnail(file);
	  };
	  

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

	const handleSubmit = async () => {
		let thumbnailUrl = null;
		if (thumbnail) {
		  const storageRef = ref(imageDb, `thumbnails/${v4()}`);
		  const uploadResult = await uploadBytes(storageRef, thumbnail);
		  thumbnailUrl = await getDownloadURL(uploadResult.ref);
		}
	  
		const newId = litters.reduce((max, litter) => Math.max(max, litter.id), 0) + 1;
		const motherRef = doc(db, 'cats', litter.mother.docId);
		const fatherRef = doc(db, 'cats', litter.father.docId);
		let childrenRefs = [];
		if (litter.completed) {
		  childrenRefs = litter.children.map(child => doc(db, 'cats', child.docId));
		}
		const updatedLitter = { ...litter, id: newId, mother: motherRef, father: fatherRef, children: childrenRefs, thumbnail: thumbnailUrl };
		await createObject('litters', updatedLitter);
	  };
	  

	return (
		<main className="bg-white text-black">
			<h1>Add Litter</h1>
			<div>
				<h2>Details</h2>
				<ImageUploader onImageSelected={handleImageSelected} inputKey="litter-thumbnail" />
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

			<div className="flex w-4/5 p-10 mt-6 m-auto justify-evenly rounded-lg min-w-64 bg-white dark:bg-gray-500 drop-shadow-lg text-[#092C48]">
				<div className="w-full flex-col space-y-2">
					<h2 className="text-2xl mb-2">Details</h2>
					<div className="flex space-x-3">
						<h3 className="my-auto">Name: </h3>
						<input
						className="p-1 rounded-xl bg-[#d8d8ff] pl-2 drop-shadow-lg"
						type="text"
						name="name"
						placeholder={litter.name ? litter.name : "Name"}
						value={litter.name}
						onChange={handleChange}
					/>
					</div>
					<div className="flex space-x-3">
						<h3 className="my-auto">Date Expected: </h3>
						<input
							className="p-1 rounded-xl bg-[#e5e5ff] pl-2 drop-shadow-lg"
							type="date"
							name="expDate"
							value={litter.expDate ? new Date(litter.expDate.toDate()).toISOString().split('T')[0] : ""}
							onChange={handleDateChange}
						/>
					</div>
				</div>
				<div className="bg-[#092C48] w-4 h-4/5 rounded-full relative" />
				<div className="size-full">	
					<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
					<div className="size-full">
						<textarea
							className=" rounded-xl bg-[#e5e5ff] p-2 size-full drop-shadow-lg"
							type="text"
							name="description"
							placeholder={litter.description ? litter.description : "Description"}
							value={litter.description}
							onChange={handleChange}
						/>
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl mx-10 mt-10 dark:text-dark-header-text-0">Parents</h2>
				<div className="flex px-10 space-x-10 mt-6">
					{litter.mother ? (
						<div className=" flex justify-center flex-col font-bold p-4 bg-[#F6DCE6] border-[3px] border-[#092C48] drop-shadow-lg rounded-xl text-[#092C48] place-items-center">
							<h2>Mother</h2>
							<h3>{litter.mother.name}</h3>
							<Image
								src={litter.mother.thumbnail ? litter.mother.thumbnail : "/img/Placeholder.png"}
								alt="Cat"
								width={300}
								height={300}
								className="justify-center align-center place-items-center"
								objectFit="contain"
							/>
							<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('mother')}>Replace Mother</button>
						</div>
					) : (<button className="px-4 py-2 bg-gradient-to-r mb-auto bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl" onClick={() => handleSelectParentToUpdate('mother')}>Add Mother</button>)}
					{litter.father ? (
						<div>
							<h2>Father</h2>
							<h3>{litter.father.name}</h3>
							<Image
								src={litter.father.thumbnail ? litter.father.thumbnail : "/img/Placeholder.png"}
								alt="Cat"
								width={300}
								height={300}
								className="justify-center align-center place-items-center"
								objectFit="contain"
							/>
							<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('father')}>Replace Father</button>
						</div>
					) : (<button className="px-4 py-2 bg-gradient-to-r mb-auto bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl" onClick={() => handleSelectParentToUpdate('father')}>Add Father</button>)}
				</div>
				<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
			</div>
			<div>
				<h2 className="text-2xl mx-10 mt-10 dark:text-dark-header-text-0">Children</h2>
				{litter.completed ? (
					<div className="flex px-10 space-x-10 mt-6">
						{litter.children.map((child) => (
							<div className=" flex justify-center flex-col font-bold p-4 bg-[#F6DCE6] border-[3px] border-[#092C48] drop-shadow-lg rounded-xl text-[#092C48] place-items-center">
								<h3>{child.name}</h3>
								<Image
									src={child.thumbnail ? child.thumbnail : "/img/Placeholder.png"}
									alt="Cat"
									width={300}
									height={300}
									className="justify-center align-center place-items-center"
									objectFit="contain"
								/>
								<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleRemoveChild(child)}>Remove {child.name}</button>
							</div>
						))}
						<div className=" flex justify-center flex-col font-bold p-4 bg-[#F6DCE6] border-[3px] border-[#092C48] drop-shadow-lg rounded-xl text-[#092C48] place-items-center">
							<Image
								src="/img/Placeholder.png"
								alt="Cat"
								width={300}
									height={300}
									className="justify-center align-center place-items-center"
									objectFit="contain"
							/>
							<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-6" onClick={() => handleAddChild()}>Select Child</button>
						</div>
						<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
					</div>
				) : (<div className="p-4 px-10">
						<button className="px-4 py-2 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl" onClick={handleMarkAsComplete}>Mark as Complete</button>
						<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
					</div>
				)}
				<button className="flex m-auto px-6 py-4 bg-white dark:bg-gray-500 drop-shadow-lg rounded-xl mt-16 text-2xl" onClick={handleSubmit}>Submit</button>
			</div>
		</main>
	)
}