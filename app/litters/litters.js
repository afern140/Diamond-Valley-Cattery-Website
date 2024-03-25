"use client"

import React, { useState, useEffect } from "react";
import Dropdown from "@/app/components/dropdown";
import LitterButton from "@/app/components/litterbutton_wrapper";
//import cats from "@/app/cats/[cat]/cat.json"
cats = "";

import ApiDataProvider from '@/app/_utils/api_provider';
import ApiDataContext from '@/app/_utils/api_context';

import { db } from "../_utils/firebase";
import { getDoc } from "firebase/firestore";

export default function Litters() {

	const [fieldInput, setFieldInput] = useState("");
  const [filteredResults, setFilteredResults] = useState(cats);
	const [data, setData] = useState(cats);

	const dbdata = React.useContext(ApiDataContext);

	useEffect(() => {
    //console.log(dbdata);
		setData(dbdata.litters);
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
        console.log("second pass: " + {dropdownValue} + " : " + dropdownFilter);
      }

      if (sortingMethod !== "") {
        if (sortingMethod === "Name") { filteredData.sort(function(a, b){ return a.name > b.name ? 1 : -1; }); }
        else if (sortingMethod === "Breed") { filteredData.sort(function(a, b){ return a.breed > b.breed ? 1 : -1; }); }
        else if (sortingMethod === "Gender") { filteredData.sort(function(a, b){ return a.gender > b.gender ? 1 : -1; }); }
        else if (sortingMethod === "Age") { filteredData.sort(function(a, b){ return a.age > b.age ? 1 : -1; }); }
        else if (sortingMethod === "Color") { filteredData.sort(function(a, b){ return a.color > b.color ? 1 : -1; }); }
        console.log("third pass: " + sortingMethod);
      }

      setFilteredResults(filteredData);
      //console.log(filteredResults);
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

    const [sortingMethod, setSortingMethod] = useState("");

    
    function populateList() {
      return filteredResults.map((litter, i) => 
          (typeof litter.id === "string" || litter.id instanceof String) && 
          (<div>
            <LitterButton id={litter.id} />
          </div>)
      )
    }

    useEffect(() => {
      populateList();
    }, [filteredResults])

	return (
		<main className="w-full flex-col justify-center text-black text-xl font-normal bg-white">
      <div>
        <div className=" grid grid-flow-col">
          <h1 className=" font-bold m-auto text-4xl flex text-center justify-center text-black pt-16 pb-4">Litters</h1>
        </div>
      </div>

      <div className="flex py-6 w-full justify-center">
        <div className="flex w-4/5">

          {/* Litter List */}
          <div className="w-full flex-col">
            <div className="flex">
              <div className=" min-w-72 mr-auto ml-full justify-start flex-col">
                <h2 className="flex justify-start font-bold text-xl">Sort by:</h2>
                <Dropdown queryType="sort" callback={callback} />
              </div>
            </div>
            <div className="h-6"/>
            <div className="flex-col">
                {/* Populating the list with cats */}
                {
                  (data !== null && data !== undefined) && populateList()
                }
              </div>
          </div>  
        </div>
      </div>
    </main>
	)
}