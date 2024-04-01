"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import { getObject, getObjects, updateObject } from "@/app/_utils/firebase_services";
import CatSelection from "@/app/components/cats/cat-selection";

export default function Page({ params }) {
	const [litter, setLitter] = useState();
	const [cats, setCats] = useState([]);
	const [selectedParent, setSelectedParent] = useState();
	const [showParentSelection, setShowParentSelection] = useState(false);
	const [showChildSelection, setShowChildSelection] = useState(false);

	useEffect(() => {
		const fetchLitter = async () => {
			const litter = await getObject('litters', parseInt(params.litter));
			if (litter.mother) {
				const mother = await getDoc(litter.mother);
				litter.mother = mother.data();
			} else {
				litter.mother = null;
			}
			if (litter.father) {
				const father = await getDoc(litter.father);
				litter.father = father.data();
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

	const handleSubmit = async () => {
		const motherRef = doc(db, 'cats', litter.mother.docId);
		const fatherRef = doc(db, 'cats', litter.father.docId);
		let childrenRefs = [];
		if (litter.completed) {
			childrenRefs = litter.children.map(child => doc(db, 'cats', child.docId));
		}
		const updatedLitter = { ...litter, mother: motherRef, father: fatherRef, children: childrenRefs }
		await updateObject('litters', updatedLitter, true)
	};

	return (
		<main className="bg-white text-black">
			{litter ? (
				<div>
					<h1>Edit {litter.name}</h1>
					<h2>Details</h2>
					<div>
						<input
							type="text"
							name="name"
							placeholder={litter.name}
							value={litter.name}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="description"
							placeholder={litter.description}
							value={litter.description}
							onChange={handleChange}
						/>
						<input
							type="date"
							name="expDate"
							value={new Date(litter.expDate.toDate()).toISOString().split('T')[0]}
							onChange={handleDateChange}
						/>
					</div>
					<h2>Parents</h2>
					<div>
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
						) : (<></>)}
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
						) : (<></>)}
						<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
					</div>
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
			) : (
				<h1>Loading...</h1>
			)}
		</main>
	)
}