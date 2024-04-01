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
import { useChat } from "@/app/_utils/chat-context";
import Comments from "@/app/components/comments";
import ApiDataProvider from "@/app/_utils/api_provider";

export default function Page({params}) {

    const {createOrJoinChat} = useChat();
	const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
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
			document.title = "Diamond Valley Cattery - " + cat.name + "'s page";
		else
			document.title = "Diamond Valley Cattery - Cat page";
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
     
	return(
		<ApiDataProvider>
		<main className="bg-gray-100">
			{cat ? (
				<section>
					<h1 className="text-black text-4xl text-center font-bold pt-8 pb-4">{cat.name}</h1>
					<Carousel />
					<div className="flex flex-row">
						<div className="flex flex-col text-black text-xl font-bold text-left">
							<div className="p-10 mx-10 mt-6 rounded-lg min-w-64">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Breed: <span className="font-normal">{cat.breed}</span></h3>
								<h3>Gender: <span className="font-normal">{cat.gender}</span></h3>
								{/*<h3>Age: <span className="font-normal">{cat.age}</span></h3>*/}
								<h3>Birthdate: <span className="font-normal">{new Date(cat.birthdate.seconds * 1000).toLocaleDateString()}</span></h3>
								<h3>Color: <span className="font-normal">{cat.color}</span></h3>
								<h3>Eye Color: <span className="font-normal">{cat.eye_color}</span></h3>
							</div>
							<div className="p-10 mx-10 mt-6 rounded-lg min-w-64">
								<h2 className="text-2xl mb-2">Description</h2>
								<p className="font-normal">{cat.description}</p>
							</div>
							<div className="flex flex-row p-10 mx-10 mt-6 rounded-lg min-w-64">
								<div>
									<h2 className="text-2xl mb-2">Conditions</h2>
									{cat.conditions ? (
										cat.conditions.map((condition) => (
											<div key={condition.id} className="flex flex-col border border-black-300 rounded-md p-4 m-4 ml-0">
												<h3>{condition.name}</h3>
												<p>Description: <span className="font-normal">{condition.description}</span></p>
												<p>Treatment: <span className="font-normal">{condition.treatment}</span></p>
												<h4>Treatment Status: {condition.treated ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
											</div>
										)
									)) : (<h2>None</h2>)}
								</div>
								<div>
									<h2 className="text-2xl mb-2">Vaccinations</h2>
									{cat.vaccinations ? (
										cat.vaccinations.map((vaccination) => (
											<div key={vaccination.id} className="flex flex-col border border-black-300 rounded-md p-4 m-4 ml-0">
												<h3>{vaccination.name}</h3>
												<p>Description: <span className="font-normal">{vaccination.description}</span></p>
												<h4>Dosage Status: {vaccination.completed ? (<span className="font-normal">Finished</span>) : (<span className="font-normal">In Progress</span>)}</h4>
												<h4>Doses Taken: <span className="font-normal">{vaccination.dosesTaken}</span></h4>
												<h4>Doses Taken Dates:</h4>
												<ul className="list-disc">
													{vaccination.datesTaken.map((date, index) => (
														<li key={index} className="font-normal">{new Date(date.seconds * 1000).toLocaleDateString()}</li>
													))}
												</ul>
												<h4>Doses Remaining: <span className="font-normal">{vaccination.dosesRemaining}</span></h4>
												<h4>Planned Dosage Dates:</h4>
												<ul className="list-disc">
													{vaccination.futureDates.map((date, index) => (
														<li key={index} className="font-normal">{new Date(date.seconds * 1000).toLocaleDateString()}</li>
													))}
												</ul>
											</div>
										))
									) : (<h2>None</h2>)}
								</div>
							</div>
						</div>
						<div className="flex flex-col ml-auto mx-10 mb-auto">
							<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
								<h2>Want to Purchase {cat.name}?</h2>
								<button onClick={handleMeetingButton} className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md" >Request a Meeting</button>
							</div>
							<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
								<Link href={`./${cat.id}/edit`}><button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md">Edit {cat.name}</button></Link>
							</div>
							{user ? (
								<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
									<h2>{favorite ? `Remove ${cat.name} from Favorites?` : `Add ${cat.name} to Favorites?`}</h2>
									<button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md" onClick={handleFavoriteButton}>
										{favorite ? "Remove from Favorites" : "Add to Favorites"}
									</button>
								</div>
							) : (<></>)}
						</div>
					</div>
					<div className="text-black text-xl font-bold p-10">
						<h2 className="text-2xl mx-10 mt-10">Parents</h2>
						<div className="flex flex-wrap">
							{cat.father ? (
								<div className="bg-cat-gray-1 p-10 m-10 rounded-lg text-center">
									{cat.father.name}
									<Link href={`./${cat.father.id}`}>
										<Image
											src="/img/Placeholder.png"
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
								<div className="bg-cat-gray-1 p-10 m-10 rounded-lg text-center">
									{cat.mother.name}
									<Link href={`./${cat.mother.id}`}>
										<Image
											src="/img/Placeholder.png"
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
						<h2 className="text-2xl mx-10 mt-10">Children</h2>
						<div className="flex flex-wrap">
							{cat.children ? (
								cat.children.map((child) => (
									<div key={child.id} className="bg-cat-gray-1 p-10 m-10 rounded-lg text-center">
										{child.name}
										<Link href={`./${child.id}`}>
											<Image
												src="/img/Placeholder.png"
												alt="Cat"
												width={200}
												height={100}
												className="border-2 border-black m-5"
											/>
										</Link>
									</div>
								))
							) : null}
						</div>
					</div>
					<Comments cat={cat}/>
				</section>
			) : (
				<h1 className="text-black text-3xl text-center font-bold p-5">Error 404: Cat Not Found.</h1>
			)}
		</main>
		</ApiDataProvider>
	)
}