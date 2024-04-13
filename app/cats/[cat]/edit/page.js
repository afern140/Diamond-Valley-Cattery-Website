"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, Timestamp } from "firebase/firestore"
import { db, strg } from "@/app/_utils/firebase"
import { useUserAuth } from "@/app/_utils/auth-context"
import { getObject, getObjects, createObject, updateObject } from "@/app/_utils/firebase_services"
import EditCondition from "@/app/components/conditions/edit-condition"
import AddCondition from "@/app/components/conditions/add-condition"
import EditVaccination from "@/app/components/vaccinations/edit-vaccination"
import AddVaccination from "@/app/components/vaccinations/add-vaccination"
import CatSelection from "@/app/components/cats/cat-selection"
import EditThumbnail from "@/app/components/images/edit-thumbnail"
import EditCarousel from "@/app/components/images/edit-carousel"
import CatButton from "@/app/components/cats/cat-button"
import AddCatButton from "@/app/components/cats/add-cat-button"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({params}){
	const { user, dbUser } = useUserAuth();
	const [cat, setCat] = useState();
	const [cats, setCats] = useState([]);
	const [conditions, setConditions] = useState([]);
	const [vaccinations, setVaccinations] = useState([]);
	const [thumbnail, setThumbnail] = useState();
	const [carouselImages, setCarouselImages] = useState([]);
	const [selectedCondition, setSelectedCondition] = useState();
	const [selectedVaccine, setSelectedVaccine] = useState();
	const [selectedParent, setSelectedParent] = useState();
	const [showParentSelection, setShowParentSelection] = useState(false);
	const [showChildSelection, setShowChildSelection] = useState(false);
	const [showTakenDateSelection, setShowTakenDateSelection] = useState(false);
	const [showPlannedDateSelection, setShowPlannedDateSelection] = useState(false);
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
	//Gender to display in the cat selection
	const [selectorGender, setSelectorGender] = useState("");
	const [selectorFilter, setSelectorFilter] = useState([]);

	useEffect(() => {
		const fetchCat = async () => {
			const cat = await getObject('cats', parseInt(params.cat));
			if (cat.mother) {
				const motherDoc = await getDoc(cat.mother);
				cat.mother = { docId: cat.mother.id, ...motherDoc.data()};
			}
			if (cat.father) {
				const fatherDoc = await getDoc(cat.father);
				cat.father = { docId: cat.father.id, ...fatherDoc.data()};
			}
			if (cat.owner) {
				const ownerDoc = await getDoc(cat.owner);
				cat.owner = { docId: cat.owner.id, ...ownerDoc.data()};
			}
			if (cat.children) {
				const childrenData = await Promise.all(cat.children.map(async (childRef) => {
					const childDoc = await getDoc(childRef);
					return { docId: childRef.id, ...childDoc.data()};
				}));
				cat.children = childrenData;
			}
			if (cat.conditions) {
				const conditionsData = await Promise.all(cat.conditions.map(async (conditionRef) => {
					const conditionDoc = await getDoc(conditionRef);
					return { docId: conditionRef.id, ...conditionDoc.data()};
				}));
				cat.conditions = conditionsData;
			}
			if (cat.vaccinations) {
				const vaccinationsData = await Promise.all(cat.vaccinations.map(async (vaccinationRef) => {
					const vaccinationDoc = await getDoc(vaccinationRef);
					return { docId: vaccinationRef.id, ...vaccinationDoc.data()};
				}));
				cat.vaccinations = vaccinationsData;
			}
			if (cat.thumbnail) {
				setThumbnail(cat.thumbnail)
			}
			setCat(cat);
		};
		fetchCat();
	}, [params]);

	useEffect(() => {
		const fetchCats = async () => {
			const cats = await getObjects('cats');
			setCats(cats);
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
		const ownerRef = doc(db, 'users', cat.owner.docId);
		const updatedCondition = { ...newCondition, id: newId, owner: ownerRef };
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
		const ownerRef = doc(db, 'users', cat.owner.docId);
		const updatedVaccine = { ...newVaccine, id: newId, owner: ownerRef };
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

	//Fills filter with current cat, cat's children, and cat's parents
	useEffect(() => {
		const filter = [];
		if (cat) {
			filter.push(cat.id);
			cat.children.forEach(child => filter.push(child.id));
			if (cat.mother)
				filter.push(cat.mother.id);
			if (cat.father)
				filter.push(cat.father.id);
		}
		console.log("New selector filter:")
		console.log(filter)
		setSelectorFilter(filter);
	}, [cat]);

	const handleSelectParentToUpdate = (parent) => {
		setSelectorGender(parent === "mother" ? "Female" : "Male")
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
		setSelectorGender("");
		setShowChildSelection(true);
	};
	
	const handleSelectChild = (selectedCat) => {
		setShowChildSelection(false);
		const updatedChildren = [...cat.children, selectedCat];
		setCat((prevCat) => ({ ...prevCat, children: updatedChildren }));
	}

	const handleThumbnailChange = async (e) => {
		const file = e.target.files[0];
		const thumbnailRef = ref(strg, `thumbnails/cats/${cat.id}`);
		await uploadBytes(thumbnailRef, file);
		const thumbnailUrl = await getDownloadURL(thumbnailRef);
		setThumbnail(thumbnailUrl);
		setCat((prevCat) => ({ ...prevCat, thumbnail: thumbnailUrl }));
	};

	const handleCarouselAdd = async (e) => {
		const newId = cat.carouselImages.length;
		const file = e.target.files[0];
		const carouselRef = ref(strg, `carousel-images/cats/${cat.id}/${newId}`);
		await uploadBytes(carouselRef, file);
		const carouselUrl = await getDownloadURL(carouselRef);
		setCarouselImages({ ...carouselImages, carouselUrl });
		setCat((prevCat) => ({ ...prevCat, carouselImages: [ ...prevCat.carouselImages, carouselUrl ] }));
	}

	const handleCarouselDelete = async (index) => {
		//Deleting an Image doesn't properly remove the link to the image from the array
		const updatedCarouselImages = cat.carouselImages.filter((image, i) => i !== index);
		const imageRef = ref(strg, `carousel-images/cats/${cat.id}/${index}`);
		await deleteObject(imageRef);
		setCat((prevCat) => ({ ...prevCat, carouselImages: updatedCarouselImages }));
	}

	const handleSubmit = async () => {
		await cat.conditions.map(async (condition) => {
			await updateObject('conditions', condition, false)
		});
		await cat.vaccinations.map(async (vaccination) => {
			await updateObject('vaccinations', vaccination, false)
		});
		let ownerRef = null;
		if (cat.owner)
			ownerRef = doc(db, 'users', cat.owner.docId);
		let motherRef = null;
		if (cat.mother)
			motherRef = doc(db, 'cats', cat.mother.docId);
		let fatherRef = null;
		if (cat.father)
			fatherRef = doc(db, 'cats', cat.father.docId);
		const conditionRefs = cat.conditions.map(condition => doc(db, 'conditions', condition.docId));
		const vaccinationRefs = cat.vaccinations.map(vaccination => doc(db, 'vaccinations', vaccination.docId));
		const childrenRefs = cat.children.map(child => doc(db, 'cats', child.docId));
		const updatedCat =  { ...cat, conditions: conditionRefs, vaccinations: vaccinationRefs, owner: ownerRef, mother: motherRef, father: fatherRef, children: childrenRefs  }
		await updateObject('cats', updatedCat, true);
		window.location.href = `/cats/${cat.id}`;
	};

	//Changes the page title when the cat is loaded
	useEffect(() => {
		if (cat) 
			document.title = "Diamond Valley Cattery - Editing " + cat.name;
		else
			document.title = "Diamond Valley Cattery - Editing";
	}, [cat]);

	return(
		<main className=" min-h-screen relative text-[#092C48] pb-16">
			{dbUser ? (
				<>
				{cat && cat.owner.uid == dbUser.uid ? (
					<>
					<BackgroundUnderlay />
					<div className="w-4/5 mx-auto pb-16">
						<div className="pt-20 flex pb-10">
							<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
								<span className="text-6xl pb-10 font-extrabold">Edit {cat.name}</span> <br />
							</div>
						</div>
						<div className="mx-auto">
							<div className="bg-white dark:bg-gray-500 p-10 rounded-xl drop-shadow-lg flex flex-col xl:flex-row justify-between">
								<div className="mx-auto">
									<EditThumbnail handleThumbnailChange={handleThumbnailChange} thumbnail={thumbnail}/>
								</div>
								<div className="flex flex-col w-[400px] mx-auto mt-6 xl:mt-0 space-y-2 bg-navbar-body-1 dark:bg-gray-300  p-4 rounded-xl drop-shadow-lg">
									<h2 className="text-xl text-center mb-2">Details</h2>
									<div className="grid grid-cols-3">
										<div className="col-span-1 text-end pr-2 space-y-3">
											<p className="h-7 mt-1 my-auto">Name:</p>
											<p className="h-7 mt-1 my-auto">Breed:</p>
											<p className="h-7 mt-1 my-auto">Gender:</p>
											<p className="h-7 mt-1 my-auto">Birthdate:</p>
											<p className="h-7 mt-1 my-auto">Color:</p>
											<p className="h-7 mt-1 my-auto">Eye Color:</p>
										</div>
										<div className="col-span-2 space-y-2">
											<input
												type="text"
												name="name"
												placeholder="Name"
												value={cat.name}
												onChange={handleChange}
												className="p-1 rounded-md pl-2 bg-white drop-shadow-lg"
											/>
											<input
												type="text"
												name="breed"
												placeholder="Breed"
												value={cat.breed}
												onChange={handleChange}
												className="p-1 rounded-md pl-2 bg-white drop-shadow-lg"
											/>
											<div>
												<select
													name="gender"
													value={cat.gender}
													onChange={handleChange}
													className="p-1 rounded-md pl-2 bg-white drop-shadow-lg">
													<option value="Male">Male</option>
													<option value="Female">Female</option>
												</select>
											</div>
											<input
												type="date"
												name="birthdate"
												value={cat.birthdate ? new Date(cat.birthdate.toDate()).toISOString().split('T')[0] : ""}
												onChange={handleDateChange}
												className="p-1 rounded-md pl-2 bg-white drop-shadow-lg"
											/>
											<input
												type="text"
												name="color"
												placeholder="Color"
												value={cat.color}
												onChange={handleChange}
												className="p-1 rounded-md pl-2 bg-white drop-shadow-lg"
											/>
											<input
												type="text"
												name="eye_color"
												placeholder="Eye Color"
												value={cat.eye_color}
												onChange={handleChange}
												className="p-1 rounded-md pl-2 bg-white drop-shadow-lg"
											/>
										</div>
									</div>
								</div>
								<div className="flex flex-col xl:w-1/3 w-[300px] h-fit mx-auto mt-6 xl:mt-0 space-y-2 bg-navbar-body-1 dark:bg-gray-300  p-4 rounded-xl drop-shadow-lg">
									<h2 className="text-xl text-center mb-2">Description</h2>
									<textarea
										type="text"
										name="description"
										placeholder="Description"
										value={cat.description}
										onChange={handleChange}
										className="p-1 rounded-md pl-2 min-h-[200px] bg-white drop-shadow-lg"
									/>
								</div>
							</div>
						</div>
						<div className="mt-10 bg-white dark:text-dark-header-text-0 dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg h-[420px]">
							<div className="h-[300px]">
								<h2 className="text-xl font-bold mb-4">Images</h2>
								<EditCarousel object={cat} handleCarouselAdd={handleCarouselAdd} handleCarouselDelete={handleCarouselDelete}/>
							</div>
						</div>
						{/* Conditions & Vaccinations */}
						<div className=" w-4/5 mx-auto">

							{/* Conditions */}
							<h2 className="text-2xl font-bold mb-4 mt-10 px-10 text-center dark:text-dark-header-text-0">Conditions</h2>
							<div className="flex w-fit p-10 mt-6 m-auto justify-evenly rounded-lg min-w-64 bg-white dark:bg-gray-500  drop-shadow-lg">
								<div className={"flex flex-wrap overflow-y-auto " + (cat.conditions && cat.conditions.length > 0 ? " h-[280px]" : " h-fit")}>
									{cat.conditions ? (
										cat.conditions.map((condition) => (
											<EditCondition key={condition.id} condition={condition} handleConditionChange={handleConditionChange} handleTreatedChange={handleTreatedChange} handleRemoveCondition={handleRemoveCondition}/>
										)
									)) : (<h2 className="italic text-gray-500">None</h2>)}
									<div className="flex flex-col mb-4 drop-shadow-lg bg-navbar-body-1 dark:bg-gray-300 border-2 border-dashed border-gray-300 m-2 rounded-xl p-2">
										{selectedCondition ? (
											<div>
												<select
													onChange={(e) => handleSelectCondition(e)}
													className=" bg-white drop-shadow-lg rounded-md p-2 mb-2"
												>
													<option value="">Select a condition</option>
													{conditions.map((condition) => (
														<option key={condition.id} value={condition.id}>{condition.name}</option>
													))}
												</select>
												<h3 className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">{selectedCondition.description}</h3>
												<h3 className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">{selectedCondition.treatment}</h3>
												<h3 className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">{selectedCondition.treated ? "Finished" : "In Progress"}</h3>
											</div>
										) : (
											<select
												onChange={(e) => handleSelectCondition(e)}
												className=" bg-white drop-shadow-lg rounded-md p-2 mb-2"
											>
												<option value="">Select a condition</option>
												{conditions.map((condition) => (
													<option key={condition.id} value={condition.id}>{condition.name}</option>
												))}
											</select>
										)}
										<button onClick={handleAddSelectedCondition} className="  bg-white drop-shadow-lg rounded-md p-2 mb-2">Select Condition</button>
									</div>
									<AddCondition newCondition={newCondition} handleConditionChange={handleConditionChange} handleTreatedChange={handleTreatedChange} handleAddCondition={handleAddCondition}/>
								</div>
							</div>
									
							{/* Vaccinations */}
							<h2 className="text-2xl font-bold mb-4 mt-10 px-10 text-center dark:text-dark-header-text-0">Vaccinations</h2>
							<div className="flex w-fit p-10 mt-6 m-auto justify-evenly rounded-lg min-w-64 bg-white dark:bg-gray-500  drop-shadow-lg">
								<div>
									<div className={"flex flex-wrap overflow-y-auto " + (cat.vaccinations && cat.vaccinations.length > 0 ? " h-[820px]" : " h-fit")}>
										{cat.vaccinations ? (
											cat.vaccinations.map((vaccination) => (
												<EditVaccination vaccination={vaccination} newDate={newDate} setNewDate={setNewDate} handleVaccinationChange={handleVaccinationChange} handleStatusChange={handleStatusChange} handleVaccinationDateChange={handleVaccinationDateChange} handleRemoveDate={handleRemoveDate} handleAddDate={handleAddDate} handleRemoveVaccination={handleRemoveVaccination} showTakenDateSelection={showTakenDateSelection} setShowTakenDateSelection={setShowTakenDateSelection} showPlannedDateSelection={showPlannedDateSelection} setShowPlannedDateSelection={setShowPlannedDateSelection}/>
											)
										)) : (<h2>None</h2>)}
										<div className="flex flex-col mb-4 bg-navbar-body-1 dark:bg-gray-300 m-2 drop-shadow-lg rounded-md border-2 border-dashed border-gray-300 p-2 w-[320px] h-fit">
											{selectedVaccine ? (
											<div>
												<h2 className="text-center font-bold mb-4">Select a vaccine to add</h2>
												<select
													onChange={(e) => handleSelectVaccine(e)}
													className=" bg-white drop-shadow-lg rounded-md p-2 mb-2"
												>
													<option value="">Select a vaccine</option>
													{vaccinations.map((vaccine) => (
														<option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
													))}
												</select>
												<h3 className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">{selectedVaccine.description}</h3>
												<h3 className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">{selectedVaccine.completed ? "Finished" : "In Progress"}</h3>
												<h3 className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">{selectedVaccine.dosesTaken}</h3>
											</div>
											) : (
											<select
												onChange={(e) => handleSelectVaccine(e)}
												className=" bg-white drop-shadow-lg rounded-md p-2 mb-2"
											>
												<option value="">Select a vaccine</option>
												{vaccinations.map((vaccine) => (
												<option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
												))}
											</select>
											)}
											<button onClick={handleAddSelectedVaccine} className="  bg-white drop-shadow-lg rounded-md p-2 mb-2">Select Vaccine</button>
										</div>
										<AddVaccination newVaccine={newVaccine} newDate={newDate} setNewDate={setNewDate} showTakenDateSelection={showTakenDateSelection} setShowTakenDateSelection={setShowTakenDateSelection} showPlannedDateSelection={showPlannedDateSelection} setShowPlannedDateSelection={setShowPlannedDateSelection} handleVaccinationChange={handleVaccinationChange} handleVaccinationDateChange={handleVaccinationDateChange} handleRemoveDate={handleRemoveDate} handleAddDate={handleAddDate} handleAddVaccine={handleAddVaccine}/>
									</div>
								</div>
							</div>
						</div>

						{/* Parents */}
						<div className=" w-4/5 mx-auto mt-6 bg-white dark:bg-gray-500  p-10 rounded-xl drop-shadow-lg">
							<h2 className="text-xl font-bold mb-4 mt-6 dark:text-dark-header-text-0">Parents</h2>
							<div className="flex space-x-10 mt-6 flex-wrap">
								{/* Mother */}
								{cat.mother ? (
									<div className=" flex justify-center flex-col font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
										<h2 className="font-normal">Mother</h2>
										<CatButton cat={cat.mother} />
										<button onClick={() => handleSelectParentToUpdate('mother')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Replace Mother</button>
									</div>
								) : (
									<div className=" flex justify-center flex-col m-2 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
										<AddCatButton/>
										<button onClick={() => handleSelectParentToUpdate('mother')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Add Mother</button>
									</div>
								)}

								{/* Father */}
								{cat.father ? (
									<div className=" flex justify-center flex-col font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
										<h2 className="font-normal">Father</h2>
										<CatButton cat={cat.father} />
										<button onClick={() => handleSelectParentToUpdate('father')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Replace Father</button>
									</div>
								) : (
								<div className=" flex justify-center flex-col m-2 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
									<AddCatButton/>
									<button onClick={() => handleSelectParentToUpdate('father')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Add Father</button>
								</div>)}
							</div>
							<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent} gender={selectorGender} filtered={selectorFilter}/>
						</div>

						{/* Children */}
						<div className=" w-4/5 mx-auto mt-6 p-10 bg-white dark:bg-gray-500  rounded-xl drop-shadow-lg">
							<h2 className="text-xl font-bold mb-4 dark:text-dark-header-text-0">Children</h2>
							<div className="flex flex-wrap">
								{cat.children ? (
									cat.children.map((child) =>(
										<div className=" flex justify-center flex-col m-2 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
											<CatButton cat={child} />
											<button onClick={() => handleRemoveChild(child)} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Remove {child.name}</button>
										</div>
									))
								) : (<></>)}
								<div className=" flex justify-center flex-col m-2 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
									<AddCatButton/>
									<button onClick={() => handleAddChild()} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Select Child</button>
								</div>
							</div>
							<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild} filtered={selectorFilter}/>
						</div>
						<button onClick={handleSubmit} className="flex m-auto px-6 py-4 drop-shadow-lg bg-navbar-body-0 dark:bg-gray-600 rounded-xl mt-16 text-2xl hover:scale-105 text-white transition duration-300">Submit</button>
					</div>
					</>
				) : <h1>You cannot edit a cat you don't own</h1>}
				</>
			) : (<h1>You must be logged in to edit a cat</h1>)}
		</main>
	);
};