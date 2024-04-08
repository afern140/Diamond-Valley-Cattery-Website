"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { db, imageDb } from "@/app/_utils/firebase"
import { doc, Timestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUserAuth } from "@/app/_utils/auth-context"
import { getObjects, createObject, updateObject } from "@/app/_utils/firebase_services"
import { getUser } from "@/app/_utils/user_services"
import { v4 } from "uuid";
import EditCondition from "@/app/components/conditions/edit-condition"
import AddCondition from "@/app/components/conditions/add-condition"
import EditVaccination from "@/app/components/vaccinations/edit-vaccination"
import AddVaccination from "@/app/components/vaccinations/add-vaccination"
import CatSelection from "@/app/components/cats/cat-selection"
import ImageUploader from "@/app/components/ImageUploader"

export default function Page() {
	const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [cats, setCats] = useState([]);
	const [conditions, setConditions] = useState([]);
	const [vaccinations, setVaccinations] = useState([]);
	const [selectedCondition, setSelectedCondition] = useState();
	const [selectedVaccine, setSelectedVaccine] = useState();
	const [selectedParent, setSelectedParent] = useState();
	const [showParentSelection, setShowParentSelection] = useState(false);
	const [showChildSelection, setShowChildSelection] = useState(false);
	const [showTakenDateSelection, setShowTakenDateSelection] = useState(false);
	const [showPlannedDateSelection, setShowPlannedDateSelection] = useState(false);
	const [inputKey, setInputKey] = useState(Date.now());
	const [cat, setCat] = useState({
		id: 0,
		name: "",
		breed: "",
		gender: "",
		birthdate: 0,
		color: "",
		eye_color: "",
		description: "",
		mother: "",
		father: "",
		owner: "",
		thumbnail: "",
		conditions: [],
		vaccinations: [],
		children: [],
		images: []
	})
	const [newCondition, setNewCondition] = useState({
		id: 0,
		name: "",
		description: "",
		treatment: "",
		treated: false
	});
	const [newDate, setNewDate] = useState('');
	const [newVaccine, setNewVaccine] = useState({
		id: 0,
		name: "",
		description: "",
		completed: false,
		dosesTaken: 0,
		datesTaken: [],
		dosesRemaining: 0,
		futureDates: []
	});

	useEffect(() => {
		const fetchUser = async () => {
			const filteredUser = await getUser(user);
			setFilteredUser(filteredUser);
		};
		fetchUser();
	}, [user]);

	useEffect(() => {
		const fetchCats = async () => {
			const cats = await getObjects('cats');
			setCats(cats);
			console.log(cats);
		};
		fetchCats();
	}, []);
	
	useEffect(() => {
		const fetchConditions = async () => {
			const conditions = await getObjects('conditions');
			setConditions(conditions);
		};
		fetchConditions();
	}, []);

	useEffect(() => {
		const fetchVaccinations = async () => {
			const vaccinations = await getObjects('vaccinations');
			setVaccinations(vaccinations);
		};
		fetchVaccinations();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCat((prevCat) => ({ ...prevCat, [name]: value }));
	}

	const handleDateChange = (e) => {
		const { name, value } = e.target;
		const date = new Date(value);
		const timestamp = Timestamp.fromDate(date);
		setCat((prevCat) => ({ ...prevCat, [name]: timestamp }))
	};

	const handleConditionChange = (e, conditionId) => {
		const { name, value } = e.target;
		if (conditionId === 0) {
			setNewCondition({...newCondition, [name]: value});
		} else {
			const updatedConditions = cat.conditions.map((condition) => {
				if (condition.id === conditionId) {
					return {...condition, [name]: value};
				}
				return condition;
			});
			setCat((prevCat) => ({...prevCat,conditions: updatedConditions}));
		}
	};

	const handleTreatedChange = (e, conditionId) => {
		const { value } = e.target;
		const updatedConditions = cat.conditions.map((condition) => {
			if (condition.id === conditionId) {
				return {...condition, treated: value === "finished" ? true : false};
			}
			return condition;
		});
		setCat((prevCat) => ({...prevCat, conditions: updatedConditions}));
	};

	const handleRemoveCondition = (conditionId) => {
		const updatedConditions = cat.conditions.filter((condition) => condition.id !== conditionId);
		setCat((prevCat) => ({...prevCat, conditions: updatedConditions}));
	};

	const handleSelectCondition = (e) => {
		const { value } = e.target;
		const condition = conditions.find(condition => condition.id === parseInt(value));
		setSelectedCondition(condition);
	}

	const handleAddSelectedCondition = () => {
		const condition = conditions.find(condition => condition.id === selectedCondition.id);
		setCat(prevCat => ({...prevCat, conditions: [...prevCat.conditions, condition]}));
		setSelectedCondition();
	};

	const handleAddCondition = async () => {
		const newId = conditions.reduce((max, condition) => Math.max(max, condition.id), 0) + 1;
		const updatedCondition = { ...newCondition, id: newId };
		const conditionRef = await createObject('conditions', updatedCondition);
		const newConditionWithId = { ...updatedCondition, docId: conditionRef.id };
		setCat(prevCat => ({ ...prevCat, conditions: [...prevCat.conditions, newConditionWithId] }));
		setNewCondition({
			id: 0,
			name: "",
			description: "",
			treatment: "",
			treated: false
		});
	};

	const handleVaccinationChange = (e, vaccinationId) => {
		const { name, value } = e.target;
		if (vaccinationId === 0) {
			setNewVaccine({ ...newVaccine, [name]: value })
		} else {
			const updatedVaccination = cat.vaccinations.map((vaccination) => {
				if (vaccination.id === vaccinationId) {
					return {...vaccination, [name]: value};
				}
				return vaccination;
			});
			setCat((prevCat) => ({...prevCat,vaccinations: updatedVaccination}));
		}
	};

	const handleStatusChange = (e, vaccinationId) => {
		const { value } = e.target;
		const updatedVaccination = cat.vaccinations.map((vaccination) => {
			if (vaccination.id === vaccinationId) {
				return {...vaccination, completed: value === "finished" ? true : false};
			}
			return vaccination;
		});
		setCat((prevCat) => ({...prevCat, vaccinations: updatedVaccination}));
	};
	
	const handleVaccinationDateChange = (e, vaccinationId, index, dateType) => {
		const { value } = e.target;
		const date = new Date(value);
		const timestamp = Timestamp.fromDate(date);
		if (vaccinationId === 0) {
			setNewVaccine({ ...newVaccine, [dateType]: newVaccine[dateType].map((date, i) => (i === index ? timestamp : date)) })
		} else {
			setCat((prevCat) => {
				const updatedVaccinations = prevCat.vaccinations.map((vaccination) => {
					if (vaccination.id === vaccinationId) {
						return { ...vaccination, [dateType]: vaccination[dateType].map((date, i) => (i === index ? timestamp : date)) };
					}
					return vaccination;
				});
				return { ...prevCat, vaccinations: updatedVaccinations };
			});
		}
	};
	
	const handleAddDate = (dateType, vaccinationId) => {
		const date = new Date(newDate);
		const timestamp = Timestamp.fromDate(date);
		if (vaccinationId === 0) {
			setNewVaccine({ ...newVaccine, [dateType]: [...newVaccine[dateType], timestamp] })
		} else {
			setCat((prevCat) => {
				const updatedVaccinations = prevCat.vaccinations.map((vaccination) => {
				if (vaccination.id === vaccinationId) {
					return { ...vaccination, [dateType]: [...vaccination[dateType], timestamp] };
				}
				return vaccination;
				});
				return { ...prevCat, vaccinations: updatedVaccinations };
			});
		}
		if (dateType === 'datesTaken') {
			setShowTakenDateSelection(false);
		}
		if (dateType === 'futureDates') {
			setShowPlannedDateSelection(false);
		}
	};
	
	const handleRemoveDate = (dateType, vaccinationId, index) => {
		if (vaccinationId === 0) {
			setNewVaccine({ ...newVaccine, [dateType]: newVaccine[dateType].filter((date, i) => i !== index) })
		} else {
			setCat((prevCat) => {
				const updatedVaccinations = prevCat.vaccinations.map((vaccination) => {
					if (vaccination.id === vaccinationId) {
						return { ...vaccination, [dateType]: vaccination[dateType].filter((date, i) => i !== index) };
					}
					return vaccination;
				});
				return { ...prevCat, vaccinations: updatedVaccinations };
			});
		}
	};
	
	const handleRemoveVaccination = (vaccinationId) => {
		const updatedVaccination = cat.vaccinations.filter((vaccination) => vaccination.id !== vaccinationId);
		setCat((prevCat) => ({...prevCat, vaccinations: updatedVaccination}));
	};

	const handleSelectVaccine = (e) => {
		const { value } = e.target;
		const vaccine = vaccinations.find(vaccine => vaccine.id === parseInt(value));
		setSelectedVaccine(vaccine);
	};

	const handleAddSelectedVaccine = () => {
		const vaccine = vaccinations.find(vaccine => vaccine.id === selectedVaccine.id);
		setCat(prevCat => ({...prevCat, vaccinations: [...prevCat.vaccinations, vaccine]}));
		setSelectedVaccine();
	};
	
	const handleAddVaccine = async () => {
		const newId = vaccinations.reduce((max, vaccine) => Math.max(max, vaccine.id), 0) + 1;
		const updatedVaccine = { ...newVaccine, id: newId };
		const vaccineRef = await createObject('vaccinations', updatedVaccine);
		const newVaccineWithId = { ...updatedVaccine, docId: vaccineRef.id };
		setCat(prevCat => ({ ...prevCat, vaccinations: [...prevCat.vaccinations, newVaccineWithId] }));
		setNewVaccine({
			id: 0,
			name: "",
			description: "",
			completed: false,
			dosesTaken: 0,
			datesTaken: [],
			dosesRemaining: 0,
			futureDates: []
		});
	};

	const handleSelectParentToUpdate = (parent) => {
		setSelectedParent(parent);
		setShowParentSelection(true);
	};
	
	const handleReplaceParent = (selectedCat) => {
		const updatedCat = { ...cat, [selectedParent]: selectedCat };
		setCat(updatedCat);
		setShowParentSelection(false);
	};
	
	const handleRemoveChild = (childToRemove) => {
		const updatedChildren = cat.children.filter(child => child.docId !== childToRemove.docId);
		setCat(prevCat => ({ ...prevCat, children: updatedChildren }));
	};

	const handleAddChild = () => {
		setShowChildSelection(true);
	};
	
	const handleSelectChild = (selectedCat) => {
		setShowChildSelection(false);
		const updatedChildren = [...cat.children, selectedCat];
		setCat((prevCat) => ({ ...prevCat, children: updatedChildren }));
	}

	const handleImageSelected = async (files) => {
		const carouselImages = await Promise.all(Array.from(files).map(async (file) => {
			const imgRef = ref(imageDb, `carouselImages/${v4()}`);
			const snapshot = await uploadBytes(imgRef, file);
			const url = await getDownloadURL(snapshot.ref);
			return { 
				storagePath: snapshot.metadata.fullPath,
				url: url
			};
		}));
		setCat((prevCat) => ({ ...prevCat, carouselImages }));
	};

	const handleSubmit = async () => {
		const newId = cats.reduce((max, cat) => Math.max(max, cat.id), 0) + 1;
		let motherRef = null;
		let fatherRef = null;
		let conditionRefs = [];
		let vaccinationRefs = [];
		let childrenRefs = [];
		

		cat.conditions.map(async (condition) => {
			await updateObject('conditions', condition, false)
		})
		cat.vaccinations.map(async (vaccination) => {
			await updateObject('vaccinations', vaccination, false)
		})
		const ownerRef = doc(db, 'users', filteredUser.docId);
		if (cat.mother !== "") {
			motherRef = doc(db, 'cats', cat.mother.docId)
		}
		if (cat.father !== "") {
			fatherRef = doc(db, 'cats', cat.father.docId)
		}
		if (cat.conditions.length > 0) {
			conditionRefs = cat.conditions.map(condition => doc(db, 'conditions', condition.docId));
		}
		if (cat.vaccinations.length > 0) {
			vaccinationRefs = cat.vaccinations.map(vaccination => doc(db, 'vaccinations', vaccination.docId));
		}
		if (cat.children.length > 0) {
			childrenRefs = cat.children.map(child => doc(db, 'cats', child.docId));
		}

		let thumbnailUrl = null;
    	const fileInput = document.querySelector('input[type="file"]');
    	const imgFile = fileInput.files[0];
    	if (imgFile) {
        	const imgRef = ref(imageDb, `images/${v4()}`);
        	const snapshot = await uploadBytes(imgRef, imgFile);
        	thumbnailUrl = await getDownloadURL(snapshot.ref);
    	}
		const imgRef = ref(imageDb, `images/${v4()}`);
		const snapshot = await uploadBytes(imgRef, imgFile);
		const url = await getDownloadURL(snapshot.ref);

		const newCat = {
			...cat, 
			id: newId, 
			conditions: conditionRefs, 
			vaccinations: vaccinationRefs, 
			owner: ownerRef, 
			mother: motherRef, 
			father: fatherRef, 
			children: childrenRefs, 
			carouselImages: cat.carouselImages || [] // Add the carouselImages array to the newCat object
		};
		if (thumbnailUrl) {
			newCat.thumbnail = thumbnailUrl;
		}
		console.log(newCat);
		await createObject('cats', newCat);
	}

	return(
		<main className="bg-white min-h-screen text-black p-4">
			{filteredUser ? (
				<div>
					<h1 className="text-3xl font-bold mb-4 text-center">Add Cat</h1>
					<div className="flex flex-col mb-4 border border-black-300 rounded-md p-2 max-w-md">
						<input
							type="text"
							name="name"
							placeholder="Name"
							value={cat.name}
							onChange={handleChange}
							className="border border-gray-300 rounded-md p-2 mb-2"
						/>
						<input
							type="text"
							name="breed"
							placeholder="Breed"
							value={cat.breed}
							onChange={handleChange}
							className="border border-gray-300 rounded-md p-2 mb-2"
						/>
						<input
							type="text"
							name="gender"
							placeholder="Gender"
							value={cat.gender}
							onChange={handleChange}
							className="border border-gray-300 rounded-md p-2 mb-2"
						/>
						<input
							type="date"
							name="birthdate"
							value={cat.birthdate ? new Date(cat.birthdate.toDate()).toISOString().split('T')[0] : ""}
							onChange={handleDateChange}
							className="border border-gray-300 rounded-md p-2 mb-2"
						/>
						<input
							type="text"
							name="color"
							placeholder="Color"
							value={cat.color}
							onChange={handleChange}
							className="border border-gray-300 rounded-md p-2 mb-2"
						/>
						<input
							type="text"
							name="eye_color"
							placeholder="Eye Color"
							value={cat.eye_color}
							onChange={handleChange}
							className="border border-gray-300 rounded-md p-2 mb-2"
						/>
						<input
							type="text"
							name="description"
							placeholder="Description"
							value={cat.description}
							onChange={handleChange}
							className="border border-gray-300 rounded-md p-2 mb-2"
						/>
					</div>
					<div>
						<h2 className="text-xl font-bold mb-4">Images</h2>
						<ImageUploader onImageSelected={handleImageSelected} inputKey={inputKey} />
					</div>
					<div>
						<h2 className="text-xl font-bold mb-4">Conditions</h2>
						<div className="flex flex-wrap">
							{cat.conditions ? (
								cat.conditions.map((condition) => (
									<EditCondition key={condition.id} condition={condition} handleConditionChange={handleConditionChange} handleTreatedChange={handleTreatedChange} handleRemoveCondition={handleRemoveCondition}/>
								)
							)) : (<h2>None</h2>)}
							<div className="flex flex-col mb-4 border border-black-300 rounded-md p-2">
								{selectedCondition ? (
									<>
										<select
											onChange={(e) => handleSelectCondition(e)}
											className="border border-gray-300 rounded-md p-2 mb-2"
										>
											<option value="">Select a condition</option>
											{conditions.map((condition) => (
												<option key={condition.id} value={condition.id}>{condition.name}</option>
											))}
										</select>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedCondition.description}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedCondition.treatment}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedCondition.treated ? "Finished" : "In Progress"}</h3>
									</>
								) : (
									<select
										onChange={(e) => handleSelectCondition(e)}
										className="border border-gray-300 rounded-md p-2 mb-2"
									>
										<option value="">Select a condition</option>
										{conditions.map((condition) => (
											<option key={condition.id} value={condition.id}>{condition.name}</option>
										))}
									</select>
								)}
								<button onClick={handleAddSelectedCondition} className="bg-slate-200 border border-gray-300 rounded-md p-2 mb-2">Select Condition</button>
							</div>
							<AddCondition newCondition={newCondition} handleConditionChange={handleConditionChange} handleTreatedChange={handleTreatedChange} handleAddCondition={handleAddCondition}/>
						</div>
						<div>
							<h2 className="text-xl font-bold mb-4">Vaccinations</h2>
							<div className="flex flex-wrap">
								{cat.vaccinations ? (
									cat.vaccinations.map((vaccination) => (
										<EditVaccination vaccination={vaccination} newDate={newDate} setNewDate={setNewDate} handleVaccinationChange={handleVaccinationChange} handleStatusChange={handleStatusChange} handleVaccinationDateChange={handleVaccinationDateChange} handleRemoveDate={handleRemoveDate} handleAddDate={handleAddDate} handleRemoveVaccination={handleRemoveVaccination} showTakenDateSelection={showTakenDateSelection} setShowTakenDateSelection={setShowTakenDateSelection} showPlannedDateSelection={showPlannedDateSelection} setShowPlannedDateSelection={setShowPlannedDateSelection}/>
									)
								)) : (<h2>None</h2>)}
								<div className="flex flex-col mb-4 border border-black-300 rounded-md p-2">
									{selectedVaccine ? (
									<>
										<select
											onChange={(e) => handleSelectVaccine(e)}
											className="border border-gray-300 rounded-md p-2 mb-2"
										>
											<option value="">Select a vaccine</option>
											{vaccinations.map((vaccine) => (
												<option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
											))}
										</select>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedVaccine.description}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedVaccine.completed ? "Finished" : "In Progress"}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedVaccine.dosesTaken}</h3>
									</>
									) : (
									<select
										onChange={(e) => handleSelectVaccine(e)}
										className="border border-gray-300 rounded-md p-2 mb-2"
									>
										<option value="">Select a vaccine</option>
										{vaccinations.map((vaccine) => (
										<option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
										))}
									</select>
									)}
									<button onClick={handleAddSelectedVaccine} className="bg-slate-200 border border-gray-300 rounded-md p-2 mb-2">Select Vaccine</button>
								</div>
								<AddVaccination newVaccine={newVaccine} newDate={newDate} setNewDate={setNewDate} showTakenDateSelection={showTakenDateSelection} setShowTakenDateSelection={setShowTakenDateSelection} showPlannedDateSelection={showPlannedDateSelection} setShowPlannedDateSelection={setShowPlannedDateSelection} handleVaccinationChange={handleVaccinationChange} handleVaccinationDateChange={handleVaccinationDateChange} handleRemoveDate={handleRemoveDate} handleAddDate={handleAddDate} handleAddVaccine={handleAddVaccine}/>
							</div>
						</div>
						<div>
							<h2 className="text-xl font-bold mb-4 dark:text-dark-header-text-0">Parents</h2>
							<div className="flex flex-wrap">
								{cat.mother ? (
									<div className="border border-gray-300 p-5 mb-2 rounded-lg text-center">
										{cat.mother.name}
										<Image
											src={cat.mother.thumbnail || "/img/Placeholder.png"}
											alt="Cat"
											width={200}
											height={100}
											className="border-2 border-black m-5"
										/>
										<h2 className="font-normal">Mother</h2>
										<button onClick={() => handleSelectParentToUpdate('mother')} className="bg-slate-200 py-2 px-4 rounded mt-4">Replace Mother</button>
									</div>
								) : (<button onClick={() => handleSelectParentToUpdate('mother')}>Add Mother</button>)}
								{cat.father ? (
									<div className="border border-gray-300 p-5 mb-2 rounded-lg text-center">
										{cat.father.name}
										<Image
											src={cat.father.thumbnail || "/img/Placeholder.png"}
											alt="Cat"
											width={200}
											height={100}
											className="border-2 border-black m-5"
										/>
										<h2 className="font-normal">Father</h2>
										<button onClick={() => handleSelectParentToUpdate('father')} className="bg-slate-200 py-2 px-4 rounded mt-4">Replace Father</button>
									</div>
								) : (<button onClick={() => handleSelectParentToUpdate('father')}>Add Father</button>)}
							</div>
							<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
						</div>
						<div>
							<h2 className="text-xl font-bold mb-4 dark:text-dark-header-text-0">Children</h2>
							<div className="flex flex-wrap">
								{cat.children ? (
									cat.children.map((child) =>(
										<div className="border border-gray-300 p-5 rounded-lg text-center">
											{child.name}
											<Image
												src={cat.children.thumbnail || "/img/Placeholder.png"}
												alt="Cat"
												width={200}
												height={100}
												className="border-2 border-black m-5"
											/>
											<button onClick={() => handleRemoveChild(child)} className="bg-slate-200 py-2 px-4 rounded mt-4">Remove {child.name}</button>
										</div>
									))
								) : (<></>)}
								<div className="border border-gray-300 p-5 rounded-lg text-center">
									<Image
										src="/img/Placeholder.png"
										alt="Cat"
										width={200}
										height={100}
										className="border-2 border-black m-5"
									/>
									<button onClick={() => handleAddChild()} className="bg-slate-200 py-2 px-4 rounded mt-4">Select Child</button>
								</div>
							</div>
							<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
						</div>
						<button onClick={handleSubmit} className="bg-slate-200 py-2 px-4 rounded mt-4">Submit</button>
					</div>
				</div>
			) : (<h1>You must be logged in to add a cat</h1>)}
		</main>
	)
}