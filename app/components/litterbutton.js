"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

import cats from "@/app/cats/[cat]/cat.json"

function LitterButton({ id, name, expDate, fatherID, motherID, notes, breed, gender, age, color, imgURL }) {
    const [width, setWidth] = useState(0);

    const [data, setData] = useState(cats);

	const dbdata = React.useContext(ApiDataContext);

    let motherName = "";
    let fatherName = "";
    let date = "";

	useEffect(() => {
		setData(dbdata.litters);
	}, [dbdata]);

    function returnDate(expected_date) {
        if (expected_date === undefined) { return "No Date"; }
        //console.log("Date: " + new Date(expected_date.seconds * 1000));

        // The 'Date' Object works with miliseconds, so we convert it by multiplying by 1000
		const date = new Date(expected_date.seconds * 1000);
		const sp = date.toUTCString().split(" ");
		return sp[1].concat(" ", sp[2], " ", sp[3]);
	}


    return (
        <Link href={`/litters/${id}`} className=" w-fit flex justify-start">
        { data ? (
        <button className="flex font-bold p-2 text-black place-items-center">
            <Image
                alt="Kitty_Litter"
                src={ imgURL ? imgURL : "/img/Kitty_Litter.png" }
                width="200"
                height="200"
                style={{objectFit: "cover"}}
                className="justify-center align-center place-items-center"/>
            <div className=" pl-4 mb-auto" >
                <p className=" text-left text-3xl">{name}</p>
                <p className=" text-xl font-medium text-left">Date: {returnDate(expDate)}</p>
                <p className=" text-xl font-medium text-left">Parents: {data.map((cat, i) => (<span>{motherID === cat.id && "Mother - " + cat.name}</span>))} {data.map((cat, i) => (<span>{fatherID === cat.id && "Father - " + cat.name}</span>))}</p>
                <p className=" text-xl font-medium text-left">Children: {data.map((cat, i) => (<span>{(id === cat.motherID || id === cat.fatherID) && cat.name} </span>))}</p>
            </div>
        </button> ) : (<div />) }
        </Link>
    );
  };
export default LitterButton;