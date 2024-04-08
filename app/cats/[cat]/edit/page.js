"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { doc, getDoc, Timestamp } from "firebase/firestore"
import { db } from "@/app/_utils/firebase"
import { useUserAuth } from "@/app/_utils/auth-context"
import { getObject, getObjects, createObject, updateObject } from "@/app/_utils/firebase_services"
import { getUser } from "@/app/_utils/user_services"
import EditCondition from "@/app/components/conditions/edit-condition"
import AddCondition from "@/app/components/conditions/add-condition"
import EditVaccination from "@/app/components/vaccinations/edit-vaccination"
import AddVaccination from "@/app/components/vaccinations/add-vaccination"
import CatSelection from "@/app/components/cats/cat-selection"

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({params}){
	const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [cat, setCat] = useState();
	const [cats, setCats] = useState();
	const [conditions, setConditions] = useState();
	const [vaccinations, setVaccinations] = useState();
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
			setCat(cat);
		};
		fetchCat();
	}, [params]);

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

	const handleSubmit = async () => {
		await cat.conditions.map(async (condition) => {
			await updateObject('conditions', condition, false)
		})
		await cat.vaccinations.map(async (vaccination) => {
			await updateObject('vaccinations', vaccination, false)
		})
		const ownerRef = doc(db, 'users', cat.owner.docId);
		const motherRef = doc(db, 'cats', cat.mother.docId);
		const fatherRef = doc(db, 'cats', cat.father.docId);
		const conditionRefs = cat.conditions.map(condition => doc(db, 'conditions', condition.docId));
		const vaccinationRefs = cat.vaccinations.map(vaccination => doc(db, 'vaccinations', vaccination.docId));
		const childrenRefs = cat.children.map(child => doc(db, 'cats', child.docId));
		const updatedCat = { ...cat, conditions: conditionRefs, vaccinations: vaccinationRefs, owner: ownerRef, mother: motherRef, father: fatherRef, children: childrenRefs }
		await updateObject('cats', updatedCat, true);
	}

	//Changes the page title when the cat is loaded
	useEffect(() => {
		if (cat) 
			document.title = "Diamond Valley Cattery - Editing " + cat.name;
		else
			document.title = "Diamond Valley Cattery - Editing";
	}, [cat]);

	return(
		<main className=" min-h-screen relative text-[#092C48] pb-16">
			<BackgroundUnderlay />
			{cat ? (
				<div className="">
					<div className="pt-20 flex pb-10">
						<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
							<span className="text-6xl pb-10 font-extrabold">Edit {cat.name}</span> <br />
						</div>
					</div>

					<div className="flex w-4/5 p-10 mt-6 m-auto justify-evenly rounded-lg min-w-64 bg-white drop-shadow-lg">
						<div className="w-full flex-col space-y-2">
							<h2 className="text-2xl mb-2">Details</h2>
							<div className="flex space-x-3">
								<h3 className="my-auto">Name: </h3>
								<input
								className="p-1 rounded-xl pl-2 bg-[#e5e5ff] drop-shadow-lg"
								type="text"
								name="name"
								placeholder={cat.name}
								value={cat.name}
								onChange={handleChange}
							/>
							</div>
							<div className="flex space-x-3">
								<h3 className="my-auto">Breed: </h3>
								<input
								className="p-1 rounded-xl pl-2 bg-[#e5e5ff] drop-shadow-lg"
								type="text"
								name="breed"
								placeholder={cat.breed}
								value={cat.breed}
								onChange={handleChange}
								/>
							</div>
							<div className="flex space-x-3">
								<h3 className="my-auto">Gender: </h3>
								<input
								className="p-1 rounded-xl pl-2 bg-[#e5e5ff] drop-shadow-lg"
								type="text"
								name="gender"
								placeholder={cat.gender}
								value={cat.gender}
								onChange={handleChange}
								/>
							</div>
							<div className="flex space-x-3">
								<h3 className="my-auto">Age: </h3>
								<input
								className="p-1 rounded-xl pl-2 bg-[#e5e5ff] drop-shadow-lg"
								type="number"
								name="age"
								placeholder={cat.age}
								value={cat.age}
								onChange={handleChange}
								/>
							</div>
							<div className="flex space-x-3">
								<h3 className="my-auto">Color: </h3>
								<input
								className="p-1 rounded-xl pl-2 bg-[#e5e5ff] drop-shadow-lg"
								type="text"
								name="color"
								placeholder={cat.color}
								value={cat.color}
								onChange={handleChange}
								/>
							</div>
							<div className="flex space-x-3">
								<h3 className="my-auto">Eye Color: </h3>
								<input
								className="p-1 rounded-xl pl-2 bg-[#e5e5ff] drop-shadow-lg"
								type="text"
								name="eye_color"
								placeholder={cat.eye_color}
								value={cat.eye_color}
								onChange={handleChange}
								/>
							</div>
						</div>
						<div className="bg-[#092C48] w-4 h-4/5 rounded-full relative" />
						<div className="size-full">	
							<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
							<div className="size-full">
								<textarea
									className="p-1 rounded-xl pl-2 size-full bg-[#e5e5ff] drop-shadow-lg"
									type="text"
									name="description"
									placeholder={cat.description}
									value={cat.description}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
					
					<div className="">
						<h2 className="text-xl font-bold mb-4 mt-6 px-10 text-center">Conditions</h2>
						<div className="flex w-fit p-10 mt-6 m-auto justify-evenly rounded-lg min-w-64 bg-white drop-shadow-lg">
							<div className="flex flex-wrap space-x-6">
								{cat.conditions ? (
									cat.conditions.map((condition) => (
										<EditCondition key={condition.id} condition={condition} handleConditionChange={handleConditionChange} handleTreatedChange={handleTreatedChange} handleRemoveCondition={handleRemoveCondition}/>
									)
								)) : (<h2>None</h2>)}
								<div className="flex flex-col mb-4 drop-shadow-lg bg-white rounded-xl p-2">
									{selectedCondition ? (
										<>
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
										</>
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

						<h2 className="text-xl font-bold mb-4 mt-6 px-10 text-center">Vaccinations</h2>
						<div className="flex w-fit p-10 mt-6 m-auto justify-evenly rounded-lg min-w-64 bg-white drop-shadow-lg">
							<div>
								<div className="flex flex-wrap space-x-6">
									{cat.vaccinations ? (
										cat.vaccinations.map((vaccination) => (
											<EditVaccination vaccination={vaccination} newDate={newDate} setNewDate={setNewDate} handleVaccinationChange={handleVaccinationChange} handleStatusChange={handleStatusChange} handleVaccinationDateChange={handleVaccinationDateChange} handleRemoveDate={handleRemoveDate} handleAddDate={handleAddDate} handleRemoveVaccination={handleRemoveVaccination} showTakenDateSelection={showTakenDateSelection} setShowTakenDateSelection={setShowTakenDateSelection} showPlannedDateSelection={showPlannedDateSelection} setShowPlannedDateSelection={setShowPlannedDateSelection}/>
										)
									)) : (<h2>None</h2>)}
									<div className="flex flex-col mb-4 bg-white drop-shadow-lg rounded-md p-2">
										{selectedVaccine ? (
										<>
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
										</>
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

					<div>
						<h2 className="text-xl font-bold mb-4 mt-6 px-10">Parents</h2>
						<div className="flex px-10 space-x-10 mt-6 flex-wrap">
							{cat.father ? (
								<div className=" flex justify-center flex-col font-bold p-4 bg-[#e5e5ff] drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
									{cat.father.name}
									<Image
										src="/img/Placeholder.png"
										alt="Cat"
										width={300}
										height={300}
										className="justify-center align-center place-items-center"
										objectFit="contain"
									/>
									<h2 className="font-normal">Father</h2>
									<button onClick={() => handleSelectParentToUpdate('father')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Replace Father</button>
								</div>
							) : (<></>)}
							{cat.mother ? (
								<div className=" flex justify-center flex-col font-bold p-4 bg-[#e5e5ff] drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
									{cat.mother.name}
									<Image
										src="/img/Placeholder.png"
										alt="Cat"
										width={300}
										height={300}
										className="justify-center align-center place-items-center"
										objectFit="contain"
									/>
									<h2 className="font-normal">Mother</h2>
									<button onClick={() => handleSelectParentToUpdate('mother')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Replace Mother</button>
								</div>
							) : (<></>)}
						</div>
						<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
					</div>
					<div className="px-10 mt-10">
						<h2 className="text-xl font-bold mb-4">Children</h2>
						<div className="flex flex-wrap">
							{cat.children ? (
								cat.children.map((child) =>(
									<div className=" flex justify-center flex-col font-bold p-4 bg-[#e5e5ff] drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
										{child.name}
										<Image
											src="/img/Placeholder.png"
											alt="Cat"
											width={300}
											height={300}
											className="justify-center align-center place-items-center"
											objectFit="contain"
										/>
										<button onClick={() => handleRemoveChild(child)} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Remove {child.name}</button>
									</div>
								))
							) : (<></>)}
							<div className=" flex justify-center flex-col font-bold p-4 bg-[#e5e5ff] drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">
								<Image
									src="/img/Placeholder.png"
									alt="Cat"
									width={200}
									height={100}
									className="border-2 border-black m-5"
								/>
								<button onClick={() => handleAddChild()} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Select Child</button>
							</div>
						</div>
						<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
					</div>
					<button onClick={handleSubmit} className="flex m-auto px-6 py-4 drop-shadow-lg bg-[#e5e5ff] rounded-xl mt-16 text-2xl">Submit</button>
				</div>
			) : (
				<h1>Loading</h1>
			)}
		</main>
	)
}