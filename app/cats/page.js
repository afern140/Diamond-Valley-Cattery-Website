"use client"

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getObjects, getObject } from "../_utils/firebase_services";
import Dropdown from "@/app/components/dropdown";
import CatButton from "@/app/components/cats/catbutton";
import BackButton from "@/app/components/BackToTopButton"
import BackgroundUnderlay from "@/app/components/background-underlay";
import { useUserAuth } from "../_utils/auth-context";
import getUser from "../_utils/user_services";

export default function Page() {
	//Holds data that the page can display. Uses backup data until database is loaded
	const [cats, setCats] = useState();
	//Holds the list of cats that are currently displayed, after filtering
	const [filteredResults, setFilteredResults] = useState();
	//Search field input
	const [fieldInput, setFieldInput] = useState("");
	//List of filters that are currently applied

	//Sorting method
	const [sortingMethod, setSortingMethod] = useState("");

	const { user } = useUserAuth();
	const { dbUser } = useUserAuth();

	// Filter Types
	const [breedType, setBreedType] = useState("");
	const [genderType, setGenderType] = useState("");
	const [ageType, setAgeType] = useState("");
	const [colorType, setColorType] = useState("");
	const [sortbyType, setSortbyType] = useState("");

	//Holds data to fill filter dropdowns
	const [breeds, setBreeds] = useState([""]);
	const [colors, setColors] = useState([""]);

	//Age is special, and holds a list of age groups
	const ageGroups = [
		{age: "Kitten (0-6 months)"},
		{age: "Young (6 months - 1 year)"},
		{age: "Adult (1 year+)"}
	];

	// Sort by filter values
	const sortbyGroups = [
		{group: "Name"},
		{group: "Breed"},
		{group: "Gender"},
		{group: "Age"},
		{group: "Color"}
	];

	//Replaces the cats list with the database data when it is loaded
	useEffect(() => {
		const fetchCats = async () => {
			const cats = await getObjects('cats');
			console.log(cats);
			setCats(cats);
			//Fill values that populate dropdowns
			let breeds = [];
			let colors = [];
			cats.forEach((cat) => {
				if (!breeds.includes(cat.breed))
					breeds.push(cat.breed);
				if (!colors.includes(cat.color))
					colors.push(cat.color);
			});
			setBreeds(breeds);
			setColors(colors);
		};
		fetchCats();
	}, []);

	//Search field handler
	const searchItems = (value) => {
		setFieldInput(value);
		setActiveAutocomplete(true);
	}

	//Clear filters
	const clearFilters = () => {
		setBreedType("");
		setGenderType("");
		setAgeType("");
		setColorType("");
	}

	//Handle sorts
	const sortItems = (value) => {
		const split = value.split(" ");
		const type = split[0];
		const filter = split[1];
		setSortingMethod(filter);
	}
	
	//When search, filters, or sorting method change, update the list of cats
	useEffect(() => {
		console.log("Beginning data filtering")
		let filteredData = cats;

		if (cats === undefined || cats === null) {
			filteredData = cats;
			return;
		}
		//Filter by search field
		if (fieldInput !== "") {
			filteredData = filteredData.filter((cat) => Object.values(cat.name).join('').toLowerCase().includes(fieldInput.toLowerCase()) );
		}
		//Filter by breed
		if (breedType !== "") {
			//filteredData = filteredData.filter((cat) => Object.values(cat.breed).join('').toLowerCase().includes(filters[0].toLowerCase()) );
			filteredData = filteredData.filter((cat) => cat.breed == breedType)
		}
		//Filter by gender
		if (genderType !== "") {
			//filteredData = filteredData.filter((cat) => Object.values(cat.gender).join('').toLowerCase().includes(filters[1].toLowerCase()) );
			//Can't do this for gender because "Female" contains "Male"
			//Instead, this field will use an exact match
			filteredData = filteredData.filter((cat) => cat.gender.toLowerCase() == genderType.toLowerCase());
		}
		//Filter by age
		if (ageType !== "") {
			//console.log("[Filter] Age: " + filters[2])
			//filteredData = filteredData.filter((cat) => Object.values(cat.age).join('').toLowerCase().includes(filters[2].toLowerCase()) );
			//birthdate is stored in epoch time, so we need to convert it to years
			// Kittens
			if (ageType == ageGroups[0].age) {
				filteredData = filteredData.filter((cat) => cat.birthdate && cat.birthdate.seconds * 1000 >= Date.now() - 15778463000)
			}
			// Young
			else if (ageType == ageGroups[1].age) {
				filteredData = filteredData.filter((cat) => cat.birthdate && cat.birthdate.seconds * 1000 < Date.now() - 15778463000 && cat.birthdate.seconds * 1000 >= Date.now() - 31556926000)
			}
			// Adult
			else if (ageType == ageGroups[2].age) {
				filteredData = filteredData.filter((cat) => cat.birthdate && cat.birthdate.seconds * 1000 < Date.now() - 31556926000)
			}
		}
		//Filter by color
		if (colorType !== "") {
			filteredData = filteredData.filter((cat) => Object.values(cat.color).join('').toLowerCase().includes(colorType.toLowerCase()) );
		}

		//Sort
		//Because React won't actually update data that is simply sorted, we need to create a new array
		let sortedData;
		if (sortingMethod !== "") {
			console.log("Sorting by " + sortingMethod);
			switch (sortingMethod) {
				case "Name":
					sortedData = [...filteredData.sort((a, b) => a.name > b.name)];
					
					// -- F -- This sorting method works
					sortedData = sortedData.sort(function (a, b)  { if (a.name > b.name) return 1;  if (a.name < b.name) return -1;  return 0; })
					break;
				case "Breed":
					sortedData = [...filteredData.sort((a, b) => a.breed > b.breed)];
					
					// -- F -- This sorting method works
					sortedData = sortedData.sort(function (a, b)  { if (a.breed > b.breed) return 1;  if (a.breed < b.breed) return -1;  return 0; })
					break;
				case "Gender":
					sortedData = [...filteredData.sort((a, b) => a.gender > b.gender)];
					
					// -- F -- This sorting method works
					sortedData = sortedData.sort(function (a, b)  { if (a.gender > b.gender) return 1;  if (a.gender < b.gender) return -1;  return 0; })
					break;
				case "Age":
					sortedData = [...filteredData.sort((a, b) => a.age - b.age)];
					
					// -- F -- This sorting method works
					sortedData = sortedData.sort(function (a, b)  { if (a.age > b.age) return 1;  if (a.age < b.age) return -1;  return 0; })
					break;
				case "Color":
					sortedData = [...filteredData.sort((a, b) => a.color > b.color)];
					
					// -- F -- This sorting method works
					sortedData = sortedData.sort(function (a, b)  { if (a.color > b.color) return 1;  if (a.breed < b.breed) return -1;  return 0; })
					break;
				default:
					sortedData = [...filteredData.sort((a, b) => a.color > b.color)];
					
					// -- F -- This sorting method works
					sortedData = sortedData.sort(function (a, b)  { if (a.color > b.color) return 1;  if (a.breed < b.breed) return -1;  return 0; })
					break;
			}
		}
		else if (filteredData != null && filteredData != undefined) {
			sortedData = [...filteredData.sort((a, b) => a.id > b.id)];

			// -- F -- This sorting method works
			sortedData = sortedData.sort(function (a, b)  { if (a.id > b.id) return 1;  if (a.id < b.id) return -1;  return 0; })
		}
		//Update the list
		setFilteredResults(sortedData);
		console.log("Filtered Data: ");
		console.log(filteredData);
	}, [fieldInput, sortingMethod, cats, breedType, genderType, ageType, colorType, sortbyType]);

	// Tooltips
	const [addTooltip, setAddTooltip] = useState(false);
	const [activeAutocomplete, setActiveAutocomplete] = useState(false);

	function completeAutocomplete(field) {
		setActiveAutocomplete(false);
		setFieldInput(field);
	}

	// -- F -- search bar click away
    const searchbarRef = useRef(null);
	useEffect(() => {
		// only add the event listener when the search bar drop is opened
        if (!activeAutocomplete) return;

        function handleClick(event) {
            if (searchbarRef.current && !searchbarRef.current.contains(event.target)) {
                setActiveAutocomplete(false);
				console.log("Search bar is off!");
            }
        }

        window.addEventListener("mousedown", handleClick);
        return () => { window.removeEventListener("mousedown", handleClick); }
	}, [activeAutocomplete]);

	// Main Rendering
	return (
		<main className="w-full flex-col justify-center pointer-events-auto text-black text-xl font-normal overflow-hidden relative">
			<BackButton url="#Navbar" />
			<BackgroundUnderlay />

			<div className="pt-20 flex pb-10">
				<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text">
					<span className="text-6xl pb-10 font-extrabold">CATS</span> <br />
					<div className="mt-8 pointer-events-auto"><span className="">DISCOVER YOUR NEW BEST FRIEND AT DIAMOND VALLEY CATTERY. BROWSE OUR ADORABLE CATS AVAILABLE FOR PURCHASE.</span></div>
				</div>
			</div>

			

	<div className="flex py-6 w-full justify-center">
		<div className="flex w-full">
		{/* First split of the page */}
		<div className=" w-1/3 mr-6 ml-20 align-middle justify-start flex-col flex items-center relative z-20">
			<div className="p-6 w-fit text-text-header-0 rounded-xl relative -z-20 bg-white dark:bg-gray-500  drop-shadow-lg">
				<h2 className="py-6 text-2xl font-semibold text-center drop-shadow-md">Filters</h2>
				<h3 className="py-2 text-lg">Breed</h3>
				{/*<Dropdown queryType="breed" callback={filterItems} cats={cats} isInsidePanel={true}/>*/}
				<select id="sort" value={breedType} onChange={(e) => setBreedType(e.target.value)} className=" drop-shadow-md p-2 text-xl rounded-xl bg-[#e5e5ff] bg-opacity-100 w-full max-w-[300px]">
					<option value="">None</option>
					{breeds.map((breed) => (
						<option value={breed}>{breed}</option>
					))}
				</select>
				<h3 className="py-2 text-lg">Gender</h3>
				{/*<Dropdown queryType="gender" callback={filterItems} cats={cats} isInsidePanel={true}/>*/}
				<select id="sort" value={genderType} onChange={(e) => setGenderType(e.target.value)} className=" drop-shadow-md p-2 text-xl rounded-xl bg-[#e5e5ff] bg-opacity-100 w-full max-w-[300px]">
							<option value="">None</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
				</select>
				<h3 className="py-2 text-lg">Age</h3>
				{/*<Dropdown queryType="age" callback={filterItems} cats={cats} isInsidePanel={true}/>*/}
				<select id="sort" value={ageType} onChange={(e) => setAgeType(e.target.value)} className=" drop-shadow-md p-2 text-xl rounded-xl bg-[#e5e5ff] bg-opacity-100 w-full max-w-[300px]">
					<option value="">None</option>
					{ageGroups.map((age) => (
						<option value={age.age}>{age.age}</option>
					))}
				</select>
				<h3 className="py-2 text-lg">Color</h3>
				{/*<Dropdown queryType="color" callback={filterItems} cats={cats} isInsidePanel={true}/>*/}
				<select id="sort" value={colorType} onChange={(e) => setColorType(e.target.value)} className=" drop-shadow-md p-2 text-xl rounded-xl bg-[#e5e5ff] bg-opacity-100 w-full max-w-[300px]">
					<option value="">None</option>
					{colors.map((color) => (
						<option value={color}>{color}</option>
					))}
				</select>
				


				<div className="w-fit z-10">
					<button onClick={clearFilters} className=" py-2 z-10 relative px-4 mt-10 bg-background-gradient-1 drop-shadow-lg text-text-header-0 rounded-xl font-semibold">Clear Filters</button>
					{/*<div className="p-4 bg-yellow-700 rounded-xl absolute h-10 -translate-y-[36px] -z-10 w-full" />*/}
				</div>
			</div>
		</div>

		{/* Second split of the page */}
		<div className="w-full flex-col mr-16">
			<div className="flex w-full">

				<div className="w-full h-full">
					{/* Search Bar -- F */}
					<div className="align-middle justify-center  w-full flex">
						<div className="w-full relative">
							<input type="text"
								name="catlist-search"
								id="search-bar"
								placeholder="Search"
								value={fieldInput}
								className=" bg-[#e5e5ff] bg-opacity-50 dark:bg-gray-300 dark:bg-opacity-100 placeholder-text-header-0 shadow drop-shadow-lg rounded-3xl text-xl pl-4 w-full h-16"
								onChange = { (Event) => searchItems(Event.target.value, "") }>
							</input>

							{ filteredResults && filteredResults.length > 0 && fieldInput.length > 0 && activeAutocomplete ? 
							<div ref={searchbarRef} className={`absolute w-full z-50 bg-gray-100 bg-opacity-100 border-2 placeholder-text-header-0 shadow rounded-3xl text-xl flex-col overflow-hidden`}>
								{
									filteredResults.map((cat) => (
										<button className="w-full text-left h-10 hover:bg-white pl-4" onClick={() => completeAutocomplete(cat.name)}>{cat.name}</button>
									))
								}
							</div> : <div />
							}
						</div>
						
						<Image className="relative -translate-x-12" alt="Search..." src="/img/search-icon.svg" width={30} height={30} />
					</div>
				</div>

				<div className=" w-full max-w-[200px] mr-full ml-auto justify-end flex-col bg-white dark:bg-gray-500 rounded-xl p-4 drop-shadow-lg z-50">
					<h2 className="flex justify-start font-bold text-xl text-text-header-0 drop-shadow-md">Sort by:</h2>
					
					{/*<div className=" pt-4">
						<Dropdown queryType="sort" callback={sortItems} isInsidePanel={true}/>
					</div>*/}

					{/* Sorting Dropdown Filter -- F */}
					<select id="sort" value={sortingMethod} onChange={(e) => setSortingMethod(e.target.value)} className=" drop-shadow-md p-2 mt-4 text-xl rounded-xl bg-[#e5e5ff] bg-opacity-100">
						<option value="" >None</option>
						{ sortbyGroups.map((filterType) => (
							<option value={filterType.group}>{filterType.group}</option>
						))}
					</select>
				</div>
				{dbUser && dbUser.role === "breeder" &&
				<div className="absolute size-fit right-0 top-[40px]">
					<Link onMouseEnter={() => setAddTooltip(true)} onMouseLeave={() => setAddTooltip(false)}
						className="relative z-40 size-fit" href="cats/add">
						<div className="w-full bg-gradient-to-b from-white to-navbar-body-1 p-4 rounded-full text-transparent bg-clip-text text-8xl inline-block relative z-40">
							<div className="relative size-fit z-40 transition duration-300 hover:scale-125">
								{/*<Image className="absolute mt-5" alt="o" src="/img/circle.svg" width={96} height={96} />*/}
								{/*<span className=" -translate-x-10 relative z-40">+</span>*/}
								<div className=" ml-10 mr-10">
									<span className=" bg-background-gradient-1 rounded-full text-transparent bg-clip-text text-8xl relative inline-block text-left drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">+</span>
								</div>
							</div>
						</div>
					</Link>

					{/* Tooltip */}
					<div className={"absolute size-[128px] top-[110px] right-[20px] transition duration-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] " + (addTooltip ? " opacity-100" : " opacity-0")}>
						<div className="w-full bg-text-header-0 border-[3px] h-8 rounded-full drop-shadow">
							<p className="flex size-full text-center text-lg text-white justify-center align-middle">Add Cat</p>
						</div>
					</div>
				</div>
				}
			</div>
			<div className="h-6"/>
			<div className="scroll-auto">
				<div className="grid w-full grid-cols-3 p-2 py-20 bg-white dark:bg-gray-500 bg-opacity-100 drop-shadow-lg rounded-xl">
					{/* Populating the list with cats */}
					{filteredResults ? (
						filteredResults.length > 0 ?
							filteredResults.map((cat) => (
								<div className="hover:scale-110 transition duration-300">
									<CatButton cat={cat}/>
								</div>
							))
						:
							<div className="w-full col-span-3 p-4">No cats found with search parameters "{fieldInput}".</div>
					)
					: <div className="p-4">Awaiting cats</div>
					}
				</div>
			</div>
		</div>    
			</div>
		</div>
	</main>
	)
}