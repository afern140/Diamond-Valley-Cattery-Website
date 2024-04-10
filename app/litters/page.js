"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getObject, getObjects } from "../_utils/firebase_services"
import { getDoc } from "firebase/firestore"
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
	const [litters, setLitters] = useState([]);
	const [sortBy, setSortBy] = useState("name");

	useEffect(() => {
		const fetchLitters = async () => {
			const litters = await getObjects('litters');
			const updatedLitters = await Promise.all(litters.map(async (litter) => {
				if (litter.mother) {
					const mother = await getDoc(litter.mother)
					litter.mother = { docId: litter.mother.id, ... mother.data() }
				}
				if (litter.father) {
					const father = await getDoc(litter.father)
					litter.father = { docId: litter.father.id, ... father.data() }
				}
				if (litter.children) {
					const children = await Promise.all(litter.children.map(async (childRef) => {
						const child = await getDoc(childRef)
						return { docId: childRef.id, ...child.data()};
					}));
					litter.children = children;
				}
				return litter;
			}));
			setLitters(updatedLitters);
		};
		fetchLitters();
	}, []);

	const handleSortChange = (event) => {
		setSortBy(event.target.value);
	};

	const sortedLitters = [...litters].sort((a, b) => {
		if (sortBy === "name") {
			return a.name.localeCompare(b.name);
		} else if (sortBy === "expDate") {
			return a.expDate - b.expDate;
		}
		return 0;
	});

	return (
		<main className="relative text-black pb-16">
			<BackgroundUnderlay />

			<div className="relative w-4/5 mx-auto">
				<div className="pt-20 flex pb-10">
					<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
						<span className="text-6xl pb-10 font-extrabold">Litters</span> <br />
					</div>
				</div>
				{ // Add breeder conditional rendering here 
				<div className=" absolute right-4 top-16">
					<Link href="litters/add"><span className=" bg-background-gradient-1 rounded-full transition duration-300 hover:scale-125 text-transparent bg-clip-text text-8xl relative inline-block text-left drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">+</span></Link>
				</div>
				}
			</div>

			<div className=" w-4/5 mx-auto mt-10">
				
				<div className="rounded-xl m-5 p-4 bg-white drop-shadow-lg w-fit mr-full ml-auto">
					<label htmlFor="sort">Sort By:</label> <br/>
					<select id="sort" value={sortBy} onChange={handleSortChange} className="ml-2 p-2 bg-navbar-body-1 rounded-xl drop-shadow-lg">
						<option value="name">Name</option>
						<option value="expDate">Expected Date</option>
					</select>
				</div>
				
				<div className=" m-4 p-4 bg-white rounded-xl drop-shadow-lg space-y-6 pb-8">
					{sortedLitters ? (
						sortedLitters.map((litter) => (
							<div className="flex flex-row drop-shadow-lg bg-navbar-body-1 rounded-xl m-5 p-5">
								<div className="h-full my-auto">
									<Link href={`/litters/${litter.id}`} className="text-center mt-full mb-full">
										<h2 className="text-xl mb-2 font-bold">{litter.name}</h2>
										<Image
											alt="litter"
											src={litter.thumbnail ? litter.thumbnail : "/img/Placeholder.png"}
											width={250}
											height={250}
											className="border border-black rounded-xl mr-5"
										/>
									</Link>
								</div>
								<div>
									<div className=" ml-4 mb-4">
										<h2>Expected Date: {new Date(litter.expDate.toDate()).toISOString().split('T')[0]}</h2>
										<h2>Mother: <Link href={`/cats/${litter.mother.id}`}>{litter.mother.name}</Link></h2>
										<h2>Father: <Link href={`/cats/${litter.father.id}`}>{litter.father.name}</Link></h2>
										<h2>Completed: {litter.completed ? "Completed" : "Not Completed"}</h2>
									</div>
									<div>
										{litter.completed ? (
											<div className=" ml-4 space-y-2">
												<h2 className="text-xl">Kittens:</h2>
												<div className="flex">
													{litter.children.map((child) => (
														<Link href={`/cats/${child.id}`} className="text-center m-1 p-2 bg-white rounded-md drop-shadow-lg">
															<Image
																alt="kitten"
																src={child.thumbnail ? child.thumbnail : "/img/Placeholder.png"}
																width={100}
																height={100}
																className="border border-black-300 justify-center align-center place-items-center"
															/>
															<h3>{child.name}</h3>
														</Link>
													))}
												</div>
											</div>
										) : (
										<div>
											<h2 className="italic text-gray-400 ml-4">No Kittens</h2>
										</div>)}
									</div>
								</div>
							</div>
						))
					) : (<h2>Loading litters...</h2>)}
				</div>
			</div>
		</main>
	)
}