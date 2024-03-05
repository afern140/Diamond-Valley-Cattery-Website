"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

import cats from "@/app/cats/[cat]/cat.json"

function LitterButton({ id, name, age, color, eye_color, breed, gender, vaccinations, conditions, fatherID, motherID, children }) {
    const [width, setWidth] = useState(0);

    const [filteredResults, setFilteredResults] = useState(cats);
    const [data, setData] = useState(cats);

	const dbdata = React.useContext(ApiDataContext);

    const findWithSpread = function(map, book) {
        return [...map.values()].find(entry => entry.elements.books.includes(book));
        //return Array.from(map.values()).find(...);
    }

    let motherName = "";
    let fatherName = "";

	useEffect(() => {
		console.log(dbdata);
		setData(dbdata);
		//Re-run filter to update the list

        //Overwrite filteredData with dbdata if it exists
        if (data != null && data != undefined) {
            
            data.map((cat, index) => {
                motherName = (motherID === index) ? cat.name : "m_placeholder";
            })

            data.map((cat, index) => {
                fatherName = (fatherID === index) ? cat.name : "f_placeholder";
            })

            setFilteredResults(data);
        }

	}, [dbdata]);

    return (
        <Link href={`/cats/${id}`} className="w-full flex justify-center">
        <button className="flex font-bold p-2 text-black place-items-center">
            <Image
                alt="Kitty_Litter"
                src={ "/img/Kitty_Litter.png"}
                width={width < 1024 ? "200" : "200"}
                height={width < 1024 ? "200" : "200"}
                className="justify-center align-center place-items-center"
                objectFit="contain"/>
            <div className=" pl-4 bg-red-200 mb-auto" >
                <p className=" text-left text-3xl">{name}</p>
                <p className=" text-xl font-medium text-left">Date: date</p>
                <p className=" text-xl font-medium text-left">Parents: {filteredResults.map((cat, index) => (<span>{motherID === index && "Mother - " + cat.name}</span>))} {filteredResults.map((cat, index) => (<span>{fatherID === index && "Father - " + cat.name}</span>))}</p>
                <p className=" text-xl font-medium text-left">Children: {filteredResults.map((cat, index) => (<span>{(motherID === cat.motherID || fatherID === cat.fatherID) && cat.name} </span>))}</p>
            </div>
        </button>
        </Link>
    );
  };
export default LitterButton;