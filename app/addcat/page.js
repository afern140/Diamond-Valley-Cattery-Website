"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Dropdown from "@/app/components/dropdown";
import CatButton from "@/app/components/catbutton-1";
import CatButton_NoTitle from "@/app/components/catbutton-notitle";
import cats from "@/app/cats/[cat]/cat.json"

import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export default function CatList() {

	const [fieldInput_parents, setFieldInput_parents] = useState("");
	const [fieldInput_children, setFieldInput_children] = useState("");
  const [filteredResults, setFilteredResults] = useState(cats);
  const [filteredResults_parents, setFilteredResults_parents] = useState(cats);
  const [filteredResults_children, setFilteredResults_children] = useState(cats);
	const [data, setData] = useState(cats);

	const dbdata = React.useContext(ApiDataContext);

	const handleSubmit = (event) => {
		event.preventDefault();
		const emptyFields = [];
		const form = event.target;
		if (form.name.value === "") emptyFields.push("name");
		if (form.age.value === "") emptyFields.push("age");
		if (form.color.value === "") emptyFields.push("color");
		if (form.eye_color.value === "") emptyFields.push("eye_color");
		if (form.breed.value === "") emptyFields.push("breed");
		if (form.gender.value === "") emptyFields.push("gender");

		if (emptyFields.length > 0) 
			alert(
				`Please fill in the following fields: ${emptyFields.join(", ")}`
			);
		else {
			alert("Added " + form.name.value + " the " + form.color.value + " " + form.breed.value + "!");
			
			//Add to database
			const catListRef = collection(db, "cats");
			const docRef = addDoc(catListRef, {
				name: form.name.value,
				age: form.age.value,
				color: form.color.value,
				eye_color: form.eye_color.value,
				breed: form.breed.value,
				gender: form.gender.value,
				vaccinations: form.vaccinations.value,
				conditions: form.conditions.value,
				//Randomly assign parents for now
				motherID: Math.floor(Math.random() * 30),
				fatherID: Math.floor(Math.random() * 30)
			});
			}
	}

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
		searchItems_parents("", "");
	}
	, [data]);

    const searchItems_parents = (searchValue, filterValue) => {
    let filteredData_parents = cats;

	  //Overwrite filteredData with dbdata if it exists
	  if (data != null && data != undefined) {
		  filteredData_parents = data;
	  }
      
      if (filterValue === "") { setFieldInput_parents(searchValue.trim()); }

      if (fieldInput_parents !== "") {
        filteredData_parents = filteredData_parents.filter((cat) => Object.values(cat.name).join('').toLowerCase().includes(searchValue.toLowerCase()) );
        console.log("first pass (parents): " + fieldInput_parents);
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

      setFilteredResults_parents(filteredData_parents);
    }

    const searchItems_children = (searchValue, filterValue) => {
      let filteredData_children = cats;
  
      //Overwrite filteredData with dbdata if it exists
      if (data != null && data != undefined) {
        filteredData_children = data;
      }
        
        if (filterValue === "") { setFieldInput_children(searchValue.trim()); }
  
        if (fieldInput_children !== "") {
          filteredData_children = filteredData_children.filter((cat) => Object.values(cat.name).join('').toLowerCase().includes(searchValue.toLowerCase()) );
          console.log("first pass (children): " + fieldInput_children);
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
  
        setFilteredResults_children(filteredData_children);
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

      searchItems_parents(type, filter);
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

	return (
		<main className="w-full flex-col justify-center text-black text-xl font-normal bg-white">
      <div>
          <h1 className=" font-normal m-auto text-4xl flex text-center justify-center text-black pt-16 pb-4">Add Cat</h1>
        {/* Search Field */}
      </div>

      <div className="flex py-6 w-full justify-center">
        <div className="flex w-4/5">
		
          {/* First split of the page */}
          <div className=" w-1/3 mr-6 align-middle justify-start flex-col flex items-center">
		  <form onSubmit={handleSubmit}>
            <h2 className="py-6 text-2xl font-semibold">Parameters</h2>

			
            <h3 className="py-2 text-lg">Name</h3>
            <input type="text" name="name" placeholder="Name" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

            <h3 className="py-2 text-lg">Breed</h3>
            <input type="text" name="breed" placeholder="Breed" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

            <h3 className="py-2 text-lg">Gender</h3>
            <input type="text" name="gender" placeholder="Gender" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />
			
            <h3 className="py-2 text-lg">Age</h3>
            <input type="text" name="age" placeholder="Age" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

            <h3 className="py-2 text-lg">Color</h3>
            <input type="text" name="color" placeholder="Color" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

			<h3 className="py-2 text-lg">Eye Color</h3>
			<input type="text" name="eye_color" placeholder="Eye Color" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

            <h2 className="py-6 text-2xl font-semibold">Medical</h2>
            <h3 className="py-2 text-lg">Conditions</h3>
            <input type="text" name="conditions" placeholder="Conditions" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />
            <h3 className="py-2 text-lg">Vaccinations</h3>
            <input type="text" name="vaccinations" placeholder="Vaccinations" className="border border-black rounded-xl text-xl pl-4 w-full h-10" />

            <h2 className="py-6 text-2xl font-semibold">Notes</h2>
            <div className="align-top justify-start mx-autoflex">
                <textarea type="text"
                    name="catlist-search"
                    placeholder="Write notes here..."
                    className=" border placeholder:italic pt-2 -mr-2 pr-2 border-black rounded-xl text-xl pl-4 m-auto min-h-48 h-10 text-start" />
                
                {/* Insert icon here... */}
				{/* ^ What? */}
            </div>
			<button className="flex justify-center bg-cat-gray-1 text-white py-3 px-5 rounded-xl">Submit</button>
			</form>
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
                    className=" border border-black rounded-3xl text-xl pl-4 w-full h-10"
                    onChange = { (Event) => searchItems_parents(Event.target.value, "") } />
                {/* Insert icon here... */}
                </div>
                <div className="grid grid-cols-3">
                {/* Populating the list with cats */}
                {
                filteredResults_parents.map((cat, i) => (
                    <div>
                        {(i <= 2) && <CatButton id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />}
                    </div>
                ))
                }
                </div>
            </div>
            <div className="h-6"/>
            <h3 className="flex justify-center font-bold text-xl">Children</h3>
            <div className="h-2"/>
            <div className="border border-black w-full">
                <div className="align-middle flex justify-center p-2">
                <input type="text"
                    name="catlist-search"
                    placeholder="Search"
                    className=" border border-black rounded-3xl text-xl pl-4 w-full h-10"
                    onChange = { (Event) => searchItems_children(Event.target.value, "") } />
                
                {/* Insert icon here... */}
                </div>
                <div className="grid grid-cols-3">
                {/* Populating the list with cats */}
                {
                filteredResults_children.map((cat, i) => (
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