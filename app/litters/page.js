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
		<main className={"text-gray-700 h-full relative" + (sortedLitters.length > 0 ? "" : " h-screen")}>
			<div className="h-full">
				<BackgroundUnderlay />

				<div className="pt-20 flex pb-10">
					<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-gradient-to-r from-[#A783D5] via-[#EB9839] to-[#E37B87] text-transparent bg-clip-text">
						<span className="text-6xl pb-10 font-extrabold">LITTERS</span> <br />
						<div className="mt-8"><span className="">DISCOVER YOUR NEW BEST FRIENDS AT DIAMOND VALLEY CATTERY. BROWSE OUR ADORABLE LITTERS AVAILABLE FOR PURCHASE.</span></div>
					</div>
				</div>
				
				<div className="px-10 xl:px-20">
					<div className="flex w-full items-center">
						<div className="w-full bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] text-gray-700 rounded-xl relative p-4">
							<label className="font-bold text-2xl align-middle" htmlFor="sort">Sort By:</label>
							<select id="sort" value={sortBy} onChange={handleSortChange} className=" drop-shadow-md ml-4 p-2 text-xl rounded-xl bg-[#ae9afdb8] border-2">
								<option value="name">Name</option>
								<option value="expDate">Expected Date</option>
							</select>
						</div>
						<div className=" ml-10 mr-10">
							<Link href="litters/add" className="bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] rounded-full text-transparent bg-clip-text text-8xl relative inline-block text-left">+</Link>
						</div>
					</div>
					<div className={"p-4 bg-white bg-opacity-20 mt-6 border-2 border-opacity-50 border-white rounded-xl" + (sortedLitters && sortedLitters.length > 0 ? " h-[100vh]" : "")}>
						<div className="h-full scroll-auto overflow-y-scroll overflow-hidden">
							{sortedLitters && sortedLitters.length > 0 ? (
								sortedLitters.map((litter) => (
									<div className="flex flex-row border border-black-300 rounded-md m-5 p-5">
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
					<div className="h-10"/>
				</div>
			</div>
		</main>
	)
}