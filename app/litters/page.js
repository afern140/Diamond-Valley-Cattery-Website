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

			<h1 className="text-3xl font-bold p-4 pt-16 text-center text-header-text-0">Litters</h1>
			<div>
				<div className="rounded-xl m-5 p-4 bg-white drop-shadow-lg">
					<label htmlFor="sort">Sort By:</label>
					<select id="sort" value={sortBy} onChange={handleSortChange} className="ml-2 p-2">
						<option value="name">Name</option>
						<option value="expDate">Expected Date</option>
					</select>
				</div>
				<div className=" w-full">
					<Link href="litters/add" className="mr-auto ml-full rounded-xl bg-white drop-shadow-lg m-5 p-2">Add Litter</Link>
				</div>
				<div className=" m-4 p-4 bg-white rounded-xl drop-shadow-lg space-y-6">
					{sortedLitters ? (
						sortedLitters.map((litter) => (
							<div className="flex flex-row drop-shadow-lg bg-navbar-body-1 rounded-xl m-5 p-5">
								<Link href={`/litters/${litter.id}`} className="text-center">
									<h2 className="text-xl mb-2">{litter.name}</h2>
									<Image
										alt="litter"
										src={litter.thumbnail ? litter.thumbnail : "/img/Placeholder.png"}
										width={250}
										height={250}
										className="border border-black-300 mr-5"
									/>
								</Link>
								<div>
									<h2>Expected Date: {new Date(litter.expDate.toDate()).toISOString().split('T')[0]}</h2>
									<h2>Mother: <Link href={`/cats/${litter.mother.id}`}>{litter.mother.name}</Link></h2>
									<h2>Father: <Link href={`/cats/${litter.father.id}`}>{litter.father.name}</Link></h2>
									<h2>Completed: {litter.completed ? "Completed" : "Not Completed"}</h2>
									{litter.completed ? (
										<div>
											<h2>Kittens:</h2>
											<div className="flex">
												{litter.children.map((child) => (
													<Link href={`/cats/${child.id}`} className="text-center mr-5">
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
									) : (<></>)}
								</div>
							</div>
						))
					) : (<h2>Loading litters...</h2>)}
				</div>
			</div>
		</main>
	)
}