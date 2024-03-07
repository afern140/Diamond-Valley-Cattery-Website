"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Dropdown from "@/app/components/dropdown";
import CatButton1 from "@/app/components/catbutton-1";
import defaultCats from "./[cat]/cat.json"

//import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

export default function CatList() {
	//Holds data that the page can display. Uses backup data until database is loaded
	const [data, setData] = useState(defaultCats);
	//Holds the list of cats that are currently displayed, after filtering
    const [filteredResults, setFilteredResults] = useState(defaultCats);
	//Search field input
	const [fieldInput, setFieldInput] = useState("");
	//List of filters that are currently applied
	//Order: Breed, Gender, Age, Color
	const [filters, setFilters] = useState(["", "", "", ""]);
	//Sorting method
	const [sortingMethod, setSortingMethod] = useState("");

	//Replaces the cats list with the database data when it is loaded
	const { cats } = React.useContext(ApiDataContext);
	useEffect(() => {
		//console.log("Cat list dbdata updated!")
		//console.log(dbdata);
		setData(cats);
		//Re-run filter to update the list
	}, [cats]);

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
	}, [fieldInput, filters, sortingMethod, data, cats]);
	/*useEffect(() => {
		searchItems("", "");
	}
	, [data]);

    const searchItems = (searchValue, filterValue) => {
      let filteredData = cats;

	  //Overwrite filteredData with dbdata if it exists
	  if (data != null && data != undefined) {
		  filteredData = data;
	  }
      
      if (filterValue === "") { setFieldInput(searchValue.trim()); }

      if (fieldInput !== "") {
        filteredData = filteredData.filter((cat) => Object.values(cat.name).join('').toLowerCase().includes(searchValue.toLowerCase()) );
        console.log("first pass: " + fieldInput);
      }

      if (dropdownValue !== "") {
        if (dropdownFilter === "breed" || breedType !== "") { breedType = dropdownValue;  filteredData.filter((cat) => Object.values(cat.breed).join('').toLowerCase().includes(dropdownValue.toLowerCase())); }
        if (dropdownFilter === "gender" || genderType !== "") { genderType = dropdownValue;  filteredData.filter((cat) => Object.values(cat.gender).join('').toLowerCase().includes(dropdownValue.toLowerCase())); }
        if (dropdownFilter === "age" || ageType !== "") { ageType = dropdownValue;  filteredData.filter((cat) => Object.values(cat.age).join('').toLowerCase().includes(dropdownValue.toLowerCase())); }
        if (dropdownFilter === "color" || colorType !== "") { colorType = dropdownValue;  filteredData.filter((cat) => Object.values(cat.color).join('').toLowerCase().includes(dropdownValue.toLowerCase())); }
        //filteredData = filteredData.filter((cat) => { return Object.values(cat).join('').toLowerCase().includes(dropdownValue.toLowerCase())})
        console.log("second pass: " + dropdownValue + " : " + dropdownFilter);
      }

      if (sortingMethod !== "") {
        if (sortingMethod === "Name") { filteredData.sort((a, b) => a.name > b.name); }
        else if (sortingMethod === "Breed") { filteredData.sort((a, b) => a.breed > b.breed); }
        else if (sortingMethod === "Gender") { filteredData.sort((a, b) => a.gender > b.gender); }
        else if (sortingMethod === "Age") { filteredData.sort((a, b) => a.age - b.age); }
        else if (sortingMethod === "Color") { filteredData.sort((a, b) => a.color > b.color); }
        console.log("third pass: " + sortingMethod);
      }

      setFilteredResults(filteredData);
    }

    const [dropdownFilter, setDropdownFilter] = useState("");
    const [dropdownValue, setDropdownValue] = useState("");
    let breedType;
    let genderType;
    let ageType;
    let colorType;
    const callback = (value) => {
      const split = value.split(" ");
      const filter = split[0];
      const type = split[1];

      if (filter === "sort") { 
        if (type === "None") {
          setSortingMethod("");
        }
        else {
          setSortingMethod(type);
        }
      }
      else {
        setDropdownFilter(filter);
        setDropdownValue(type); 
      }

      searchItems(type, filter);
    }

    const clearFilters = () => {
        setDropdownFilter("");
        setDropdownValue("");

        breedType = "";
        genderType = "";
        ageType = "";
        colorType = "";

        console.log("Cleared filters!");
        searchItems("", "");
    }

    const [sortingMethod, setSortingMethod] = useState("");

    useEffect(() => {

      return () => {
        //clearFilters();
      }
    }, [fieldInput, dropdownValue]);*/

	return (
		<main className="w-full flex-col justify-center text-black text-xl font-normal bg-white">
      <div>
        <div className=" grid grid-flow-col">
          <div className="" />
          <h1 className=" font-normal m-auto text-4xl flex text-center justify-center text-black pt-16 pb-4">Cats</h1>
          <div className="pt-12 flex">
            <Link href="/addcat" className="m-auto">
              <button className=" bg-cat-gray-1 p-3 rounded-3xl text-white">Add Cat</button>
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
            <Dropdown queryType="breed" callback={filterItems} cats={data}/>
            <h3 className="py-2 text-lg">Gender</h3>
            <Dropdown queryType="gender" callback={filterItems} cats={data}/>
            <h3 className="py-2 text-lg">Age</h3>
            <Dropdown queryType="age" callback={filterItems} cats={data}/>
            <h3 className="py-2 text-lg">Color</h3>
            <Dropdown queryType="color" callback={filterItems} cats={data}/>

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