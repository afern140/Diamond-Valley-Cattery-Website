"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { getObject, getObjects } from "@/app/_utils/firebase_services";
import Carousel from "@/app/components/carousel"
import CatButton from "@/app/components/cats/catbutton";
import CatSelection from "@/app/components/cats/cat-selection";

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({ params }) {
	const [litter, setLitter] = useState();

	useEffect(() => {
		const fetchLitter = async () => {
			const litter = await getObject('litters', parseInt(params.litter));
			if (litter.mother) {
				const mother = await getDoc(litter.mother);
				litter.mother = mother.data();
			} else {
				litter.mother = null;
			}
			if (litter.father) {
				const father = await getDoc(litter.father);
				litter.father = father.data();
			} else {
				litter.father = null;
			}
			if (litter.children) {
				const children = await Promise.all(litter.children.map(async (childRef) => {
					const child = await getDoc(childRef)
					return { docId: childRef.id, ...child.data()};
				}));
				litter.children = children;
			} else {
				litter.children = null;
			}
			setLitter(litter);
		};
		fetchLitter();
	}, [params]);

	return (
		<main className=" text-[#092C48] size-full relative pb-16">
			<BackgroundUnderlay />
			{litter ? (
				<div>
					<div className="pt-20 flex pb-10">
						<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text">
							<span className="text-6xl pb-10 font-extrabold">{litter.name}</span> <br />
						</div>
					</div>

					<Carousel/>

					<div className="flex w-full">
						<div className="p-10 mx-10 mt-6 rounded-lg w-1/3 min-w-64 bg-white text-[#092C48] drop-shadow-lg">
							<h2 className="text-2xl mb-2">Details</h2>
							<h3>Expected Date: <span className="font-normal">{new Date(litter.expDate.toDate()).toISOString().split('T')[0]}</span></h3>
							<h3>Completed: <span className="font-normal">{litter.completed ? "Completed" : "Not Completed"}</span></h3>
						</div>

						<div className="p-10 mx-10 mt-6 rounded-lg w-1/3 min-w-64 bg-white drop-shadow-lg text-[#092C48]">
							<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
							<p className="font-normal">{litter.description}</p>
						</div>
					</div>

					<div className="text-black text-xl font-bold p-10">
						<h2 className="text-2xl mx-10 mt-10 dark:text-dark-header-text-0">Parents</h2>
						<div className="flex flex-wrap">
							<div className="bg-[#e5e5ff] drop-shadow-lg p-10 m-10 rounded-lg text-center">
								<CatButton cat={litter.father} />
							</div>
							<div className="bg-[#e5e5ff] drop-shadow-lg p-10 m-10 rounded-lg text-center">
								<CatButton cat={litter.mother} />
							</div>
						</div>
						{litter.completed && litter.children ? (
							litter.children.map((child, index) => (
								<div>
									<h2 className="text-2xl mx-10 mt-10 dark:text-dark-header-text-0">Children</h2>
									<div className="flex flex-wrap">
										<div key={index} className="bg-[#e5e5ff] drop-shadow-lg p-10 m-10 rounded-lg text-center">
											<CatButton cat={child} />
										</div>
									</div>
								</div>
							))) : null
						}
					</div>

					<div className="w-full flex justify-center">
						<Link className=" flex justify-center m-auto px-4 py-2 text-2xl text-[#092C48] rounded-xl bg-white drop-shadow-lg" href={`./${litter.id}/edit`}>Edit {litter.name}</Link>
					</div>
				</div>
			) : (
				<h1>Error 404: Litter not Found</h1>
			)}
		</main>
	)
}