"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

import cats from "@/app/cats/[cat]/cat.json"

function LitterButton({ id, name, age, color, eye_color, breed, gender, vaccinations, conditions, fatherID, motherID, children }) {
    const [width, setWidth] = useState(0);

    const [data, setData] = useState(cats);

	const dbdata = React.useContext(ApiDataContext);

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
        }

	}, [dbdata]);

    return (
        <Link href={`/litters/${id}`} className=" w-fit flex justify-start">
        { data ? (
        <button className="flex font-bold p-2 text-black place-items-center">
            <Image
                alt="Kitty_Litter"
                src={ "/img/Kitty_Litter.png"}
                width={width < 1024 ? "200" : "200"}
                height={width < 1024 ? "200" : "200"}
                className="justify-center align-center place-items-center"
                objectFit="contain"/>
            <div className=" pl-4 mb-auto" >
                <p className=" text-left text-3xl">{name}</p>
                <p className=" text-xl font-medium text-left">Date: date</p>
                <p className=" text-xl font-medium text-left">Parents: {data.map((cat, i) => (<span>{motherID === cat.id && "Mother - " + cat.name}</span>))} {data.map((cat, i) => (<span>{fatherID === cat.id && "Father - " + cat.name}</span>))}</p>
                <p className=" text-xl font-medium text-left">Children: {data.map((cat, i) => (<span>{(motherID === cat.motherID || fatherID === cat.fatherID) && cat.name} </span>))}</p>
            </div>
        </button> ) : (<div />) }
        </Link>
    );
  };
export default LitterButton;