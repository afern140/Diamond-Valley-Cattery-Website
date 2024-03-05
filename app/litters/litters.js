"use client"

import React, { useState, useEffect } from "react";
import Dropdown from "@/app/components/dropdown";
import LitterButton from "@/app/components/litterbutton_wrapper";
import cats from "@/app/cats/[cat]/cat.json"

import ApiDataProvider from '@/app/_utils/api_provider';
import ApiDataContext from '@/app/_utils/api_context';

export default function Litters() {

	const [fieldInput, setFieldInput] = useState("");
    const [filteredResults, setFilteredResults] = useState(cats);
	const [data, setData] = useState(cats);

	const dbdata = React.useContext(ApiDataContext);

	useEffect(() => {
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
            <div className="bg-red-100">
                {/* Populating the list with cats */}
                {
                  filteredResults.map((cat) => (
                    
                    <div>
                        <LitterButton id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />
                    </div>
                  ))
                }
              </div>
          </div>  
        </div>
      </div>
    </main>
	)
}