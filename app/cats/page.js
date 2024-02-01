"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./styles.css";
import SearchBox from "@/app/components/searchbox/searchbox";
//import Dropdown from "@/app/components/dropdown/dropdown";
import CatButton1 from "@/app/components/cat_button_1/catbutton-1";
import cats from "./cat/cat.json"

export default function Page() {
    const [fieldInput, setFieldInput]  = useState("")
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
    
  return (
    <main className="w-full flex-col justify-center">
      <div>
        <h1 className="catlist-header">Cats</h1>
        {/* Search Field */}
        <div className="align-middle justify-center flex">
            <input type="text"
                   name="catlist-search"
                   placeholder="Search"
                   className="catslist-search-background"
                   onChange = { (Event) => searchItems(Event.target.value) } />
            
            {/* Insert icon here... */}
        </div>
      </div>

      <div className="flex py-6 w-full justify-center">
        <div className="flex w-4/5">
          {/* First split of the page */}
          <div className=" w-1/3 mr-6 align-middle justify-center flex-col flex items-center">
            <h2 className="py-4 text-2xl">Filters</h2>

            <h3 className="py-2 text-lg">Breed</h3>
            {/*<Dropdown />*/}
            <h3 className="py-2 text-lg">Gender</h3>
            {/*<Dropdown />*/}
            <h3 className="py-2 text-lg">Age</h3>
            {/*<Dropdown />*/}
            <h3 className="py-2 text-lg">Color</h3>
            {/*<Dropdown />*/}
          </div>

          {/* Second split of the page */}
          <div className="w-full flex-col">
            <div className="flex">
              <div className="w-3/5" />
            </div>
            <div className="h-6"/>
            <div className="grid w-full grid-cols-3">
                {/* Populating the list with cats */}
                {
                    fieldInput.length >= 1 ? (
                        filteredResults.map((cat) => (
                            (cat.name.toLowerCase().includes(fieldInput.toLowerCase())
                            || cat.breed.toLowerCase().includes(fieldInput.toLowerCase())) &&
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