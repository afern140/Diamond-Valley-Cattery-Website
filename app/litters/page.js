"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getObject, getObjects } from "../_utils/firebase_services"
import { getDoc } from "firebase/firestore"
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
	const [litters, setLitters] = useState([]);
	const [sortBy, setSortBy] = useState("name");
	const [fieldInput, setFieldInput] = useState("");
	const [filters, setFilters] = useState(["", "", "", ""]);
	const [sortingMethod, setSortingMethod] = useState("");
	const [filteredResults, setFilteredResults] = useState();

	useEffect(() => {
		const fetchLitters = async () => {
			const litters = await getObjects('litters');
			const updatedLitters = await Promise.all(litters.map(async (litter) => {
				if (litter.mother) {
					const mother = await getDoc(litter.mother)
					litter.mother = { docId: litter.mother.id, ... mother.data() }
				}
				if (litter.father) {
					const father = await getDoc(litter.father)
					litter.father = { docId: litter.father.id, ... father.data() }
				}
				if (litter.children) {
					const children = await Promise.all(litter.children.map(async (childRef) => {
						const child = await getDoc(childRef)
						return { docId: childRef.id, ...child.data()};
					}));
					litter.children = children;
				}
				return litter;
			}));
			setLitters(updatedLitters);
		};
		fetchLitters();
	}, []);

	//When search, filters, or sorting method change, update the list of litters
	useEffect(() => {
		console.log("Beginning data filtering")
		let filteredData = litters;

		if (litters === undefined || litters === null) {
			filteredData = litters;
		}
		//Filter by search field
		if (fieldInput !== "") {
			filteredData = filteredData.filter((cat) => Object.values(cat.name).join('').toLowerCase().includes(fieldInput.toLowerCase()) );
		}
		//Filter by breed
		if (filters[0] !== "") {
			//filteredData = filteredData.filter((cat) => Object.values(cat.breed).join('').toLowerCase().includes(filters[0].toLowerCase()) );
			filteredData = filteredData.filter((cat) => cat.breed == filters[0])
		}
		//Filter by gender
		if (filters[1] !== "") {
			//filteredData = filteredData.filter((cat) => Object.values(cat.gender).join('').toLowerCase().includes(filters[1].toLowerCase()) );
			//Can't do this for gender because "Female" contains "Male"
			//Instead, this field will use an exact match
			filteredData = filteredData.filter((cat) => cat.gender.toLowerCase() == filters[1].toLowerCase());
		}
		//Filter by age
		if (filters[2] !== "") {
			//console.log("[Filter] Age: " + filters[2])
			//filteredData = filteredData.filter((cat) => Object.values(cat.age).join('').toLowerCase().includes(filters[2].toLowerCase()) );
			//birthdate is stored in epoch time, so we need to convert it to years
			// Kittens
			if (filters[2] == "Kitten") {
				filteredData = filteredData.filter((cat) => cat.birthdate && cat.birthdate.seconds * 1000 >= Date.now() - 15778463000)
			}
			// Young
			else if (filters[2] == "Young") {
				filteredData = filteredData.filter((cat) => cat.birthdate && cat.birthdate.seconds * 1000 < Date.now() - 15778463000 && cat.birthdate.seconds * 1000 >= Date.now() - 31556926000)
			}
			// Adult
			else if (filters[2] == "Adult") {
				filteredData = filteredData.filter((cat) => cat.birthdate && cat.birthdate.seconds * 1000 < Date.now() - 31556926000)
			}
		}
		//Filter by color
		if (filters[3] !== "") {
			filteredData = filteredData.filter((cat) => Object.values(cat.color).join('').toLowerCase().includes(filters[3].toLowerCase()) );
		}
		//Sort
		//Because React won't actually update data that is simply sorted, we need to create a new array
		let sortedData;
		if (sortingMethod !== "") {
			console.log("Sorting by " + sortingMethod);
			switch (sortingMethod) {
				case "Name":
					sortedData = [...filteredData.sort((a, b) => a.name > b.name)];
					break;
				case "Breed":
					sortedData = [...filteredData.sort((a, b) => a.breed > b.breed)];
					break;
				case "Gender":
					sortedData = [...filteredData.sort((a, b) => a.gender > b.gender)];
					break;
				case "Age":
					sortedData = [...filteredData.sort((a, b) => a.age - b.age)];
					break;
				case "Color":
					sortedData = [...filteredData.sort((a, b) => a.color > b.color)];
					break;
				default:
					sortedData = [...filteredData.sort((a, b) => a.color > b.color)];
					break;
			}
		}
		else if (filteredData != null && filteredData != undefined)
			sortedData = [...filteredData.sort((a, b) => a.id > b.id)];
		//Update the list
		setFilteredResults(sortedData);
		console.log("Filtered Data: ");
		console.log(filteredData);
	}, [fieldInput, filters, sortingMethod, litters]);

	const searchItems = (value) => {
		setFieldInput(value);
		setActiveAutocomplete(true);
	}

	const handleSortChange = (event) => {
		setSortBy(event.target.value);
	};

	const sortedLitters = [...litters].sort((a, b) => {
		if (sortBy === "name") {
			return a.name.localeCompare(b.name);
		} else if (sortBy === "expDate") {
			return a.expDate - b.expDate;
		}
		return 0;
	});

	const [addTooltip, setAddTooltip] = useState(false);
	const [activeAutocomplete, setActiveAutocomplete] = useState(false);

	function completeAutocomplete(field) {
		setActiveAutocomplete(false);
		setFieldInput(field);
	}

	return (
		<main className={"text-gray-700 h-full relative" + (filteredResults && filteredResults.length > 0 ? "" : " h-screen")}>
			<div className="h-full">
				<BackgroundUnderlay />

				<div className="pt-20 flex pb-10">
					<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-gradient-to-r from-[#A783D5] via-[#EB9839] to-[#E37B87] text-transparent bg-clip-text">
						<span className="text-6xl pb-10 font-extrabold">LITTERS</span> <br />
						<div className="mt-8"><span className="">DISCOVER YOUR NEW BEST FRIENDS AT DIAMOND VALLEY CATTERY. BROWSE OUR ADORABLE LITTERS AVAILABLE FOR PURCHASE.</span></div>
					</div>
				</div>
				
				<div className="px-10 xl:px-20">
					<div className="flex-col w-full items-center">
						<div>
							{/* Search Field */}
							<div className="align-middle justify-center flex translate-x-6">
								<input type="text"
									name="litterlist-search"
									placeholder="Search"
									value={fieldInput}
									className=" bg-purple-100 bg-opacity-50 border-2 placeholder-gray-700 shadow rounded-3xl text-xl pl-4 w-4/5 h-10"
									onChange = { (Event) => searchItems(Event.target.value, "") }>
								</input>
								
								<Image className="relative -translate-x-12" alt="Search..." src="/img/search-icon.svg" width={30} height={30} />
							</div>
							{ filteredResults && filteredResults.length > 0 && fieldInput.length > 0 && activeAutocomplete ? 
								<div className="absolute z-40 bg-purple-100 bg-opacity-50 border-2 placeholder-gray-700 shadow rounded-3xl text-xl w-4/5 justify-center flex-col m-auto left-[10%] translate-x-2 translate-y-1 overflow-hidden">
									{
										filteredResults.map((litter) => (
											<button className="w-full text-left h-10 hover:bg-white pl-4" onClick={() => completeAutocomplete(litter.name)}>{litter.name}</button>
										))
									}
								</div> : <div />
							}
						</div>

						<div className="flex mt-10">
							<div className="w-full bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] text-gray-700 rounded-xl relative p-4">
								<label className="font-bold text-2xl align-middle" htmlFor="sort">Sort By:</label>
								<select id="sort" value={sortBy} onChange={handleSortChange} className=" drop-shadow-md ml-4 p-2 text-xl rounded-xl bg-[#ae9afdb8] border-2">
									<option value="name">Name</option>
									<option value="expDate">Expected Date</option>
								</select>
							</div>
							<div className=" ml-10 mr-10">
								<Link onMouseEnter={() => setAddTooltip(true)} onMouseLeave={() => setAddTooltip(false)} href="litters/add" className="bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] rounded-full text-transparent bg-clip-text text-8xl relative inline-block text-left">+</Link>
								{ addTooltip &&
								<div className="absolute size-[128px] top-[420px] right-[40px]">
									<div className="w-full bg-gray-700 border-4 border-gray-500 h-8 rounded-full drop-shadow">
										<p className="flex size-full text-center text-lg text-white justify-center align-middle">Add Cat</p>
									</div>
								</div>}
							</div>
						</div>
					</div>
					<div className={"p-4 bg-white bg-opacity-20 mt-6 border-2 border-opacity-50 border-white rounded-xl" + (filteredResults && filteredResults.length > 0 ? " h-[100vh]" : "")}>
						<div className="h-full scroll-auto overflow-y-scroll overflow-hidden">
							{filteredResults && filteredResults.length > 0 ? (
								filteredResults.map((litter) => (
									<div className="flex flex-row border border-black-300 rounded-md m-5 p-5">
										<Link href={`/litters/${litter.id}`} className="text-center">
											<h2 className="text-xl mb-2">{litter.name}</h2>
											<Image
												alt="litter"
												src={litter.thumbnail ? litter.thumbnail : "/img/Placeholder.png"}
												width={250}
												height={250}
												className="border border-black-300 mr-5"
											/>
										</Link>
										<div>
											<h2>Expected Date: {new Date(litter.expDate.toDate()).toISOString().split('T')[0]}</h2>
											<h2>Mother: <Link href={`/cats/${litter.mother.id}`}>{litter.mother.name}</Link></h2>
											<h2>Father: <Link href={`/cats/${litter.father.id}`}>{litter.father.name}</Link></h2>
											<h2>Completed: {litter.completed ? "Completed" : "Not Completed"}</h2>
											{litter.completed ? (
												<div>
													<h2>Kittens:</h2>
													<div className="flex">
														{litter.children.map((child) => (
															<Link href={`/cats/${child.id}`} className="text-center mr-5">
																<Image
																	alt="kitten"
																	src={child.thumbnail ? child.thumbnail : "/img/Placeholder.png"}
																	width={100}
																	height={100}
																	className="border border-black-300 justify-center align-center place-items-center"
																/>
																<h3>{child.name}</h3>
															</Link>
														))}
													</div>
												</div>
											) : (<></>)}
										</div>
									</div>
								))
							) : (<h2>Loading litters...</h2>)}
						</div>
					</div>
					<div className="h-10"/>
				</div>
			</div>
		</main>
	)
}