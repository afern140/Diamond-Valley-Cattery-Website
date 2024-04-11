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
import ImageUploader from "@/app/components/ImageUploader";
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
	const [fileInputs, setFileInputs] = useState([{ id: v4(), file: null }]);
	const [carouselImages, setCarouselImages] = useState([]);
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

	const handleImageSelected = async (event, id) => {
		const file = event.target.files[0];
		if (file) {
		  // Upload the file as soon as it is selected
		  const imgRef = ref(imageDb, `carouselImages/${id}`);
		  const snapshot = await uploadBytes(imgRef, file);
		  const url = await getDownloadURL(snapshot.ref);
		  const newImage = {
			storagePath: snapshot.metadata.fullPath,
			url: url
		  };
	  
		  // Update the carouselImages state with the new image URL
		  setCarouselImages(currentImages => [...currentImages, newImage]);
	  
		  // Replace the current input with one that has a file, and add a new file input placeholder
		  setFileInputs(currentInputs => {
			const updatedInputs = currentInputs.map(input => {
			  if (input.id === id) {
				return { ...input, file: file };
			  }
			  return input;
			});
			// Only add a new input placeholder if the current one is being used
			if (currentInputs.some(input => input.id === id && input.file === null)) {
			  updatedInputs.push({ id: v4(), file: null });
			}
			return updatedInputs;
		  });
		}
	  };
	  
	  

	  const uploadFiles = async () => {
		const imageUploadPromises = fileInputs
		  .filter(input => input.file !== null)
		  .map(input => {
			const imgRef = ref(imageDb, `carouselImages/${input.id}`);
			return uploadBytes(imgRef, input.file).then((snapshot) => getDownloadURL(snapshot.ref));
		  });
	  
		const imageUrls = await Promise.all(imageUploadPromises);
		return imageUrls.map((url, index) => ({
		  storagePath: `carouselImages/${fileInputs[index].id}`,
		  url: url,
		}));
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
		
		const carouselImageObjects = await uploadFiles();

	try {

		const uploadedImageUrls = await uploadFiles();

		const newCat = {
			...cat, 
			id: newId, 
			conditions: conditionRefs, 
			vaccinations: vaccinationRefs, 
			owner: ownerRef, 
			mother: motherRef, 
			father: fatherRef, 
			children: childrenRefs, 
			carouselImages: uploadedImageUrls,
		};
		console.log('newCat to be saved:', newCat);
		await createObject('cats', newCat);
		console.log('Cat saved successfully!');
	
	  } catch (error) {
		console.error('Error during submission:', error);
	  }
	};

	return(
		<main className="relative min-h-screen text-header-text-0">
			<BackgroundUnderlay />
			{filteredUser ? (
				<div className="w-4/5 mx-auto pb-16">
					
					{/* Header */}
					<div className="pt-20 flex pb-10">
						<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
							<span className="text-6xl pb-10 font-extrabold">Add Cat</span> <br />
						</div>
					</div>

					{/* Add Details */}
					<div className="mx-auto">
						<div className="bg-white dark:bg-gray-500 p-10 rounded-xl drop-shadow-lg flex flex-col xl:flex-row justify-between">
							<div className="mx-auto">
								<ImageUploader onImageSelected={handleImageSelected} inputKey={inputKey} />
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
										<input
											type="text"
											name="gender"
											placeholder="Gender"
											value={cat.gender}
											onChange={handleChange}
											className="p-1 rounded-md pl-2 bg-white drop-shadow-lg"
										/>
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
									name="name"
									placeholder="Name"
									value={cat.name}
									onChange={handleChange}
									className="p-1 rounded-md pl-2 min-h-[200px] bg-white drop-shadow-lg"
								/>
							</div>
						</div>
					</div>

					{/* Carousel Images */}
					<div className="mt-10 bg-white dark:text-dark-header-text-0 dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg h-[420px]">
						<div className="h-[300px]">
							<h2 className="text-xl font-bold mb-4">Images</h2>
							{fileInputs.map((input, index) => (
								<input
								key={input.id}
								type="file"
								onChange={(event) => handleImageSelected(event, input.id)}
								className={`border border-gray-300 rounded-md p-2 mb-2 ${index > 0 ? 'mt-2' : ''}`}
								/>
							))}
						</div>
					</div>

					{/* Conditions */}
					<div className="mt-10 bg-white dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg">
						<h2 className="text-xl font-bold mb-4 dark:text-dark-header-text-0">Conditions</h2>
						<div className="flex flex-wrap">
							{cat.conditions ? (
								cat.conditions.map((condition) => (
									<EditCondition key={condition.id} condition={condition} handleConditionChange={handleConditionChange} handleTreatedChange={handleTreatedChange} handleRemoveCondition={handleRemoveCondition}/>
								)
							)) : (<h2>None</h2>)}
							<div className="flex flex-col mb-4 bg-navbar-body-1 dark:bg-gray-300 m-2 border-2 border-gray-300 border-dashed drop-shadow-lg rounded-md p-2">
								{selectedCondition ? (
									<div className="flex flex-col mb-4 bg-navbar-body-1 dark:bg-gray-300  m-2 drop-shadow-lg rounded-md p-2">
										<select
											onChange={(e) => handleSelectCondition(e)}
											className="border border-gray-300 bg-white rounded-md p-2 mb-2"
										>
											<option value="bg-white">Select a condition</option>
											{conditions.map((condition) => (
												<option key={condition.id} value={condition.id} className="bg-white">{condition.name}</option>
											))}
										</select>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedCondition.description}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedCondition.treatment}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedCondition.treated ? "Finished" : "In Progress"}</h3>
									</div>
								) : (
									<select
										onChange={(e) => handleSelectCondition(e)}
										className="border border-gray-300 bg-white rounded-md p-2 mb-2"
									>
										<option value="">Select a condition</option>
										{conditions.map((condition) => (
											<option key={condition.id} value={condition.id}>{condition.name}</option>
										))}
									</select>
								)}
								<button onClick={handleAddSelectedCondition} className="bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0 p-2 rounded-md drop-shadow-lg mb-2">Select Condition</button>
							</div>
							<AddCondition newCondition={newCondition} handleConditionChange={handleConditionChange} handleTreatedChange={handleTreatedChange} handleAddCondition={handleAddCondition}/>
						</div>
					</div>

					{/* Vaccinations */}
					<div className="mt-10 bg-white dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg">
						<div>
							<h2 className="text-xl font-bold mb-4 dark:text-dark-header-text-0">Vaccinations</h2>
							<div className="flex flex-wrap">
								{cat.vaccinations ? (
									cat.vaccinations.map((vaccination) => (
										<EditVaccination vaccination={vaccination} newDate={newDate} setNewDate={setNewDate} handleVaccinationChange={handleVaccinationChange} handleStatusChange={handleStatusChange} handleVaccinationDateChange={handleVaccinationDateChange} handleRemoveDate={handleRemoveDate} handleAddDate={handleAddDate} handleRemoveVaccination={handleRemoveVaccination} showTakenDateSelection={showTakenDateSelection} setShowTakenDateSelection={setShowTakenDateSelection} showPlannedDateSelection={showPlannedDateSelection} setShowPlannedDateSelection={setShowPlannedDateSelection}/>
									)
								)) : (<h2>None</h2>)}
								<div className="w-[320px] flex flex-col mb-4 bg-navbar-body-1 dark:bg-gray-300  m-2 border-2 border-gray-300 border-dashed drop-shadow-lg rounded-md p-2">
									{selectedVaccine ? (
									<div>
										<select
											onChange={(e) => handleSelectVaccine(e)}
											className="border border-gray-300 bg-white rounded-md p-2 mb-2"
										>
											<option value="">Select a vaccine</option>
											{vaccinations.map((vaccine) => (
												<option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
											))}
										</select>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedVaccine.description}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedVaccine.completed ? "Finished" : "In Progress"}</h3>
										<h3 className="border border-gray-300 rounded-md p-2 mb-2">{selectedVaccine.dosesTaken}</h3>
									</div>
									) : (
									<select
										onChange={(e) => handleSelectVaccine(e)}
										className="border border-gray-300 bg-white rounded-md p-2 mb-2"
									>
										<option value="">Select a vaccine</option>
										{vaccinations.map((vaccine) => (
										<option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
										))}
									</select>
									)}
									<button onClick={handleAddSelectedVaccine} className="bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0 p-2 rounded-md drop-shadow-lg mb-2">Select Vaccine</button>
								</div>
								<AddVaccination newVaccine={newVaccine} newDate={newDate} setNewDate={setNewDate} showTakenDateSelection={showTakenDateSelection} setShowTakenDateSelection={setShowTakenDateSelection} showPlannedDateSelection={showPlannedDateSelection} setShowPlannedDateSelection={setShowPlannedDateSelection} handleVaccinationChange={handleVaccinationChange} handleVaccinationDateChange={handleVaccinationDateChange} handleRemoveDate={handleRemoveDate} handleAddDate={handleAddDate} handleAddVaccine={handleAddVaccine}/>
							</div>
						</div>
					</div>

					{/* Parents */}
					<div className="mt-10 bg-white dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg">
						<div>
							<h2 className="text-xl font-bold mb-4 dark:text-dark-header-text-0">Parents</h2>
							<div className="flex flex-wrap">
								{cat.mother ? (
									<div className="m-4 p-4 bg-navbar-body-1 dark:bg-gray-300  rounded-xl drop-shadow-lg items-center text-center">
										{cat.mother.name}
										<Image
											src={cat.mother.thumbnail || "/img/Placeholder.png"}
											alt="Cat"
											width={200}
											height={100}
											className="border-2 border-black m-5"
										/>
										<h2 className="font-normal">Mother</h2>
										<button onClick={() => handleSelectParentToUpdate('mother')} className="bg-white drop-shadow-lg py-2 px-4 rounded mt-4">Replace Mother</button>
									</div>
								) : (
									<div className=" flex justify-center flex-col m-4 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300  drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
										<Image
											src="/img/Placeholder.png"
											alt="Cat"
											width={200}
											height={100}
											className="border border-black rounded-xl m-5"
										/>
										<button onClick={() => handleSelectParentToUpdate('mother')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Add Mother</button>
									</div>)}
								{cat.father ? (
									<div className="m-4 p-4 bg-navbar-body-1 dark:bg-gray-300  rounded-xl drop-shadow-lg items-center text-center">
										{cat.father.name}
										<Image
											src={cat.father.thumbnail || "/img/Placeholder.png"}
											alt="Cat"
											width={200}
											height={100}
											className="border-2 border-black m-5"
										/>
										<h2 className="font-normal">Father</h2>
										<button onClick={() => handleSelectParentToUpdate('father')} className="bg-white drop-shadow-lg py-2 px-4 rounded mt-4">Replace Father</button>
									</div>
								) : (
									<div className=" flex justify-center flex-col m-4 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300  drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
										<Image
											src="/img/Placeholder.png"
											alt="Cat"
											width={200}
											height={100}
											className="border border-black rounded-xl m-5"
										/>
										<button onClick={() => handleSelectParentToUpdate('father')} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Add Father</button>
									</div>)}
							</div>
							<CatSelection cats={cats} showCatSelection={showParentSelection} setShowCatSelection={setShowParentSelection} handleSelectCat={handleReplaceParent}/>
						</div>
					</div>

					{/* Children */}
					<div className="mt-10 bg-white dark:bg-gray-500 rounded-xl p-10 drop-shadow-lg">
						<div>
							<h2 className="text-xl font-bold mb-4 dark:text-dark-header-text-0">Children</h2>
							<div className="flex flex-wrap">
								{cat.children ? (
									cat.children.map((child) =>(
										<div className="m-4 p-4 bg-navbar-body-1 dark:bg-gray-300  rounded-xl drop-shadow-lg items-center text-center">
											{child.name}
											<Image
												src={cat.children.thumbnail || "/img/Placeholder.png"}
												alt="Cat"
												width={200}
												height={100}
												className="border-2 border-black m-5"
											/>
											<button onClick={() => handleRemoveChild(child)} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Remove {child.name}</button>
										</div>
									))
								) : (<></>)}
								<div className=" flex justify-center flex-col m-4 border-2 border-dashed border-gray-300 font-bold p-4 bg-navbar-body-1 dark:bg-gray-300  drop-shadow-lg  rounded-xl text-[#092C48] place-items-center">								
									<Image
										src="/img/Placeholder.png"
										alt="Cat"
										width={200}
										height={100}
										className="border border-black rounded-xl m-5"
									/>
									<button onClick={() => handleAddChild()} className="px-4 py-2 bg-white drop-shadow-lg  rounded-xl mt-6">Select Child</button>
								</div>
							</div>
							<CatSelection cats={cats} showCatSelection={showChildSelection} setShowCatSelection={setShowChildSelection} handleSelectCat={handleSelectChild}/>
						</div>
					</div>
					<button onClick={handleSubmit} className="flex m-auto px-6 py-4 drop-shadow-lg bg-navbar-body-0 dark:bg-gray-600 rounded-xl mt-16 text-2xl text-white">Submit</button>
				</div>
			) : (<h1>You must be logged in to add a cat</h1>)}
		</main>
	)
}