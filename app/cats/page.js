"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getObjects, getObject } from "../_utils/firebase_services";
import Dropdown from "@/app/components/dropdown";
import CatButton1 from "@/app/components/catbutton-1";

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
			filteredData = filteredData.filter((cat) => Object.values(cat.age).join('').toLowerCase().includes(filters[2].toLowerCase()) );
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

	return (
		<main className="w-full flex-col justify-center text-black text-xl font-normal bg-white">
	<div>
		<div className="flex w-4/5 mx-auto pt-16 pb-8">
			<h1 className=" font-normal text-4xl text-black mx-auto flex">Cats</h1>
			<div className="flex mx-auto right-0 fixed -translate-x-[10vw]">
				<Link href="/addcat" className="m-auto">
				<button className=" bg-cat-gray-1 p-3 rounded-3xl text-white shadow">Add Cat</button>
				</Link>
			</div>
		</div>
		{/* Search Field */}
		<div className="align-middle justify-center flex">
			<input type="text"
				name="catlist-search"
				placeholder="Search"
				className=" border border-black rounded-3xl text-xl pl-4 w-4/5 h-10"
				onChange = { (Event) => searchItems(Event.target.value, "") } />
			
			{/* Insert icon here... */}
		</div>
	</div>

	<div className="flex py-6 w-full justify-center">
		<div className="flex w-4/5">
		{/* First split of the page */}
		<div className=" w-1/3 mr-6 align-middle justify-start flex-col flex items-center">
			<h2 className="py-6 text-2xl font-semibold">Filters</h2>

			<h3 className="py-2 text-lg">Breed</h3>
			<Dropdown queryType="breed" callback={filterItems} cats={cats}/>
			<h3 className="py-2 text-lg">Gender</h3>
			<Dropdown queryType="gender" callback={filterItems} cats={cats}/>
			<h3 className="py-2 text-lg">Age</h3>
			<Dropdown queryType="age" callback={filterItems} cats={cats}/>
			<h3 className="py-2 text-lg">Color</h3>
			<Dropdown queryType="color" callback={filterItems} cats={cats}/>

			<button onClick={clearFilters} className=" py-2 px-4 mt-10 bg-slate-300 rounded-xl font-semibold">Clear Filters</button>
		</div>

		{/* Second split of the page */}
		<div className="w-full flex-col">
			<div className="flex">
			<div className=" w-1/4 ml-auto mr-full justify-end flex-col">
				<h2 className="flex justify-end font-bold text-xl">Sort by:</h2>
				<Dropdown queryType="sort" callback={sortItems} />
			</div>
			</div>
			<div className="h-6"/>
			<div className="grid w-full grid-cols-3">
				{/* Populating the list with cats */}
				{filteredResults ?
				filteredResults.map((cat) => (
					<div>
						<CatButton1 id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />
					</div>
				))
				: "Awaiting cats"
				}
			</div>
		</div>  
		</div>
	</div>
	</main>
	)
}