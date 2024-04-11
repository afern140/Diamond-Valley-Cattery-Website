"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { getObject, getObjects } from "@/app/_utils/firebase_services";
import Carousel from "@/app/components/LitterCarousel"
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
				<div className="w-4/5 mx-auto">
					<div className="pt-20 flex pb-10">
						<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text">
							<span className="text-6xl pb-10 font-extrabold">{litter.name}</span> <br />
						</div>
					</div>

					<Carousel LitterData = {litter}/>

					{/* Details */}
					<div className="flex flex-col xl:flex-row w-full space-x-0 xl:space-x-6 mx-auto text-xl font-bold text-left text-header-text-0 dark:text-dark-header-text-0">
						<div className="p-10 mx-auto mt-6 rounded-lg bg-white dark:bg-gray-500 drop-shadow-lg min-w-[400px] xl:min-w-[40%] w-fit">
							<h2 className="text-2xl mb-2">Details</h2>
							<h3>Expected Date: <span className="font-normal">{new Date(litter.expDate.toDate()).toISOString().split('T')[0]}</span></h3>
							<h3>Completed: <span className="font-normal">{litter.completed ? "Completed" : "Not Completed"}</span></h3>
						</div>

						<div className="p-10 mx-auto mt-6 rounded-lg bg-white dark:bg-gray-500 drop-shadow-lg min-w-[400px] xl:min-w-[40%] max-w-[80%] w-fit">
							<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
							<p className="font-normal break-words">{litter.description}</p>
						</div>
					</div>

					{/* Parents */}
					<div className=" text-header-text-0 dark:text-dark-header-text-0 text-xl font-bold bg-white dark:bg-gray-500 p-10 mt-10 rounded-xl drop-shadow-lg">
						{ (litter.father || litter.mother) ? (
							<div>
								<h2 className="text-2xl mx-10 mt-10 dark:text-dark-header-text-0">Parents</h2>
								<div className="flex flex-wrap">
									{litter.father &&
									<div className="bg-navbar-body-1 dark:bg-gray-400 drop-shadow-lg p-10 m-10 rounded-lg text-center">
										<CatButton cat={litter.father} />
									</div>}
									{litter.mother &&
									<div className="bg-navbar-body-1 dark:bg-gray-400 drop-shadow-lg p-10 m-10 rounded-lg text-center">
										<CatButton cat={litter.mother} />
									</div>}
								</div>
							</div>
							) : (<h2 className="italic text-gray-400 font-normal">No parents</h2>)
						}
					</div>

					{/* Children */}
					<div className=" text-header-text-0 dark:text-dark-header-text-0 text-xl font-bold bg-white dark:bg-gray-500 p-10 mt-10 rounded-xl drop-shadow-lg">
						{litter.completed && litter.children ? (
							<div className="">
								<h2 className="text-2xl mx-10 mt-10 dark:text-dark-header-text-0">Children</h2>
								<div className="flex flex-wrap">
								{litter.children.map((child, index) => (
										<div className="flex flex-wrap">
											<div key={index} className="bg-navbar-body-1 dark:bg-gray-400 drop-shadow-lg p-10 m-10 rounded-lg text-center">
												<CatButton cat={child} />
											</div>
										</div>
								))}
								</div>
							</div>
							) : (<h2 className="italic text-gray-400 font-normal">No children</h2>)
						}
					</div>

					<div className="w-full flex justify-center">
						<Link className="flex m-auto px-6 py-4 drop-shadow-lg bg-navbar-body-0 dark:bg-gray-600 rounded-xl mt-16 text-2xl hover:scale-105 text-white transition duration-300" href={`./${litter.id}/edit`}>Edit {litter.name}</Link>
					</div>
				</div>
			) : (
				<h1>Error 404: Litter not Found</h1>
			)}
		</main>
	)
}