"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Dropdown from "@/app/components/dropdown";
import CatButton from "@/app/components/catbutton-1";
import CatButton_NoTitle from "@/app/components/catbutton-notitle";
import cats from "@/app/cats/[cat]/cat.json"

import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

export default function CatList() {

	const [fieldInput, setFieldInput] = useState("");
    const [filteredResults, setFilteredResults] = useState(cats);
	const [data, setData] = useState(cats);

	const dbdata = React.useContext(ApiDataContext);

	useEffect(() => {
		/*console.log("Cats: ")
		console.log(cats);
		console.log("dbdata: ");
		console.log(dbdata);*/
		console.log("Cat list dbdata updated!")
		console.log(dbdata);
		setData(dbdata);
		//Re-run filter to update the list
	}, [dbdata]);

	useEffect(() => {
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

    {/*  */}
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
    }, [fieldInput, dropdownValue]);

	return (
		<main className="w-full flex-col justify-center text-black text-xl font-normal bg-white">
      <div>
          <h1 className=" font-normal m-auto text-4xl flex text-center justify-center text-black pt-16 pb-4">Add Cat</h1>
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
            <h2 className="py-6 text-2xl font-semibold">Parameters</h2>

            <h3 className="py-2 text-lg">Name</h3>
            <Dropdown queryType="breed" callback={callback} />
            <h3 className="py-2 text-lg">Breed</h3>
            <Dropdown queryType="breed" callback={callback} />
            <h3 className="py-2 text-lg">Gender</h3>
            <Dropdown queryType="gender" callback={callback} />
            <h3 className="py-2 text-lg">Age</h3>
            <Dropdown queryType="age" callback={callback} />
            <h3 className="py-2 text-lg">Color</h3>
            <Dropdown queryType="color" callback={callback} />

            <h2 className="py-6 text-2xl font-semibold">Medical</h2>
            <h3 className="py-2 text-lg">Conditions</h3>
            <Dropdown queryType="color" callback={callback} />
            <h3 className="py-2 text-lg">Vaccinations</h3>
            <Dropdown queryType="color" callback={callback} />

            <h2 className="py-6 text-2xl font-semibold">Notes</h2>
            <div className="align-top justify-start mx-autoflex">
                <textarea type="text"
                    name="catlist-search"
                    placeholder="Write notes here..."
                    className=" border placeholder:italic pt-2 -mr-2 pr-2 border-black rounded-xl text-xl pl-4 m-auto min-h-48 h-10 text-start" />
                
                {/* Insert icon here... */}
            </div>

            <button onClick={clearFilters} className=" py-2 px-4 mt-10 bg-slate-300 rounded-xl font-semibold">Clear Filters</button>
          </div>

          {/* Second split of the page */}
          <div className="w-full flex-col">
            <h2 className="flex py-6 justify-center font-bold text-2xl">Images</h2>
            <div className="h-6"/>
            <div className="grid border border-black w-full grid-cols-3">
                {/* Populating the list with cats */}
                {
                filteredResults.map((cat, i) => (
                    <div>
                        {(i <= 3) && <CatButton_NoTitle id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />}
                    </div>
                ))
                }
            </div>

            <h2 className="flex py-6 justify-center font-bold text-2xl">Lineage</h2>
            <h3 className="flex justify-center font-bold text-xl">Parents</h3>
            <div className="h-2"/>
            <div className="border border-black w-full">
                <div className="align-middle flex justify-center p-2">
                <input type="text"
                    name="catlist-search"
                    placeholder="Search"
                    className=" border border-black rounded-3xl text-xl pl-4 w-full h-10" />
                
                {/* Insert icon here... */}
                </div>
                <div className="grid grid-cols-3">
                {/* Populating the list with cats */}
                {
                filteredResults.map((cat, i) => (
                    <div>
                        {(i <= 2) && <CatButton id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />}
                    </div>
                ))
                }
                </div>
            </div>
            <div className="h-6"/>
            <h3 className="flex justify-center font-bold text-xl">Parents</h3>
            <div className="h-2"/>
            <div className="border border-black w-full">
                <div className="align-middle flex justify-center p-2">
                <input type="text"
                    name="catlist-search"
                    placeholder="Search"
                    className=" border border-black rounded-3xl text-xl pl-4 w-full h-10" />
                
                {/* Insert icon here... */}
                </div>
                <div className="grid grid-cols-3">
                {/* Populating the list with cats */}
                {
                filteredResults.map((cat, i) => (
                    <div>
                        {(i <= 2) && <CatButton id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />}
                    </div>
                ))
                }
                </div>
            </div>
            
            <div className="h-4" />
            <div className="flex justify-end"><button className="flex justify-center bg-cat-gray-1 text-white py-3 px-5 rounded-xl">Submit</button></div>
        </div>
        </div>
      </div>
    </main>
	)
}