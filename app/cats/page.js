"use client"

import { useState, useEffect, React } from "react";
import Dropdown from "@/app/components/dropdown";
import CatButton1 from "@/app/components/catbutton-1";
import cats from "./[cat]/cat.json"

export default function Page() {
    const [fieldInput, setFieldInput] = useState("");
    const [filteredResults, setFilteredResults] = useState(cats);

    const searchItems = (searchValue, filterValue) => {
      let filteredData = cats;
      
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
        <h1 className=" font-normal text-4xl flex text-center justify-center text-black pt-16 pb-4">Cats</h1>
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
        <div className="flex w-4/5 md:flex-row flex-col gap-4">
          {/* First split of the page */}
          <div className="align-middle justify-start flex-col flex items-center min-w-[200px]">
            <h2 className="py-6 text-2xl font-semibold">Filters</h2>

            <h3 className="py-2 text-lg">Breed</h3>
            <Dropdown queryType="breed" callback={callback} />
            <h3 className="py-2 text-lg">Gender</h3>
            <Dropdown queryType="gender" callback={callback} />
            <h3 className="py-2 text-lg">Age</h3>
            <Dropdown queryType="age" callback={callback} />
            <h3 className="py-2 text-lg">Color</h3>
            <Dropdown queryType="color" callback={callback} />

            <button onClick={clearFilters} className=" py-2 px-4 mt-10 bg-slate-300 rounded-xl font-semibold">Clear Filters</button>
          </div>

          {/* Second split of the page */}
          <div className="w-full flex-col">
            <div className="flex w-full md:justify-end">
              <div className=" flex flex-col md:w-[300px] w-full">
                <h2 className="flex font-bold text-xl md:justify-end justify-start">Sort by:</h2>
                <Dropdown queryType="sort" callback={callback} />
              </div>
            </div>
            <div className="h-6"/>
            <div className="grid w-full md:grid-cols-3 grid-cols-3 gap-2">
                {/* Populating the list with cats */}
                {
                  filteredResults.map((cat) => (
                    <div>
                        <CatButton1 id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />
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