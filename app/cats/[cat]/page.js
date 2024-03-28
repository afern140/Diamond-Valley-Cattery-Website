"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Carousel from "@/app/components/carousel"
import { useUserAuth } from "@/app/_utils/auth-context";
import { getUser, updateUser, useUser } from "@/app/_utils/user_services";
import { db } from "@/app/_utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getObject } from "@/app/_utils/firebase_services";

export default function Page({params}) {
	const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [cat, setCat] = useState();
	const [favorite, setFavorite] = useState(false);
	const [canEdit, setCanEdit] = useState(true);

	useEffect(() => {
		const fetchCat = async () => {
			const cat = await getObject('cats', parseInt(params.cat));
			if (cat.mother) {
				const motherDoc = await getDoc(cat.mother);
				cat.mother = motherDoc.data();
			} else {
				cat.mother = null;
			}
			if (cat.father) {
				const fatherDoc = await getDoc(cat.father);
				cat.father = fatherDoc.data();
			} else {
				cat.father = null;
			}
			if (cat.owner) {
				const ownerDoc = await getDoc(cat.owner);
				cat.owner = ownerDoc.data();
			} else {
				cat.owner = null;
			}
			if (cat.children) {
				const childrenData = await Promise.all(cat.children.map(async (childRef) => {
					const childDoc = await getDoc(childRef);
					return childDoc.data();
				}));
				cat.children = childrenData;
			}
			if (cat.conditions) {
				const conditionsData = await Promise.all(cat.conditions.map(async (conditionRef) => {
					const conditionDoc = await getDoc(conditionRef);
					return conditionDoc.data();
				}));
				cat.conditions = conditionsData;
			}
			if (cat.vaccinations) {
				const vaccinationsData = await Promise.all(cat.vaccinations.map(async (vaccinationRef) => {
					const vaccinationDoc = await getDoc(vaccinationRef);
					return vaccinationDoc.data();
				}));
				cat.vaccinations = vaccinationsData;
			}
			setCat(cat);
		};
		fetchCat();
	}, [params]);

	useEffect(() => {
		const fetchUser = async () => {
			const filteredUser = await getUser(user);
			setFilteredUser(filteredUser);
		};
		fetchUser();
	}, [user]);
	
	useEffect(() => {
		const fetchFavorites = async () => {
			if (filteredUser && filteredUser.favorites && filteredUser.favorites.cats) {
				setFavorite(filteredUser.favorites.cats.some(ref => ref.path === doc(db, 'cats', cat.docId).path));
			}
		};
		fetchFavorites();
	}, [filteredUser, cat]);

	const handleFavoriteButton = async () => {
		let updatedFavorites;
		if (favorite) {
			updatedFavorites = filteredUser.favorites.cats.filter(ref => ref.path !== doc(db, 'cats', cat.docId).path);
		} else {
			if (!filteredUser.favorites.cats.some(ref => ref.path === doc(db, 'cats', cat.docId).path)) {
				updatedFavorites = [...filteredUser.favorites.cats, doc(db, 'cats', cat.docId)];
			} else {
				updatedFavorites = filteredUser.favorites.cats;
			}
		}
		await updateUser({ ...filteredUser, favorites: { ...filteredUser.favorites, cats: updatedFavorites } });
		setFavorite(updatedFavorites.some(ref => ref.path === doc(db, 'cats', cat.docId).path));
	};

	return(
		<main className="bg-gray-100">
			{cat ? (
				<section>
					<h1 className="text-black text-4xl text-center font-bold pt-8 pb-4">{cat.name}</h1>
					<Carousel />
					<div className="flex flex-row">
						<div className="flex flex-col text-black text-xl font-bold text-left w-[70vw]">
							<div className="flex p-10 mx-10 mt-6 rounded-lg min-w-64 bg-[#C9D9E3] shadow space-x-4">
								<div className="flex flex-col min-w-64 bg-[#EFEFEF] shadow rounded-xl p-4">
									<h2 className="text-3xl mb-4">Details</h2>
									<h3>Breed: <span className="font-normal">{cat.breed}</span></h3>
									<h3>Gender: <span className="font-normal">{cat.gender}</span></h3>
									<h3>Age: <span className="font-normal">{cat.age}</span></h3>
									<h3>Color: <span className="font-normal">{cat.color}</span></h3>
									<h3>Eye Color: <span className="font-normal">{cat.eye_color}</span></h3>
								</div>
								<div className=" p-4 min-w-64 bg-[#EFEFEF] shadow rounded-xl mx-auto w-full h-full">
									<h2 className="text-3xl mb-2">Description</h2>
									{ cat.description ? <p className="font-normal">{cat.description}</p>
													: (<div className="flex flex-col border border-black-300 rounded-md p-4 m-4 ml-0">
															<h2 className="font-normal italic text-gray-800">None</h2>
														</div>)}
								</div>
							</div>
							<div className="flex flex-row p-10 mx-10 mt-6 rounded-lg min-w-64 space-x-4 bg-[#C9D9E3] shadow">
								<div className="bg-[#EFEFEF] rounded-xl p-4 shadow w-1/2">
									<h2 className="text-3xl mb-2">Vaccinations</h2>
									{cat.vaccinations && cat.vaccinations.length > 0 ? (
										cat.vaccinations.map((vaccination) => (
											<div key={vaccination.id} className="flex flex-col text-lg border-2 border-black-300 rounded-md p-4 m-4 ml-0 space-y-1">
												<h3 className="text-2xl">{vaccination.name}</h3>
												<div className="w-full border" />
												<p>Description: <span className="font-normal">{vaccination.description}</span></p>
												<div className="w-full border" />
												<h4>Dosage Status: {vaccination.completed ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
												<div className="w-full border" />
												<h4>Doses Taken: <span className="font-normal">{vaccination.dosesTaken}</span></h4>
												<div className="w-full border" />
												<h4>Doses Taken Dates:</h4>
												<ul className="list-disc pl-4">
													{vaccination.datesTaken.map((date, index) => (
														<li key={index} className="font-normal">{new Date(date.seconds * 1000).toLocaleDateString()}</li>
													))}
												</ul>
												<div className="w-full border" />
												<h4>Doses Remaining: <span className="font-normal">{vaccination.dosesRemaining}</span></h4>
												<div className="w-full border" />
												<h4>Planned Dosage Dates:</h4>
												<ul className="list-disc pl-4">
													{vaccination.futureDates.map((date, index) => (
														<li key={index} className="font-normal">{new Date(date.seconds * 1000).toLocaleDateString()}</li>
													))}
												</ul>
											</div>
										))
									) : (<div className="flex flex-col border border-black-300 rounded-md p-4 m-4 ml-0">
											<h2 className="font-normal italic text-gray-800">None</h2>
										</div>)}
								</div>
								<div className="bg-[#EFEFEF] rounded-xl p-4 shadow w-1/2">
									<h2 className="text-3xl mb-2">Conditions</h2>
									{cat.conditions && cat.conditions.length > 0 ? (
										cat.conditions.map((condition) => (
											<div key={condition.id} className="flex flex-col text-lg border border-black-300 rounded-md p-4 m-4 ml-0">
												<h3 className="text-2xl">{condition.name}</h3>
												<div className="w-full border" />
												<p>Description: <span className="font-normal">{condition.description}</span></p>
												<p>Treatment: <span className="font-normal">{condition.treatment}</span></p>
												<h4>Treatment Status: {condition.treated ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
											</div>
										)
									)) : (<div className="flex flex-col border border-black-300 rounded-md p-4 m-4 ml-0">
											<h2 className="font-normal italic text-gray-800">None</h2>
										</div>)}
								</div>
							</div>
						</div>
						<div className="flex flex-col ml-auto mx-10 mb-auto">
							{ canEdit &&
							<div className="flex flex-col ml-auto mr-full mt-6 text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-xl shadow">
								<Link href={`./${cat.id}/edit`}><button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md shadow">Edit {cat.name}</button></Link>
							</div>}
							<div className="flex flex-col ml-auto mr-full mt-6 text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-xl max-w-96 w-full shadow">
								<h2>Want to Purchase {cat.name}?</h2>
								<Link href={"/chat"}><button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md shadow">Request a Meeting</button></Link>
							</div>
							{user ? (
								<div className="flex flex-col ml-auto mr-full mt-6 text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-xl max-w-96 w-full shadow">
									<h2>{favorite ? `Remove ${cat.name} from Favorites?` : `Add ${cat.name} to Favorites?`}</h2>
									<button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md shadow" onClick={handleFavoriteButton}>
										{favorite ? "Remove from Favorites" : "Add to Favorites"}
									</button>
								</div>
							) : (<></>)}
						</div>
					</div>
					<div className="text-black text-xl font-bold p-10">
						<div className=" flex w-full">
							{cat.father || cat.mother ? <div>
								<h2 className="text-4xl mx-10 mt-10 mb-4">Parents</h2>
								<div className="flex flex-wrap shadow bg-[#EEEEEE]border-2 rounded-xl">
									{cat.father ? (
										<div className="bg-[#D7D7D7] border-2 shadow p-10 m-10 rounded-lg text-center">
											{cat.father.name}
											<Link href={`./${cat.father.id}`}>
												<Image
													src={cat.father.id % 2 === 0 ? "/img/Kitty_1.png" : "/img/Kitty_2.png"}
													alt="Cat"
													width={200}
													height={100}
													className="border-2 border-black m-5"
												/>
												<h2 className="font-normal">Father</h2>
											</Link>
										</div>
									) : (<></>)}
									{cat.mother ? (
										<div className="bg-[#D7D7D7] border-2 shadow p-10 m-10 rounded-lg text-center">
											{cat.mother.name}
											<Link href={`./${cat.mother.id}`}>
												<Image
													src={cat.mother.id % 2 === 0 ? "/img/Kitty_1.png" : "/img/Kitty_2.png"}
													alt="Cat"
													width={200}
													height={100}
													className="border-2 border-black m-5"
												/>
												<h2 className="font-normal">Mother</h2>
											</Link>
										</div>
									) : (<></>)}
								</div>
							</div> : <div></div>
							}
						</div>
						<div className="flex w-full">
							{ cat.children && cat.children.length > 0 ? (
								<div>
									<h2 className="text-4xl mx-10 mt-10 mb-4">Children</h2>
									<div className="flex flex-wrap bg-[#EEEEEE] border-2 rounded-xl shadow">
									{cat.children.map((child) => (
										<div key={child.id} className="bg-[#D7D7D7] border-2 shadow p-10 m-10 rounded-lg text-center">
											{child.name}
											<Link href={`./${child.id}`}>
												<Image
													src={child.id % 2 === 0 ? "/img/Kitty_1.png" : "/img/Kitty_2.png"}
													alt="Cat"
													width={200}
													height={100}
													className="border-2 border-black m-5"
												/>
											</Link>
										</div>
									))}
									</div>
								</div>
							) : null}
						</div>
					</div>
				</section>
			) : (
				<h1 className="text-black text-3xl text-center font-bold p-5">Error 404: Cat Not Found.</h1>
			)}
		</main>
	)
}