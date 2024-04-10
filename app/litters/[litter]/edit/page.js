"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import { getObject, getObjects, updateObject } from "@/app/_utils/firebase_services";
import CatSelection from "@/app/components/cats/cat-selection";
import ImageUploader from "@/app/components/ImageUploader";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import LitterCarouselController from "@/app/components/LitterCarouselController";

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({ params }) {
	const [imageFile, setImageFile] = useState(null);
	const [litter, setLitter] = useState();
	const [cats, setCats] = useState([]);
	const [selectedParent, setSelectedParent] = useState();
	const [showParentSelection, setShowParentSelection] = useState(false);
	const [showChildSelection, setShowChildSelection] = useState(false);
	const handleImageSelected = (file) => {
		setImageFile(file);
	  };	  
	  const fetchLitter = async () => {
		const litter = await getObject('litters', parseInt(params.litter));
		if (litter.mother) {
			const mother = await getDoc(litter.mother);
			litter.mother = { docId: litter.mother.id, ...mother.data() };
		} else {
			litter.mother = null;
		}
		if (litter.father) {
			const father = await getDoc(litter.father);
			litter.father = { docId: litter.father.id, ...father.data() };
		} else {
			litter.father = null;
		}
		if (litter.children) {
			const children = await Promise.all(litter.children.map(async (childRef) => {
				const child = await getDoc(childRef)
				return { docId: childRef.id, ...child.data()};
			}));
			litter.children = children;
		} else {
			litter.children = null;
		}
		setLitter(litter);
	};
    
	useEffect(() => {
		fetchLitter();
	}, [params]);

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
		// Upload the image to Firebase Storage if an image is selected
		let imageUrl = litter.thumbnail; // Default to the existing thumbnail URL
		if (imageFile) {
		  const storage = getStorage();
		  const imageRef = ref(storage, `litters/${litter.id}/thumbnail`);
		  await uploadBytes(imageRef, imageFile);
		  imageUrl = await getDownloadURL(imageRef);
		}
	  
		// Update the Firestore document
		const motherRef = doc(db, 'cats', litter.mother.docId);
		const fatherRef = doc(db, 'cats', litter.father.docId);
		let childrenRefs = [];
		if (litter.completed) {
		  childrenRefs = litter.children.map(child => doc(db, 'cats', child.docId));
		}
		const updatedLitter = {
		  ...litter,
		  mother: motherRef,
		  father: fatherRef,
		  children: childrenRefs,
		  thumbnail: imageUrl // Set the new thumbnail URL
		};
		await updateObject('litters', updatedLitter, true);
	  };
	
	const handleImageUpload = async (imageUrl) => {
		try {
			fetchCat()
		} catch (error) {
			console.error("Error handling image upload:", error);
		}
	};

	return (
		<main className="relative text-[#092C48] pb-12">
			<BackgroundUnderlay />
			{litter ? (
				<div className="w-4/5 mx-auto">
					<div className="pt-20 flex pb-10">
						<div className=" m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
							<span className="text-6xl pb-10 font-extrabold">Edit {litter.name}</span> <br />
						</div>
					</div>

					{/* Edit Details */}
					<div className="flex flex-col xl:flex-row p-10 mt-6 m-auto justify-evenly rounded-lg min-w-64 bg-white dark:bg-gray-500 drop-shadow-lg text-[#092C48]">
						<div className="size-full mx-auto my-4 xl:m-4 max-w-[300px] h-[300px]">
							<ImageUploader onImageSelected={handleImageSelected} />
						</div>
						
						<div className="w-full h-fit flex-col space-y-2 bg-navbar-body-1 rounded-xl drop-shadow-lg p-4 max-w-[400px] mx-auto my-4 xl:m-4">
							<h2 className="text-2xl mb-4 font-bold dark:text-dark-header-text-0">Details</h2>
							<div className="flex space-x-3">
								<h3 className="my-auto w-32 text-right">Name: </h3>
								<input
								className="p-1 rounded-md bg-white drop-shadow-lg w-40"
								type="text"
								name="name"
								placeholder={litter.name}
								value={litter.name}
								onChange={handleChange}
							/>
							</div>
							<div className="flex space-x-3">
								<h3 className="my-auto w-32 text-right">Date Expected: </h3>
								<input
									className="p-1 rounded-md bg-white drop-shadow-lg w-40"
									type="date"
									name="expDate"
									value={new Date(litter.expDate.toDate()).toISOString().split('T')[0]}
									onChange={handleDateChange}
								/>
							</div>
							<div className="pb-4" />
						</div>
						<div className="bg-[#092C48] w-4 h-4/5 rounded-full relative" />
						<div className="size-full bg-navbar-body-1 p-4 rounded-xl drop-shadow-lg mx-auto my-4 xl:m-4">	
							<h2 className="text-2xl mb-4 font-extrabold">Description</h2>
							<div className="size-full">
								<textarea
									className="size-full rounded-md p-2 bg-white drop-shadow-lg min-h-[150px]"
									type="text"
									name="description"
									placeholder={litter.description}
									value={litter.description}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>

					{/* Parents */}
					<div className="bg-white p-10 rounded-xl drop-shadow-lg mt-10">
						<h2 className="text-2xl dark:text-dark-header-text-0">Parents</h2>
						<div className="flex px-10 space-x-10 mt-6">
							{litter.mother ? (
								<div className=" flex justify-center flex-col font-bold p-4 m-4 drop-shadow-lg bg-navbar-body-1 rounded-xl text-header-text-0 place-items-center">
									<h2>Mother</h2>
									<h3 className="font-normal mb-4">{litter.mother.name}</h3>
									<Image
										alt="Cat"
										src={litter.mother.thumbnail ? litter.mother.thumbnail : "/img/Placeholder.png"}
										width={200}
										height={200}
										className="justify-center align-center place-items-center"
										objectFit="contain"
									/>
									<button className="px-4 py-2 drop-shadow-lg bg-white rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('mother')}>Replace Mother</button>
								</div>
							) : (<></>)}
							{litter.father ? (
								<div className=" flex justify-center flex-col font-bold p-4 m-4 drop-shadow-lg bg-navbar-body-1 rounded-xl text-header-text-0 place-items-center">
									<h2>Father</h2>
									<h3 className="font-normal mb-4">{litter.father.name}</h3>
									<Image
										alt="Cat"
										src={litter.father.thumbnail ? litter.father.thumbnail : "/img/Placeholder.png"}
										width={200}
										height={200}
										className="justify-center align-center place-items-center"
										objectFit="contain"
									/>
									<button className="px-4 py-2 bg-white drop-shadow-lg rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('mother')}>Replace Father</button>
								</div>
							) : (<></>)}
							<div className="">
								<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
							</div>
						</div>
					</div>

					{/*</div><div className="bg-white p-10 rounded-xl drop-shadow-lg mt-10">*/}
						<h2 className="text-2xl dark:text-dark-header-text-0">Children</h2>
						{litter.completed ? (
							<div className="flex">
								{litter.children.map((child) => (
									<div className=" flex justify-center flex-col font-bold p-4 m-4 drop-shadow-lg bg-navbar-body-1 rounded-xl text-header-text-0 place-items-center">
										<h3>{child.name}</h3>
										<Image
											alt="Cat"
											src={child.thumbnail ? child.thumbnail : "/img/Placeholder.png"}
											width={200}
											height={200}
											className="justify-center align-center place-items-center"
											objectFit="contain"
										/>
										<button className="px-4 py-2 bg-gradient-to-r drop-shadow-lg bg-white rounded-xl mt-6" onClick={() => handleRemoveChild(child)}>Remove {child.name}</button>
									</div>
								))}
								<div className=" flex justify-center flex-col font-bold p-4 m-4 bg-navbar-body-1 drop-shadow-lg rounded-xl text-header-text-0 place-items-center">
									<Image
										alt="Cat"
										src={"/img/Placeholder.png"}
										width={200}
										height={200}
										className="justify-center align-center place-items-center"
										objectFit="contain"
									/>
									<button className="px-4 py-2 bg-white drop-shadow-lg rounded-xl mt-6" onClick={() => handleAddChild()}>Select Child</button>
								</div>
							<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
						</div>
					) : (
						<div className=" size-fit mx-10 mt-6 flex-col font-bold p-4 bg-[#F6DCE6] border-[3px] border-[#092C48] drop-shadow-lg rounded-xl text-[#092C48] place-items-center">
							<button className="px-4 py-2 bg-gradient-to-r from-white to-navbar-body-1 drop-shadow-lg border border-[#092C48] rounded-xl mt-6" onClick={handleMarkAsComplete}>Mark as Complete</button>
							<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
						</div>
					)}
					<div className="">
						<LitterCarouselController onImageUpload={handleImageUpload} litter={litter} />
					</div>
					<button className="flex m-auto px-6 py-4 bg-white drop-shadow-lg rounded-xl mt-16 text-2xl" onClick={handleSubmit}>Submit</button>
				</div>
			) : (
				<div className="h-screen">
					<h1>Loading...</h1>
				</div>
			)}
		</main>
	)
}