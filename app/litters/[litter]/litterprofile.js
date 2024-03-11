"use client"

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import cats from "./cat"

import { useRouter } from 'next/navigation'
import Carousel from "@/app/components/carousel"
import CatButton from "@/app/components/catbutton-1"

import ApiDataContext from '@/app/_utils/api_context';

export default function LitterProfile({params}) {

	const [selectedLitter, setSelectedLitter] = useState(cats[parseInt(params.cat)]);
	const router = useRouter();
	const data = router.query;

	const dbdata = React.useContext(ApiDataContext);
	const [litterData, setLitterData] = useState([]);

	useEffect(() => {
		setLitterData(dbdata.litters);
	}, [dbdata]);

	useEffect(() => {
		if (litterData != null && litterData != undefined)
		{
			//Select cat with id that matches params
			const litter = litterData.find(litter => litter.id === parseInt(params.litter));
			setSelectedLitter(litter);
			//if (litter) { console.log(returnDate(litter.expDate)); }
		}
	}, [litterData]);

	function returnDate(expected_date) {
		const date = new Date(expected_date.seconds);
		const sp = date.toUTCString().split(" ");
		return sp[1].concat(" ", sp[2], " ", sp[3]);
	}


	return(
		<main className="bg-gray-100">
			{selectedLitter ? (
				<section>
					<h1 className="text-black text-4xl text-center font-bold pt-8 pb-4">{selectedLitter.name}</h1>
					<Carousel />
					<div className="flex flex-row">
						<div className="flex flex-col text-black text-xl font-bold text-left">
							<div className="p-10 mx-10 mt-6 rounded-lg min-w-64">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Expected Date: <span className="font-normal">{returnDate(selectedLitter.expDate)}</span></h3>
								<h3>Parent 1: <span className="font-normal">{litterData.map((cat, i) => (<span> {(cat.id === selectedLitter.motherID) && <span>{cat.name}</span> } </span>))}</span></h3>
								<h3>Parent 2: <span className="font-normal">{litterData.map((cat, i) => (<span> {(cat.id === selectedLitter.fatherID) && <span>{cat.name}</span> } </span>))}</span></h3>
								<div className="mt-6"/>
								<h3>Notes: <span className="font-normal">{selectedLitter.notes}</span></h3>
							</div>
						</div>
						<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
							<h2>Want to Purchase {selectedLitter.name}?</h2>
							<Link href={"/chat"}><button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md">Request a Meeting</button></Link>
						</div>
					</div>
					<div className="text-black text-xl font-bold px-10 pb-10">
						<h2 className="text-2xl mx-10 mt-6">Kittens</h2>
						<div className="flex flex-wrap">
							{
								litterData.map((cat, i) => (
									<div>
										{(cat.motherID === selectedLitter.id || cat.fatherID === selectedLitter.id) && <CatButton id={cat.id} name={cat.name} age={cat.age} color={cat.color} eye_color={cat.eye_color} breed={cat.breed} gender={cat.gender} vaccinations={cat.vaccinations} conditions={cat.conditions} fatherID={cat.fatherID} motherID={cat.motherID} children={cat.children} />}
									</div>
								))
							}
						</div>
					</div>
				</section>
			) : (
				<h1 className="text-black text-3xl text-center font-bold p-5">Error 404: Cat Not Found.</h1>
			)}
		</main>
	)
}