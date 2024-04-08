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
		</main>
	)
}