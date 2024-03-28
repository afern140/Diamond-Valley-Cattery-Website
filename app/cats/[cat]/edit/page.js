"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { doc, getDoc, Timestamp } from "firebase/firestore"
import { db } from "@/app/_utils/firebase"
import { useUserAuth } from "@/app/_utils/auth-context"
import { getObject, getObjects } from "@/app/_utils/firebase_services"
import { getUser } from "@/app/_utils/user_services"

export default function Page({params}){
	const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [cat, setCat] = useState();
	const [cats, setCats] = useState();
	const [showCatSelection, setShowCatSelection] = useState(false);
	const [selectedParent, setSelectedParent] = useState();
	const [prevName, setPrevName] = useState();

	useEffect(() => {
		const fetchCat = async () => {
			const cat = await getObject('cats', parseInt(params.cat));
			if (cat.name) {
				setPrevName(cat.name);
			}
			if (cat.mother) {
				const motherDoc = await getDoc(cat.mother);
				cat.mother = motherDoc.data();
			} else {
				cat.mother = null;
			}
			if (cat.father) {
				const fatherDoc = await getDoc(cat.father);
				cat.father = fatherDoc.data();
			} else {
				cat.father = null;
			}
			if (cat.owner) {
				const ownerDoc = await getDoc(cat.owner);
				cat.owner = ownerDoc.data();
			} else {
				cat.owner = null;
			}
			if (cat.children) {
				const childrenData = await Promise.all(cat.children.map(async (childRef) => {
					const childDoc = await getDoc(childRef);
					return childDoc.data();
				}));
				cat.children = childrenData;
			}
			if (cat.conditions) {
				const conditionsData = await Promise.all(cat.conditions.map(async (conditionRef) => {
					const conditionDoc = await getDoc(conditionRef);
					return conditionDoc.data();
				}));
				cat.conditions = conditionsData;
			}
			if (cat.vaccinations) {
				const vaccinationsData = await Promise.all(cat.vaccinations.map(async (vaccinationRef) => {
					const vaccinationDoc = await getDoc(vaccinationRef);
					return vaccinationDoc.data();
				}));
				cat.vaccinations = vaccinationsData;
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
		const fetchUser = async () => {
			const filteredUser = await getUser(user);
			setFilteredUser(filteredUser);
		};
		fetchUser();
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCat((prevCat) => ({ ...prevCat, [name]: value }));
		console.log(cat);
	}

	const handleConditionChange = (e, conditionId) => {
		const { name, value } = e.target;
		const updatedConditions = cat.conditions.map((condition) => {
		if (condition.id === conditionId) {
			return {...condition, [name]: value};
		}
		return condition;
		});
		setCat((prevCat) => ({...prevCat,conditions: updatedConditions}));
		console.log(cat);
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
		console.log(cat);
	};

	const handleRemoveCondition = (conditionId) => {
		const updatedConditions = cat.conditions.filter((condition) => condition.id !== conditionId);
		setCat((prevCat) => ({...prevCat, conditions: updatedConditions}));
		console.log(cat);
	};

	const handleVaccinationChange = (e, vaccinationId) => {
		const { name, value } = e.target;
		const updatedVaccination = cat.vaccinations.map((vaccination) => {
		if (vaccination.id === vaccinationId) {
			return {...vaccination, [name]: value};
		}
		return vaccination;
		});
		setCat((prevCat) => ({...prevCat,vaccinations: updatedVaccination}));
		console.log(cat);
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
		console.log(cat);
	};
	
	const handleVaccinationDateChange = (e, vaccinationId, index, dateType) => {
		const { value } = e.target;
		const date = new Date(value);
		const timestamp = Timestamp.fromDate(date);
		setCat((prevCat) => {
			const updatedVaccinations = prevCat.vaccinations.map((vaccination) => {
				if (vaccination.id === vaccinationId) {
					return {
						...vaccination,
						[dateType]: vaccination[dateType].map((date, i) => (i === index ? timestamp : date))
					};
				}
				return vaccination;
			});
			return { ...prevCat, vaccinations: updatedVaccinations };
		});
		console.log(cat);
	};
	
	const handleRemoveVaccination = (vaccinationId) => {
		const updatedVaccination = cat.vaccinations.filter((vaccination) => vaccination.id !== vaccinationId);
		setCat((prevCat) => ({...prevCat, vaccinations: updatedVaccination}));
		console.log(cat);
	};

	const handleSelectParentToUpdate = (parent) => {
		setSelectedParent(parent);
		setShowCatSelection(true);
		console.log(cat);
	};
	
	const handleReplaceParent = (selectedCatId) => {
		const selectedCat = cats.find(cat => cat.docId === selectedCatId);
		const updatedCat = {...cat, [selectedParent]: selectedCat};
		setCat(updatedCat);
		setShowCatSelection(false);
	};
	
	const handleSubmit = async () => {
		await updateObject(cat);
	}

	return(
		<main className="bg-white min-h-screen text-black p-4">
			{cat ? (
				<div className="mb-6">
					<h1 className="text-3xl font-bold mb-4 text-center">Edit {prevName}</h1>
					<h2 className="text-3xl font-bold mb-4 flex justify-center mt-10">Details</h2>
					<div className="flex space-x-6 justify-center bg-[#C9D9E3] shadow mb-10 rounded-xl max-w-[1000px] mx-auto py-4">
						<div className=" size-80 flex my-auto relative z-40">
							<div className="hover:bg-gray-500 w-full h-full rounded-xl transition duration-300 invisible hover:visible">
								<Image src="/img/Kitty_1.png" layout="fill" objectFit="contain" className="visible size-full rounded-xl border-4 mix-blend-multiply shadow"/>
								<button className="absolute flex m-auto top-1/2 left-1/2 rounded-xl border-2 bg-black bg-opacity-50 text-white px-4 py-2 -translate-x-1/2 -translate-y-1/2">Edit Picture</button>
							</div>
						</div>
						<div className="flex flex-col mb-4 rounded-md p-4 max-w-md shadow bg-[#EFEFEF]">
							<input
								type="text"
								name="name"
								placeholder={cat.name}
								value={cat.name}
								onChange={handleChange}
								className="border border-gray-300 rounded-md p-2 mb-2"
							/>
							<input
								type="text"
								name="breed"
								placeholder={cat.breed}
								value={cat.breed}
								onChange={handleChange}
								className="border border-gray-300 rounded-md p-2 mb-2"
							/>
							<input
								type="text"
								name="gender"
								placeholder={cat.gender}
								value={cat.gender}
								onChange={handleChange}
								className="border border-gray-300 rounded-md p-2 mb-2"
							/>
							<input
								type="number"
								name="age"
								placeholder={cat.age}
								value={cat.age}
								onChange={handleChange}
								className="border border-gray-300 rounded-md p-2 mb-2"
							/>
							<input
								type="text"
								name="color"
								placeholder={cat.color}
								value={cat.color}
								onChange={handleChange}
								className="border border-gray-300 rounded-md p-2 mb-2"
							/>
							<input
								type="text"
								name="eye_color"
								placeholder={cat.eye_color}
								value={cat.eye_color}
								onChange={handleChange}
								className="border border-gray-300 rounded-md p-2 mb-2"
							/>
							<input
								type="text"
								name="description"
								placeholder={cat.description}
								value={cat.description}
								onChange={handleChange}
								className="border border-gray-300 rounded-md p-2 mb-2"
							/>
						</div>
					</div>
					
					<div className="flex flex-wrap max-w-[1000px] rounded-xl mx-auto justify-evenly">
						<div className="h-full">
							<h2 className="text-3xl font-bold mb-4 flex mx-auto justify-center">Vaccinations</h2>
							<div className="flex space-x-6 justify-center shadow mb-10 rounded-xl p-4 bg-[#C9D9E3]">
								{cat.vaccinations ? (
									cat.vaccinations.map((vaccination) => (
										<div key={vaccination.id} className="bg-[#EFEFEF] flex flex-col rounded-md p-6 shadow">
											<input
												type="text"
												name="name"
												placeholder={vaccination.name}
												value={vaccination.name}
												onChange={(e) => handleVaccinationChange(e, vaccination.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											/>
											<input
												type="text"
												name="description"
												placeholder={vaccination.description}
												value={vaccination.description}
												onChange={(e) => handleVaccinationChange(e, vaccination.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											/>
											<select
												name="completed"
												value={vaccination.completed ? "finished" : "inProgress"}
												onChange={(e) => handleStatusChange(e, vaccination.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											>
												<option value="finished">Finished</option>
												<option value="inProgress">In Progress</option>
											</select>
											<input
												type="number"
												name="dosesTaken"
												placeholder={vaccination.dosesTaken}
												value={vaccination.dosesTaken}
												onChange={(e) => handleVaccinationChange(e, vaccination.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											/>
											<h4>Doses Taken Dates:</h4>
											<ul className="list-disc ml-4 mb-4">
												{vaccination.datesTaken.map((date, index) => (
													<li key={index} className="font-normal">
														<input
															type="date"
															value={new Date(date.seconds * 1000).toISOString().split('T')[0]}
															onChange={(e) => handleVaccinationDateChange(e, vaccination.id, index, 'datesTaken')}
														/>
													</li>
												))}
											</ul>
											<input
												type="number"
												name="dosesRemaining"
												placeholder={vaccination.dosesRemaining}
												value={vaccination.dosesRemaining}
												onChange={(e) => handleVaccinationChange(e, vaccination.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											/>
											<h4>Planned Dosage Dates:</h4>
											<ul className="list-disc ml-4 mb-4">
												{vaccination.futureDates.map((date, index) => (
													<li key={index} className="font-normal">
														<input
															type="date"
															value={new Date(date.seconds * 1000).toISOString().split('T')[0]}
															onChange={(e) => handleVaccinationDateChange(e, vaccination.id, index, 'futureDates')}
														/>
													</li>
												))}
											</ul>
											<button onClick={() => handleRemoveVaccination(vaccination.id)} className="bg-slate-200 border border-gray-300 rounded-md p-2 mb-2">Remove Vaccination</button>
										</div>
									)
								)) : (<h2>None</h2>)}
							</div>
						</div>
						<div className="h-full">
							<h2 className="text-3xl font-bold mb-4 flex justify-center ">Conditions</h2>
							<div className="flex space-x-4 justify-center rounded-xl bg-[#C9D9E3] p-4 shadow max-w-[1000px] mx-auto py-4">
								{cat.conditions ? (
									cat.conditions.map((condition) => (
										<div key={condition.id} className="flex flex-col mb-4 rounded-md p-4 bg-[#EFEFEF] shadow">
											<input
												type="text"
												name="name"
												placeholder={condition.name}
												value={condition.name}
												onChange={(e) => handleConditionChange(e, condition.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											/>
											<input
												type="text"
												name="description"
												placeholder={condition.description}
												value={condition.description}
												onChange={(e) => handleConditionChange(e, condition.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											/>
											<input
												type="text"
												name="treatment"
												placeholder={condition.treatment}
												value={condition.treatment}
												onChange={(e) => handleConditionChange(e, condition.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											/>
											<select
												value={condition.treated ? "finished" : "inProgress"}
												onChange={(e) => handleTreatedChange(e, condition.id)}
												className="border border-gray-300 rounded-md p-2 mb-2"
											>
												<option value="finished">Finished</option>
												<option value="inProgress">In Progress</option>
											</select>
											<button onClick={() => handleRemoveCondition(condition.id)} className="bg-slate-200 border border-gray-300 rounded-md p-2 mb-2">Remove Condition</button>
										</div>
									)
								)) : (<h2>None</h2>)}
							</div>
						</div>
					</div>
					<div>
						<h2 className="text-3xl font-bold mb-4 flex mx-auto justify-center">Parents</h2>
						<div className="flex space-x-6 justify-center bg-[#C9D9E3] shadow mb-10 rounded-xl max-w-[1000px] mx-auto py-4">
							<div className="bg-[#EFEFEF] shadow flex space-x-6 py-6 px-12 rounded-xl">
								{cat.father ? (
									<div className=" p-5 rounded-lg text-center">
										{cat.father.name}
										<Link href={`./${cat.father.id}`}>
											<Image
												src="/img/Kitty_2.png"
												alt="Cat"
												width={200}
												height={100}
												className="border-2 border-black m-5"
											/>
											<h2 className="font-normal">Father</h2>
										</Link>
										<button onClick={() => handleSelectParentToUpdate('father')} className="bg-slate-200 py-2 px-4 rounded mt-4">Replace Father</button>
									</div>
								) : (<></>)}
								{cat.mother ? (
									<div className="p-5 rounded-lg text-center">
										{cat.mother.name}
										<Link href={`./${cat.mother.id}`}>
											<Image
												src="/img/Kitty_2.png"
												alt="Cat"
												width={200}
												height={100}
												className="border-2 border-black m-5"
											/>
											<h2 className="font-normal">Mother</h2>
										</Link>
										<button onClick={() => handleSelectParentToUpdate('mother')} className="bg-slate-200 py-2 px-4 rounded mt-4">Replace Mother</button>
									</div>
								) : (<></>)}
							</div>
						</div>
					</div>
					{showCatSelection && (
					    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
					        <div className="bg-white p-8 rounded-lg">
					            <h2 className="text-lg font-bold mb-4">Select a new cat</h2>
					            <select onChange={(e) => handleReplaceParent(e.target.value)} className="border border-gray-300 rounded-md p-2 mb-2">
					                <option value="">Select Cat</option>
					                {cats.map((cat) => (
					                    <option key={cat.id} value={cat.docId}>{cat.name}</option>
					                ))}
					            </select>
					            <button onClick={() => setShowCatSelection(false)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded mt-4">Cancel</button>
					        </div>
					    </div>
					)}
					<button onClick={console.log(cat)} className="bg-slate-200 py-4 px-8 rounded mt-4 flex mx-auto text-3xl shadow">Submit</button>
				</div>
			) : (
				<h1>Loading</h1>
			)}
		</main>
	)
}