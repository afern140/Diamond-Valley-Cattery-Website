"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, React } from "react";
import Dropdown from "@/app/components/dropdown";
import CatButton1 from "@/app/components/catbutton-1";
import cats from "./[cat]/cat.json"

export default function Page() {
    const [fieldInput, setFieldInput] = useState("")
    const [filteredResults, setFilteredResults] = useState([])

    const searchItems = (searchValue) => {
        setFieldInput(searchValue)
        
        if (fieldInput !== "") {
            const filteredData = cats.filter((cat) => { return Object.values(cat).join('').toLowerCase().includes(fieldInput.toLowerCase()) })
            setFilteredResults(filteredData)
        }
        else {
            setFilteredResults(cats)
        }
    }

    {/*  */}
    const [dropdownFilter, setDropdownFilter] = useState("")
    const [dropdownValue, setDropdownValue] = useState("")
    const callback = (value) => {
        setDropdownFilter(value.split(" ")[0]);
        setDropdownValue(value.split(" ")[1]);
        console.log("DropdownValue: " + dropdownValue + "\tDropdownFilter: " + dropdownFilter);
    }

    const clearFilters = () => {
        setDropdownFilter("");
        setDropdownValue("");
        console.log("DropdownValue: " + dropdownValue + "\tDropdownFilter: " + dropdownFilter);
    }
    
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
                   onChange = { (Event) => searchItems(Event.target.value) } />
            
            {/* Insert icon here... */}
        </div>
      </div>

      <div className="flex py-6 w-full justify-center">
        <div className="flex w-4/5">
          {/* First split of the page */}
          <div className=" w-1/3 mr-6 align-middle justify-start flex-col flex items-center">
            <h2 className="py-6 text-2xl font-semibold">Filters</h2>

            <h3 className="py-2 text-lg">Breed</h3>
            <Dropdown queryType="breed" callback={callback} />
            <h3 className="py-2 text-lg">Gender</h3>
            <Dropdown queryType="gender" callback={callback} />
            <h3 className="py-2 text-lg">Age</h3>
            <Dropdown queryType="age" callback={callback}  />
            <h3 className="py-2 text-lg">Color</h3>
            <Dropdown queryType="color" callback={callback}  />

            <button onClick={clearFilters} className=" py-2 px-4 mt-10 bg-slate-300 rounded-xl font-semibold">Clear Filters</button>
          </div>

          {/* Second split of the page */}
          <div className="w-full flex-col">
            <div className="flex">
              <div className=" w-1/4 ml-auto mr-full justify-end flex-col">
                <h2 className="flex justify-end font-bold text-xl">Sort by:</h2>
                <Dropdown />
              </div>
            </div>
            <div className="h-6"/>
            <div className="grid w-full grid-cols-3">
                {/* Populating the list with cats */}
                {
                    fieldInput.length >= 1 ? (
                        filteredResults.map((cat) => (
                            ((cat.name.toLowerCase().includes(fieldInput.toLowerCase())
                            || cat.breed.toLowerCase().includes(fieldInput.toLowerCase()))
                            && (
                                (dropdownFilter === "breed" && cat.breed.toLowerCase().includes(dropdownValue.toLowerCase()))
                                && (dropdownFilter === "gender" && cat.gender.toLowerCase().includes(dropdownValue.toLowerCase()))
                                && (dropdownFilter === "age" && cat.age.toLowerCase().includes(dropdownValue.toLowerCase()))
                                && (dropdownFilter === "color" && cat.color.toLowerCase().includes(dropdownValue.toLowerCase()))
                            )) &&
                                <div>
                                    <CatButton1 id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />
                                </div>
                            )
                        )
                    ) : (
                        cats.map((cat, index) => (
                            <div key={index}>
                                <CatButton1 id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />
                            </div>
                        ))
                    )
                }
              </div>
          </div>  
        </div>
      </div>
    </main>
  )
}