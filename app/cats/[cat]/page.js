"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Carousel from "@/app/components/images/carousel"
import { useUserAuth } from "@/app/_utils/auth-context";
import { updateUser } from "@/app/_utils/user_services";
import { db } from "@/app/_utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getObject } from "@/app/_utils/firebase_services";
import { useChat } from "@/app/_utils/chat-context";
import Comments from "@/app/components/comments";
import CatButton from "@/app/components/cats/cat-button";

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({params}) {

    const {createOrJoinChat} = useChat();
	const { user, dbUser } = useUserAuth();
	const [cat, setCat] = useState();
	const [favorite, setFavorite] = useState(false);

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
			if (cat.conditions && Array.isArray(cat.conditions)) {
				const conditionsData = await Promise.all(cat.conditions.map(async (conditionRef) => {
					const conditionDoc = await getDoc(conditionRef);
					return conditionDoc.data();
				}));
				cat.conditions = conditionsData;
			}
			else
				cat.conditions = [];
			if (cat.vaccinations && Array.isArray(cat.vaccinations)) {
				const vaccinationsData = await Promise.all(cat.vaccinations.map(async (vaccinationRef) => {
					const vaccinationDoc = await getDoc(vaccinationRef);
					return vaccinationDoc.data();
				}));
				cat.vaccinations = vaccinationsData;
			}
			else
				cat.vaccinations = [];
			setCat(cat);
		};
		fetchCat();
	}, [params]);
	
	useEffect(() => {
		const fetchFavorites = async () => {
			if (dbUser && dbUser.favorites && dbUser.favorites.cats && cat) {
				setFavorite(dbUser.favorites.cats.some((ref) => ref.id === cat.id));
			};
		};
		fetchFavorites();
	}, [dbUser, cat]);

	//Changes the page title when the cat is loaded
	useEffect(() => {
		if (cat) 
			document.title = "Diamond Valley Cattery - " + cat.name + "'s page";
		else
			document.title = "Diamond Valley Cattery - Cat page";
	}, [cat]);

	const handleFavoriteButton = async () => {
		let updatedFavorites = dbUser.favorites.cats;
		if (favorite) {
			updatedFavorites = updatedFavorites.filter((favoriteCat) => favoriteCat.id !== cat.id);
			setFavorite(false);
		} else {
			updatedFavorites = [...updatedFavorites, cat];
			setFavorite(true);
		}
		await updateUser({ ...dbUser, favorites: { ...dbUser.favorites, cats: updatedFavorites } });
		window.location.reload();
	};

    //TO DO 
    const handleMeetingButton = async () => {
        console.log("Meeting button clicked");
        console.log("User UID:", user?.uid);
        console.log("Cat Owner UID:", cat?.owner?.uid);
        if (user && cat.owner) {
            const chatId = await createOrJoinChat(user.uid, cat.owner.uid);
            if (chatId) {
                window.location.href = `/messages/${chatId}`;
            }
        }
    };

	// -- F -- Height Refs
	const conRef = useRef();
	const vaccRef = useRef();
	const [vaccHeight, setVaccHeight] = useState(0);
	const [conHeight, setConHeight] = useState(0);

	useEffect(() => {
		if (!conRef || conRef.current == undefined) return;

		setConHeight(conRef.current.clientHeight);
	});

	useEffect(() => {
		if (!vaccRef || vaccRef.current == undefined) return;

		setVaccHeight(vaccRef.current.clientHeight);
		console.log("Set height of vaccination to: " + vaccHeight);		
	});


	return(
		<main className="relative">
			<BackgroundUnderlay />
			{cat ? (
				<section className="relative z-20 pb-16 w-4/5 mx-auto break-words">
					<div className="pt-20 flex pb-10 relative z-20">
						<div className="w-full space-x-6 m-auto justify-center flex-row text-center  inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text">
							<span className="text-6xl pb-10 font-extrabold uppercase">{cat.name}</span>
							{user ? (
								<button onClick={() => handleFavoriteButton()} className={"m-auto translate-y-2"}>
									<div className={"relative m-auto flex rounded-full " + (favorite ? "bg-red-600" : "")}>
										<Image alt="Favorite" src="/img/circle.svg" width={64} height={64} />
										<Image className="absolute top-[18px] right-4" alt="Heart" src={"/img/heart.svg"} width={32} height={32} />
									</div>
								</button>
							) : null}
							{dbUser && dbUser.role === 'breeder' && cat.owner && cat.owner.uid === user.uid ? (
								<Link className="relative pointer-events-auto" href={`/cats/${cat.id}/edit`}>
									<button className="relative pointer-events-auto">
										<Image alt="Edit" src="/img/edit.svg" width={48} height={48} />
									</button>
								</Link>	
							) : null}
						</div>
					</div>
					<div className=" w-full flex">
						<Carousel images={cat.carouselImages} />
					</div>
					<div className="flex flex-col xl:flex-row w-full">
						{/* First split of the section */}
						<div className="flex flex-col w-fit max-w-[100%] xl:max-w-[60%]  text-xl font-bold text-left text-header-text-0 dark:text-dark-header-text-0">
							<div className="p-10 mt-6 rounded-lg bg-white dark:bg-gray-500 drop-shadow-lg min-w-[400px] xl:min-w-[40%] w-fit">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Breed: <span className="font-normal">{cat.breed}</span></h3>
								<h3>Gender: <span className="font-normal">{cat.gender}</span></h3>
								<h3>Birthdate: <span className="font-normal">{cat.birthdate ? new Date(cat.birthdate.toDate()).toLocaleDateString() : null}</span></h3>
								<h3>Color: <span className="font-normal">{cat.color}</span></h3>
								<h3>Eye Color: <span className="font-normal">{cat.eye_color}</span></h3>
							</div>
							<div className="p-10 mt-6 rounded-lg bg-white dark:bg-gray-500 drop-shadow-lg min-w-[400px] xl:min-w-[40%] w-fit max-w-[100%] h-fit">
								<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
								<div className="max-h-[200px] overflow-y-auto">
									<p className="font-normal break-words">{cat.description ? cat.description : <span className="italic text-gray-600">No description</span>}</p>
								</div>
							</div>
						</div>
						{/* Second split of the section */}
						<div className="flex flex-col xl:ml-auto mb-auto mt-6">
							<div className="text-[#092C48] dark:text-dark-header-text-0 font-bold bg-white dark:bg-gray-500 p-8 rounded-xl drop-shadow-xl">
								<h2 className="text-2xl text-center mb-4">Want to Purchase {cat.name}?</h2>
								{user ? (
									<button onClick={handleMeetingButton} className="mx-auto justify-center flex bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg rounded-xl p-4 text-xl" >
										<div className="relative flex min-w-[200px] w-[270px]">
											<h2 className="my-auto flex text-header-text-0 ">Request a Meeting</h2>
											<div className="flex mx-3 w-[3px] bg-[#092C48] rounded-full" />
											<Image alt=">" src="/img/right-arrow.svg" width={32} height={32} />
										</div>
									</button>
								) : (
									<Link href={"/login"} className="mx-auto justify-center flex bg-navbar-body-1 dark:bg-gray-300 drop-shadow-lg rounded-xl p-4 text-xl" >
										<div className="relative flex min-w-[200px] w-[270px]">
											<h2 className="my-auto flex text-header-text-0 ">Sign In to Request a Meeting</h2>
											<div className="flex mx-3 w-[3px] bg-[#092C48] rounded-full" />
											<Image alt=">" src="/img/right-arrow.svg" width={32} height={32} />
										</div>
									</Link>
								)}
							</div>
						</div>
					</div>
					{/* Conditions */}
					<div className=" mt-10 text-header-text-0 bg-white w-fit dark:bg-gray-500 relative drop-shadow-lg rounded-xl p-10">
						<h2 className="text-2xl mb-2">Conditions</h2>
						<div className={" relative flex flex-wrap w-fit overflow-y-auto dark:bg-gray-400 drop-shadow-lg rounded-xl mr-4"} style={{height: conHeight + 30}}>
							{cat.conditions && cat.conditions.length > 0 ? (
								cat.conditions.map((condition) => (
									<div ref={conRef} key={condition.id} className="relative self-start flex-col rounded-md p-4 m-4 min-h-40 h-fit w-[380px] bg-navbar-body-1 dark:bg-gray-300">
										<h3 className="w-[300px] font-bold">{condition.name}</h3>
										<div className="overflow-y-auto max-h-[200px]">
											<p>Description: <span className="font-normal">{condition.description}</span></p>
											<p>Treatment: <span className="font-normal">{condition.treatment}</span></p>
											<h4>Treatment Status: {condition.treated ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
										</div>
									</div>))
								) : (<span className="italic text-gray-500">No conditions</span>)
							}
						</div>
					</div>

					{/* Vaccinations */}
					<div className=" mt-10 text-header-text-0 bg-white w-fit dark:bg-gray-500 relative drop-shadow-lg rounded-xl p-10">
						<h2 className="text-2xl mb-2">Vaccinations</h2>
						<div className={`relative flex flex-wrap w-fit overflow-y-auto dark:bg-gray-400 drop-shadow-lg rounded-xl mr-4`} style={{height: vaccHeight + 30}}>
							{cat.vaccinations && cat.vaccinations.length > 0 ? (
							cat.vaccinations.map((vaccination) => (
								<div key={vaccination.id} ref={vaccRef} className="relative flex-col rounded-md p-4 m-4 min-h-64 h-fit w-[380px] bg-navbar-body-1 dark:bg-gray-300">
									<h3 className="w-[300px] font-bold">{vaccination.name}</h3>
									<div className="overflow-y-auto max-h-[300px]">
										<p>Description: <span className="font-normal">{vaccination.description}</span></p>
										<h4>Dosage Status: {vaccination.completed ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
										<h4>Doses Taken: <span className="font-normal">{vaccination.dosesTaken}</span></h4>
										<h4>Doses Taken Dates:</h4>
										<ul className="list-none">
											{vaccination.datesTaken && vaccination.datesTaken.length > 0 ? (vaccination.datesTaken.map((date, index) => (
												<li key={index} className="font-normal">
													<div className="flex space-x-2">
														<Image alt=">" src="/img/right-arrow-head.svg" width={16} height={16} />
														{new Date(date.toDate()).toLocaleDateString()}
													</div>
												</li>
											))) : null}
										</ul>
										<h4>Doses Remaining: <span className="font-normal">{vaccination.dosesRemaining}</span></h4>
										<h4>Planned Dosage Dates:</h4>
										<ul className="list-none">
											{vaccination.futureDates && vaccination.futureDates.length > 0 ? (vaccination.futureDates.map((date, index) => (
												<li key={index} className="font-normal">
													<div className="flex space-x-2">
														<Image alt=">" src="/img/right-arrow-head.svg" width={16} height={16} />
														{new Date(date.toDate()).toLocaleDateString()}
													</div>
												</li>
											))) : null}
										</ul>
									</div>
								</div>
							))) : (<span className="italic text-gray-500">No vaccinations</span>)
							}
						</div>
					</div>

					<div className="text-header-text-0 text-xl font-bold">
						{cat.father || cat.mother ? (
							<div className="mt-10 bg-white w-full dark:bg-gray-500 relative drop-shadow-lg rounded-xl p-10">
								<h2 className="text-2xl">Parents</h2>
								<div className="flex flex-wrap">
									{cat.mother ? (
										<div className="bg-navbar-body-1 dark:bg-gray-400 drop-shadow-lg p-10 my-10 mr-10 rounded-lg text-center text-white dark:text-header-text-0">
											<h2 className=" text-header-text-0">Mother</h2>
											<CatButton cat={cat.mother} lightText={false}/>
										</div>
									) : null}
									{cat.father ? (
										<div className="bg-navbar-body-1 dark:bg-gray-400 drop-shadow-lg p-10 my-10 rounded-lg text-center text-white dark:text-header-text-0">
											<h2 className=" text-header-text-0">Father</h2>
											<CatButton cat={cat.father} lightText={false}/>
										</div>
									) : null}
								</div>
							</div>
						) : null}
						{cat.children && cat.children.length > 0 ? (
							<div  className="mt-10 bg-white w-full dark:bg-gray-500 relative drop-shadow-lg rounded-xl p-10">
								<h2 className="text-2xl">Children</h2>
								<div className="flex flex-wrap max-h-[400px] overflow-y-auto">
									{cat.children ? (
										cat.children.map((child) => (
											<div key={child.id} className=" bg-navbar-body-1 dark:bg-gray-400 drop-shadow-lg p-10 my-5 mr-10 rounded-lg text-center">
												<CatButton cat={child} lightText={false}/>
											</div>
										))
									) : null}
								</div>
							</div>
						) : null}
					</div>
					<Comments cat={cat} user={dbUser}/>
				</section>
			) : (
				<h1 className="text-header-text-0 dark:text-dark-header-text-0 text-3xl text-center font-bold p-5">Error 404: Cat Not Found.</h1>
			)}
		</main>
	)
}