"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Carousel from "@/app/components/carousel"
import { useUserAuth } from "@/app/_utils/auth-context";
import CatCarouselController from "@/app/components/CatCarouselController";
import { getUser, updateUser, useUser } from "@/app/_utils/user_services";
import { db } from "@/app/_utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getObject } from "@/app/_utils/firebase_services";
import { useChat } from "@/app/_utils/chat-context";
import Comments from "@/app/components/comments";
import CatButton from "@/app/components/cats/catbutton";

import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({params}) {

    const {createOrJoinChat} = useChat();
	const { user, dbUser } = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [cat, setCat] = useState();
	const [favorite, setFavorite] = useState(false);

	const fetchCat = async () => {
		const cat = await getObject('cats', parseInt(params.cat));
		console.log('Cat Data', cat);
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

	useEffect(() => {
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
			if (filteredUser && filteredUser.favorites && filteredUser.favorites.cats && cat) {
				setFavorite(filteredUser.favorites.cats.some(ref => ref.path === doc(db, 'cats', cat.docId).path));
			}
		};
		fetchFavorites();
	}, [filteredUser, cat]);

	//Changes the page title when the cat is loaded
	useEffect(() => {
		if (cat) 
			document.title = "testing Cattery - " + cat.name + "'s page";
		else
			document.title = "testing Cattery - Cat page";
	}, [cat]);

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
	const handleImageUpload = async (imageUrl) => {
		try {
			fetchCat()
		} catch (error) {
			console.error("Error handling image upload:", error);
		}
	};

	return(
		<main className="relative">
			<BackgroundUnderlay />

			{cat ? (
				<section className="relative z-20 pb-16">
					<div className="pt-20 flex pb-10 relative z-20">
						<div className="w-4/5 space-x-6 m-auto justify-center flex-row text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text">
							<span className="text-6xl pb-10 font-extrabold uppercase">{cat.name}</span>
							{user ? (
								<button onClick={() => handleFavoriteButton()} className={"m-auto translate-y-2"}>
									<div className={"relative m-auto flex rounded-full " + (favorite ? "bg-red-600" : "")}>
										<Image alt="Favorite" src="/img/circle.svg" width={64} height={64} />
										<Image className="absolute top-[18px] right-4" alt="Heart" src={"/img/heart.svg"} width={32} height={32} />
									</div>
								</button>
							) : null}

							{filteredUser && filteredUser.role === 'breeder' && cat.owner && cat.owner.uid === user.uid ? (
								<Link className="relative pointer-events-auto" href={`/cats/${cat.id}/edit`}>
									<button className="relative pointer-events-auto">
										<Image alt="Edit" src="/img/edit.svg" width={48} height={48} />
									</button>
								</Link>	
							) : null}
						</div>
					</div>
					
					<div className="px-20 w-full flex">
						<Carousel images={cat.carouselImage} />
					</div>
					<div className="flex flex-row w-full px-10 xl:px-20">
						
						{/* First split of the section */}
						<div className="flex flex-col w-full text-black text-xl font-bold text-left">
							<div className="p-10 mx-10 mt-6 rounded-lg bg-white dark:bg-gray-500 drop-shadow-lg min-w-[400px] xl:min-w-[40%] w-fit">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Breed: <span className="font-normal">{cat.breed}</span></h3>
								<h3>Gender: <span className="font-normal">{cat.gender}</span></h3>

								<h3>Birthdate: <span className="font-normal">{new Date(cat.birthdate.toDate()).toLocaleDateString()}</span></h3>
								<h3>Color: <span className="font-normal">{cat.color}</span></h3>
								<h3>Eye Color: <span className="font-normal">{cat.eye_color}</span></h3>
							</div>
							<div className="p-10 mx-10 mt-6 rounded-lg bg-white dark:bg-gray-500 drop-shadow-lg min-w-[400px] xl:min-w-[40%] w-fit">
								<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
								<p className="font-normal">{cat.description ? cat.description : <span className="italic text-gray-600">No description</span>}</p>
							</div>
						</div>

						{/* Second split of the section */}
						<div className="flex flex-col ml-auto mx-10 mb-auto mt-6">
							<div className="text-[#092C48] dark:text-dark-header-text-0 font-bold bg-white p-8 rounded-xl drop-shadow-xl">
								<h2 className="text-2xl text-center mb-4">Want to Purchase {cat.name}?</h2>
								<button onClick={handleMeetingButton} className="mx-auto justify-center flex bg-navbar-body-1 drop-shadow-lg rounded-xl p-4 text-xl" >
									<div className="relative flex min-w-[200px] w-[270px]">
										<span className="my-auto flex text-header-text-0">Request a Meeting</span>
										<div className="flex mx-3 w-[3px] bg-[#092C48] rounded-full" />
										<button onClick={handleMeetingButton} className="bg-white bg-opacity-0 hover:bg-opacity-50 active:bg-opacity-80 transition duration-100 p-2 rounded-full">
											<Image alt=">" src="/img/right-arrow.svg" width={32} height={32} />
										</button>
									</div>
								</button>
							</div>
						</div>
					</div>

					{/* Conditions */}
					<div className="flex flex-col w-fit mx-[80px] xl:mx-[120px] max-w-[88%] relative space-y-6 mt-6 rounded-lg min-w-64 text-black">
						<div className=" bg-white dark:bg-gray-500 relative drop-shadow-lg rounded-xl p-10">
							<h2 className="text-2xl mb-2">Conditions</h2>
							<div className={" relative flex flex-wrap  dark:bg-gray-400 drop-shadow-lg rounded-xl mr-4" + (cat.conditions && cat.conditions.length > 0 ? " h-48 overflow-y-auto w-[440px] con-screen-0:w-[860px] con-screen-1:w-[1280px] con-screen-2:w-fit" : " ")}>
								{cat.conditions && cat.conditions.length > 0 ? (
									cat.conditions.map((condition) => (
										<div key={condition.id} className="relative flex-col rounded-md p-4 m-4 min-h-40 w-[380px] bg-navbar-body-1">
											<h3 className="w-[300px]">{condition.name}</h3>
											<p>Description: <span className="font-normal">{condition.description}</span></p>
											<p>Treatment: <span className="font-normal">{condition.treatment}</span></p>
											<h4>Treatment Status: {condition.treated ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
										</div>))
									) : (<span className="italic text-gray-500">No conditions</span>)
								}
							</div>
						</div>
					</div>

					{/* Vaccinations */}
					<div className="flex flex-col w-fit mx-[80px] xl:mx-[120px] max-w-[88%] relative space-y-6 mt-6 rounded-lg min-w-64 text-black">
						<div className="bg-white dark:bg-gray-500 relative drop-shadow-lg rounded-xl p-10">
							<h2 className="text-2xl mb-2">Vaccinations</h2>
							<div className={" relative flex flex-wrap  dark:bg-gray-400 drop-shadow-lg rounded-xl mr-4" + (cat.conditions && cat.conditions.length > 0 ? " h-96 overflow-y-auto w-[440px] con-screen-0:w-[860px] con-screen-1:w-[1280px] con-screen-2:w-fit" : " ")}>
								{cat.vaccinations && cat.vaccinations.length > 0 ? (
								cat.vaccinations.map((vaccination) => (
									<div className="relative flex-col rounded-md p-4 m-4 min-h-64 w-[380px] bg-navbar-body-1">
										<h3 className="w-[300px]">{vaccination.name}</h3>
										<p>Description: <span className="font-normal">{vaccination.description}</span></p>
										<h4>Dosage Status: {vaccination.completed ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
										<h4>Doses Taken: <span className="font-normal">{vaccination.dosesTaken}</span></h4>
										<h4>Doses Taken Dates:</h4>
										<ul className="list-none">
											{vaccination.datesTaken.map((date, index) => (
												<li key={index} className="font-normal">
													<div className="flex space-x-2">
														<Image alt=">" src="/img/right-arrow-head.svg" width={16} height={16} />
														{new Date(date.toDate()).toISOString().split('T')[0]}
													</div>
												</li>
											))}
										</ul>
										<h4>Doses Remaining: <span className="font-normal">{vaccination.dosesRemaining}</span></h4>
										<h4>Planned Dosage Dates:</h4>
										<ul className="list-none">
											{vaccination.futureDates.fill().map((date, index) => (
												<li key={index} className="font-normal">
													<div className="flex space-x-2">
														<Image alt=">" src="/img/right-arrow-head.svg" width={16} height={16} />
														<span>{date && new Date(date.toDate()).toISOString().split('T')[0]}</span>
													</div>
												</li>
											))}
										</ul>
									</div>
								))) : (<span className="italic text-gray-500">No vaccinations</span>)
								}
							</div>
						</div>
					</div>

					<div className="text-black text-xl font-bold p-10">
						{cat.father || cat.mother ? (
							<div>
								<h2 className="text-2xl mx-10 mt-10">Parents</h2>
								<div className="flex flex-wrap">
									{cat.mother ? (
										<div className="bg-navbar-body-0 dark:bg-gray-400 drop-shadow-lg p-10 m-10 rounded-lg text-center text-white">
											<h2>Mother</h2>
											<CatButton cat={cat.mother} lightText={true}/>
										</div>
									) : null}
									{cat.father ? (
										<div className="bg-navbar-body-0 dark:bg-gray-400 drop-shadow-lg p-10 m-10 rounded-lg text-center text-white">
											<h2>Father</h2>
											<CatButton cat={cat.father} lightText={true}/>
										</div>
									) : null}
								</div>
							</div>
						) : null}
						{cat.children && cat.children.length > 0 ? (
							<div>
								<h2 className="text-2xl mx-10 mt-10">Children</h2>
								<div className="flex flex-wrap">
									{cat.children ? (
										cat.children.map((child) => (
											<div key={child.id} className=" bg-navbar-body-0 dark:bg-gray-400 drop-shadow-lg p-10 m-10 rounded-lg text-center">
												<CatButton cat={child} lightText={true}/>
											</div>
										))
									) : null}
								</div>
							</div>
						) : null}
					</div>
					<Comments cat={cat}/>
				</section>
			) : (
				<h1 className="text-black text-3xl text-center font-bold p-5">Error 404: Cat Not Found.</h1>
			)}
		</main>
	)
    //No cats are goods cats
}