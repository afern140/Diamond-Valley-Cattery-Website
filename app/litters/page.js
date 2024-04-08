"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getObject, getObjects } from "../_utils/firebase_services"
import { getDoc } from "firebase/firestore"
import BackgroundUnderlay from "@/app/components/background-underlay";

import { useUserAuth } from "../_utils/auth-context";
import {
  getUser,
  getUserCats,
  updateUser,
  useUser,
} from "../_utils/user_services";

export default function Page() {
	const [litters, setLitters] = useState([]);
	const [sortBy, setSortBy] = useState("name");

	const { user } = useUserAuth();
	const [filteredUser, setFilteredUser] = useState({role: "role", name: "name", username: "username", email: "randomemail@gmail.com", phone: "123-456-7890"});
	
	/*useEffect(() => {
		const fetchUser = async () => {
		const newUser = await getUser(user);
		setFilteredUser(newUser);
		setUpdatedUser(newUser);
		};
		fetchUser();
	}, [user]);

	useEffect(() => {
		const fetchUserCats = async () => {
		const favoriteCats = await getUserCats(filteredUser);
		setFavoriteCats(favoriteCats);
		};
		fetchUserCats();
	}, [filteredUser]);*/

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
		<main className="bg-white text-black">
			<h1 className="text-3xl font-bold p-4 text-center">Litters</h1>
			<div>
				<div className="border border-black-300 rounded-md m-5 p-2">
					<label htmlFor="sort">Sort By:</label>
					<select id="sort" value={sortBy} onChange={handleSortChange} className="ml-2 p-2">
						<option value="name">Name</option>
						<option value="expDate">Expected Date</option>
					</select>
				</div>
				<Link href="litters/add" className="border border-black-300 rounded-md m-5 p-2">Add Litter</Link>
				{sortedLitters ? (
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
				<div className="px-10 xl:px-20">
					<div className="flex-col w-full items-center">
						<div className="flex mt-10">
							<div className="w-full">
								{/* Search Field */}
								<div className="align-middle justify-center flex relative">
									<input type="text"
										name="litterlist-search"
										placeholder="Search"
										value={fieldInput}
										className=" bg-[#e5e5ff] dark:bg-gray-300 bg-opacity-100 drop-shadow-lg placeholder-text-header-0 shadow rounded-3xl text-xl pl-4 w-full h-16"
										onChange = { (Event) => searchItems(Event.target.value, "") }>
									</input>
									
									<Image className="relative -translate-x-12 z-10" alt="Search..." src="/img/search-icon.svg" width={30} height={30} />
								</div>
								{ filteredResults && filteredResults.length > 0 && fieldInput.length > 0 && activeAutocomplete ? 
									<div className="absolute z-40 bg-white bg-opacity-100 dark:bg-gray-500 border-2 placeholder-text-header-0 shadow rounded-3xl text-xl w-4/5 justify-center flex-col m-auto left-[10%] translate-x-2 translate-y-1 overflow-hidden">
										{
											filteredResults.map((litter) => (
												<button className="w-full text-left h-10 hover:bg-white pl-4" onClick={() => completeAutocomplete(litter.name)}>{litter.name}</button>
											))
										}
									</div> : <div />
								}
							</div>
							<div className="max-w-[220px] mr-full ml-auto bg-white dark:bg-gray-500 text-text-header-0 rounded-xl relative p-4 drop-shadow-lg">
								<label className="font-bold text-xl align-middle pb-8" htmlFor="sort">Sort By:</label>
								<select id="sort" value={sortBy} onChange={handleSortChange} className=" drop-shadow-md p-2 text-xl rounded-xl bg-[#e5e5ff] bg-opacity-100">
									<option value="name">Name</option>
									<option value="expDate">Expected Date</option>
								</select>
							</div>
							{filteredUser && filteredUser.role === "breeder" &&
							<div className="absolute top-[50px] right-[40px]">
								<Link onMouseEnter={() => setAddTooltip(true)} onMouseLeave={() => setAddTooltip(false)} href="litters/add" className="bg-background-gradient-1 rounded-full text-transparent bg-clip-text text-8xl relative inline-block text-left drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] hover:scale-125 transition duration-300">+</Link>
								<div className={"absolute size-[128px] top-[86px] right-[-30px] transition duration-500 z-10 " + (addTooltip ? " opacity-100" : "opacity-0")}>
									<div className="w-full relative bg-text-header-0 border-4 border-[#092C48] h-8 rounded-full drop-shadow">
										<p className="relative flex size-full text-center text-lg text-white justify-center align-middle">Add Litter</p>
									</div>
								</div>
							</div>}
						</div>
					</div>
					<div className={"p-4 bg-white dark:bg-gray-500 bg-opacity-80 drop-shadow-lg mt-6 rounded-xl" + (filteredResults && filteredResults.length > 0 ? " h-[100vh]" : "")}>
						<div className="h-full scroll-auto overflow-y-scroll overflow-hidden">
							{filteredResults && filteredResults.length > 0 ? (
								filteredResults.map((litter) => (
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
								) : (<></>)}
							</div>
						</div>
					))
				) : (<h2>Loading litters...</h2>)}
			</div>
		</main>
	)
}