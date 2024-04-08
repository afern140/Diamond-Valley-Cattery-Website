"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getObjects, getObject } from "../_utils/firebase_services";
import Dropdown from "@/app/components/dropdown";
import CatButton from "@/app/components/cats/catbutton";
import BackButton from "@/app/components/BackToTopButton"
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
	//Holds data that the page can display. Uses backup data until database is loaded
	const [cats, setCats] = useState();
	//Holds the list of cats that are currently displayed, after filtering
	const [filteredResults, setFilteredResults] = useState();
	//Search field input
	const [fieldInput, setFieldInput] = useState("");
	//List of filters that are currently applied
	//Order: Breed, Gender, Age, Color
	const [filters, setFilters] = useState(["", "", "", ""]);
	//Sorting method
	const [sortingMethod, setSortingMethod] = useState("");

	//Replaces the cats list with the database data when it is loaded
	useEffect(() => {
		const fetchCats = async () => {
			const cats = await getObjects('cats');
			setCats(cats);
		};
		fetchCats();
	}, []);

	//Search field handler
	const searchItems = (value) => {
		setFieldInput(value);
		setActiveAutocomplete(true);
	}

	//Filter handler
	const filterItems = (value) => {
		//const filter = event.target.value;
		//const type = event.target.name;
		const split = value.split(" ");
		const type = split[0];
		const filter = split[1];
		//Convert type into filter index based on name
		let index = 0;
		switch (type) {
			case "breed":
				index = 0;
				console.log("Breed filter");
				break;
			case "gender":
				index = 1;
				break;
			case "age":
				index = 2;
				break;
			case "color":
				index = 3;
				break;
		}
		//const newFilters = filters;
		//newFilters[index] = filter;
		let newFilters = [...filters];
		newFilters[index] = filter;
		setFilters(newFilters);
		console.log("Filter: " + filter + " Type: " + type);
		console.log(filters);
	}

	//Clear filters
	const clearFilters = () => {
		setFilters(["", "", "", ""]);
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
	}, [fieldInput, filters, sortingMethod, cats]);

	// Tooltips
	const [addTooltip, setAddTooltip] = useState(false);
	const [activeAutocomplete, setActiveAutocomplete] = useState(false);

	function completeAutocomplete(field) {
		setActiveAutocomplete(false);
		setFieldInput(field);
	}

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

			<div>
				{/* Search Field */}
				<div className="align-middle justify-center flex translate-x-6">
					<input type="text"
						name="catlist-search"
						placeholder="Search"
						value={fieldInput}
						className=" bg-[#e5e5ff] bg-opacity-50 dark:bg-gray-300 dark:bg-opacity-100 placeholder-text-header-0 shadow drop-shadow-lg rounded-3xl text-xl pl-4 w-4/5 h-10"
						onChange = { (Event) => searchItems(Event.target.value, "") }>
					</input>
					
					<Image className="relative -translate-x-12" alt="Search..." src="/img/search-icon.svg" width={30} height={30} />
				</div>
				{ filteredResults && filteredResults.length > 0 && fieldInput.length > 0 && activeAutocomplete ? 
					<div className="absolute z-50 bg-gray-100 bg-opacity-100 border-2 placeholder-text-header-0 shadow rounded-3xl text-xl w-4/5 justify-center flex-col m-auto left-[10%] translate-x-2 translate-y-1 overflow-hidden">
						{
							filteredResults.map((cat) => (
								<button className="w-full text-left h-10 hover:bg-white pl-4" onClick={() => completeAutocomplete(cat.name)}>{cat.name}</button>
							))
						}
					</div> : <div />
				}
			</div>

	<div className="flex py-6 w-full justify-center">
		<div className="flex w-full">
		{/* First split of the page */}
		<div className=" w-1/3 mr-6 ml-20 align-middle justify-start flex-col flex items-center relative z-20">
			<div className="p-6 w-full text-text-header-0 rounded-xl relative -z-20 bg-white dark:bg-gray-500  drop-shadow-lg">
				<h2 className="py-6 text-2xl font-semibold text-center drop-shadow-md">Filters</h2>
				<h3 className="py-2 text-lg">Breed</h3>
				<Dropdown queryType="breed" callback={filterItems} cats={cats} isInsidePanel={true}/>
				<h3 className="py-2 text-lg">Gender</h3>
				<Dropdown queryType="gender" callback={filterItems} cats={cats} isInsidePanel={true}/>
				<h3 className="py-2 text-lg">Age</h3>
				<Dropdown queryType="age" callback={filterItems} cats={cats} isInsidePanel={true}/>
				<h3 className="py-2 text-lg">Color</h3>
				<Dropdown queryType="color" callback={filterItems} cats={cats} isInsidePanel={true}/>

				<div className="w-fit z-10">
					<button onClick={clearFilters} className=" py-2 z-10 relative px-4 mt-10 bg-background-gradient-1 drop-shadow-lg text-text-header-0 rounded-xl font-semibold">Clear Filters</button>
					{/*<div className="p-4 bg-yellow-700 rounded-xl absolute h-10 -translate-y-[36px] -z-10 w-full" />*/}
				</div>
			</div>
		</div>

		{/* Second split of the page */}
		<div className="w-full flex-col mr-16">
			<div className="flex w-full">
				<div className=" w-full justify-end flex-col bg-white dark:bg-gray-500 rounded-xl p-4 drop-shadow-lg">
					<h2 className="flex justify-start font-bold text-xl text-text-header-0 drop-shadow-md">Sort by:</h2>
					<div className=" pt-4">
						<Dropdown queryType="sort" callback={sortItems} isInsidePanel={true}/>
					</div>
				</div>
				<div className="relative ">
					<Link onMouseEnter={() => setAddTooltip(true)} onMouseLeave={() => setAddTooltip(false)}
						className="relative z-40 size-fit" href="/add">
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
			</div>
			<div className="h-6"/>
			<div className="scroll-auto">
				<div className="grid w-full grid-cols-3 bg-white dark:bg-gray-500 bg-opacity-100 drop-shadow-lg rounded-xl">
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