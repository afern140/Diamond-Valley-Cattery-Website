"use client"

import { useState, useEffect } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import { getObject, getObjects, updateObject } from "@/app/_utils/firebase_services";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CatSelection from "@/app/components/cats/cat-selection";
import CatButton from "@/app/components/cats/cat-button";
import AddCatButton from "@/app/components/cats/add-cat-button";
import EditThumbnail from "@/app/components/images/edit-thumbnail";
import EditCarousel from "@/app/components/images/edit-carousel";

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({ params }) {
	const [litter, setLitter] = useState();
	const [thumbnail, setThumbnail] = useState();
	const [carouselImages, setCarouselImages] = useState([]);
	const [cats, setCats] = useState([]);
	const [selectedParent, setSelectedParent] = useState();
	const [showParentSelection, setShowParentSelection] = useState(false);
	const [showChildSelection, setShowChildSelection] = useState(false);
	
	useEffect(() => {
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

	const handleThumbnailChange = async (e) => {
		const file = e.target.files[0];
		const thumbnailRef = ref(strg, `thumbnails/litters/${litter.id}`);
		await uploadBytes(thumbnailRef, file);
		const thumbnailUrl = await getDownloadURL(thumbnailRef);
		setThumbnail(thumbnailUrl);
		setLitter((prevLitter) => ({ ...prevLitter, thumbnail: thumbnailUrl }));
	};

	const handleCarouselAdd = async (e) => {
		const newId = litter.carouselImages.length;
		const file = e.target.files[0];
		const carouselRef = ref(strg, `carousel-images/litters/${litter.id}/${newId}`);
		await uploadBytes(carouselRef, file);
		const carouselUrl = await getDownloadURL(carouselRef);
		setCarouselImages({ ...carouselImages, carouselUrl });
		setLitter((prevLitter) => ({ ...prevLitter, carouselImages: [ ...prevLitter.carouselImages, carouselUrl ] }));
	}

	const handleCarouselDelete = async (index) => {
		//Deleting an Image doesn't properly remove the link to the image from the array
		const updatedCarouselImages = litter.carouselImages.filter((image, i) => i !== index);
		const imageRef = ref(strg, `carousel-images/litters/${litter.id}/${index}`);
		await deleteObject(imageRef);
		setLitter((prevLitter) => ({ ...prevLitter, carouselImages: updatedCarouselImages }));
	}

	const handleSubmit = async () => {
		const motherRef = doc(db, 'cats', litter.mother.docId);
		const fatherRef = doc(db, 'cats', litter.father.docId);
		let childrenRefs = [];
		if (litter.completed) {
		  childrenRefs = litter.children.map(child => doc(db, 'cats', child.docId));
		}
		const updatedLitter = { ...litter, mother: motherRef, father: fatherRef, children: childrenRefs };
		await updateObject('litters', updatedLitter, true);
		window.location.href = `/cats/${litter.id}`;
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
							<EditThumbnail handleThumbnailChange={handleThumbnailChange} thumbnail={thumbnail}/>
						</div>
						
						<div className="w-full h-fit flex-col space-y-2 bg-navbar-body-1 dark:bg-gray-300 rounded-xl drop-shadow-lg p-4 max-w-[400px] mx-auto my-4 xl:m-4">
							<h2 className="text-2xl mb-4 font-bold">Details</h2>
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
						<div className="size-full bg-navbar-body-1 dark:bg-gray-300 p-4 rounded-xl drop-shadow-lg mx-auto my-4 xl:m-4">	
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
					<div className="mt-10 bg-white dark:text-dark-header-text-0 dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg h-[420px]">
						<div className="h-[300px]">
							<h2 className="text-xl font-bold mb-4">Images</h2>
							<EditCarousel object={litter} handleCarouselAdd={handleCarouselAdd} handleCarouselDelete={handleCarouselDelete}/>
						</div>
					</div>

					{/* Parents */}
					<div className="bg-white dark:bg-gray-500 p-10 rounded-xl drop-shadow-lg mt-10">
						<h2 className="text-2xl dark:text-dark-header-text-0">Parents</h2>
						<div className="flex mt-6">
							{litter.mother ? (
								<div className=" flex justify-center flex-col font-bold p-4 m-4 drop-shadow-lg bg-navbar-body-1 dark:bg-gray-300 rounded-xl text-header-text-0 place-items-center">
									<h2>Mother</h2>
									<CatButton cat={litter.mother}/>
									<button className="px-4 py-2 drop-shadow-lg bg-white rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('mother')}>Replace Mother</button>
								</div>
							) : (<></>)}
							{litter.father ? (
								<div className=" flex justify-center flex-col font-bold p-4 m-4 drop-shadow-lg bg-navbar-body-1 dark:bg-gray-300 rounded-xl text-header-text-0 place-items-center">
									<h2>Father</h2>
									<CatButton cat={litter.father}/>
									<button className="px-4 py-2 bg-white drop-shadow-lg rounded-xl mt-6" onClick={() => handleSelectParentToUpdate('mother')}>Replace Father</button>
								</div>
							) : (<></>)}
							<div className="">
								<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-500 flex flex-col overflow-y-auto p-10 rounded-xl drop-shadow-lg mt-10 h-[530px]">
						<h2 className="text-2xl dark:text-dark-header-text-0">Children</h2>
						{litter.completed ? (
							<div className="flex flex-wrap overflow-y-auto">
								{litter.children.map((child) => (
									<div className=" flex justify-center flex-col font-bold p-4 m-4 drop-shadow-lg bg-navbar-body-1 dark:bg-gray-300 rounded-xl text-header-text-0 place-items-center">
										<CatButton cat={child}/>
										<button className="px-4 py-2 bg-gradient-to-r drop-shadow-lg bg-white rounded-xl mt-6" onClick={() => handleRemoveChild(child)}>Remove {child.name}</button>
									</div>
								))}
								<div className=" flex justify-center flex-col font-bold p-4 m-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg rounded-xl border-2 border-gray-300 border-dashed text-header-text-0 place-items-center">
									<AddCatButton/>
									<button className="px-4 py-2 bg-white drop-shadow-lg rounded-xl mt-6" onClick={() => handleAddChild()}>Select Child</button>
								</div>
								<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
							</div>

						) : (
							<div className={" bg-navbar-body-1 dark:bg-gray-300 rounded-xl drop-shadow-lg mt-6 " + (showChildSelection ? "w-full h-[460px]" : " size-fit")}>
								<button className="size-full p-4" onClick={handleMarkAsComplete}>Mark as Complete</button>
								<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
							</div>
						)}
					</div>
					<button className="flex m-auto px-6 py-4 bg-white drop-shadow-lg rounded-xl mt-16 text-2xl" onClick={handleSubmit}>Submit</button>
					{/* <LitterCarouselController onImageUpload={handleImageUpload} litter={litter} /> */}
				</div>
			) : (
				<div className="h-screen">
					<h1>Loading...</h1>
				</div>
			)}
		</main>
	)
}