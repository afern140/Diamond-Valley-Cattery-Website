"use client"

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Cats from "./cat"

import { useRouter } from 'next/navigation'
import Carousel from "@/app/components/carousel"

import ApiDataProvider from '../../_utils/api_provider';
import ApiDataContext from '@/app/_utils/api_context';

import { useUserAuth } from "@/app/_utils/auth-context";
import { getUser, updateUser, useUser } from "@/app/_utils/user_services";
import { db } from "@/app/_utils/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export default function CatProfile({params}) {

	const {user} = useUserAuth();
	const [filteredUser, setFilteredUser] = useState();
	const [updatedUser, setUpdatedUser] = useState();

	useEffect(() => {
		const fetchUser = async () => {
			const filteredUser = await getUser(user);
			setFilteredUser(filteredUser);
			setUpdatedUser(filteredUser);
		};
		fetchUser();
	}, [user]);

	const [selectedCat, setSelectedCat] = useState(Cats[parseInt(params.cat)]);
	const router = useRouter();
	const data = router.query;

	//console.log(data);

	const { cats } = React.useContext(ApiDataContext);
	const [catData, setCatData] = useState([]);

	useEffect(() => {
		console.log("Cat page dbdata updated!")
		//console.log(cats);

		setCatData(cats);
	}, [cats]);

	useEffect(() => {
		if (cats != null && cats != undefined)
		{
			//Select cat with id that matches params
			const cat = cats.find(cat => cat.id === parseInt(params.cat));
			setSelectedCat(cat);
		}
	}, [catData]);
	
	const [favorite, setFavorite] = useState(false);

	useEffect(() => {
		const fetchFavorites = async () => {
			if (filteredUser && filteredUser.favorites && filteredUser.favorites.cats) {
				// const usersCatData = filteredUser.favorites.cats.map(async (catRef) => {
				// 	const catDoc = await getDoc(catRef);
				// 	return { ...catDoc.data() };
				// });
				setFavorite(filteredUser.favorites.cats.some(ref => ref.path === doc(db, 'cats', selectedCat.docID).path));
			}
		};
		fetchFavorites();
	}, [filteredUser, selectedCat]);

	const handleFavoriteButton = async () => {
		let updatedFavorites;
		if (favorite) {
			updatedFavorites = filteredUser.favorites.cats.filter(ref => ref.path !== doc(db, 'cats', selectedCat.docID).path);
		} else {
			if (!filteredUser.favorites.cats.some(ref => ref.path === doc(db, 'cats', selectedCat.docID).path)) {
				updatedFavorites = [...filteredUser.favorites.cats, doc(db, 'cats', selectedCat.docID)];
			} else {
				updatedFavorites = filteredUser.favorites.cats;
			}
		}
		await updateUser({ ...filteredUser, favorites: { ...filteredUser.favorites, cats: updatedFavorites } });
		setFavorite(updatedFavorites.some(ref => ref.path === doc(db, 'cats', selectedCat.docID).path));
	};

	return(
		<main className="bg-gray-100">
			{selectedCat && catData ? (
				<section>
					<h1 className="text-black text-4xl text-center font-bold pt-8 pb-4">{selectedCat.name}</h1>
					{/*<Image
						src="/img/Placeholder.png"
						alt="Cat"
						width={450}
						height={225}
						className="border-2 border-black m-5 mx-auto"
					/>*/}
					<Carousel />
					<div className="flex flex-row">
						<div className="flex flex-col text-black text-xl font-bold text-left">
							<div className="p-10 mx-10 mt-6 rounded-lg min-w-64">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Breed: <span className="font-normal">{selectedCat.breed}</span></h3>
								<h3>Gender: <span className="font-normal">{selectedCat.gender}</span></h3>
								<h3>Age: <span className="font-normal">{selectedCat.age}</span></h3>
								<h3>Color: <span className="font-normal">{selectedCat.color}</span></h3>
								<h3>Eye Color: <span className="font-normal">{selectedCat.eye_color}</span></h3>
							</div>
							<div  className="px-10 mx-10 rounded-lg">
								<h2 className="text-2xl mb-2">Health</h2>
								<h3>Vaccinations: <span className="font-normal">{selectedCat.vaccinations}</span></h3>
								<h3>Conditions: <span className="font-normal">{selectedCat.conditions}</span></h3>
							</div>
						</div>
						<div className="flex flex-col ml-auto mx-10 mb-auto">
							<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
								<h2>Want to Purchase {selectedCat.name}?</h2>
								<Link href={"/chat"}><button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md">Request a Meeting</button></Link>
							</div>
							<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
								<h2>{favorite ? `Remove ${selectedCat.name} from Favorites?` : `Add ${selectedCat.name} to Favorites?`}</h2>
								<button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md" onClick={handleFavoriteButton}>
									{favorite ? "Remove from Favorites" : "Add to Favorites"}
								</button>
							</div>
						</div>
					</div>
					<div className="text-black text-xl font-bold p-10">
						<h2 className="text-2xl mx-10 mt-10">Genetics</h2>
						<div className="flex flex-wrap">
							<div>
								<h3 className="bg-cat-gray-1 p-10 m-10 rounded-lg text-center">
									Father
									<Link href={`./${selectedCat.fatherID}`}>
										<Image
											src="/img/Placeholder.png"
											alt="Cat"
											width={200}
											height={100}
											className="border-2 border-black m-5"
										/>
									</Link>
								</h3>
							</div>
							<h3 className="bg-cat-gray-1 p-10 m-10 rounded-lg text-center">
								Mother
								<Link href={`./${selectedCat.motherID}`}>
									<Image
										src="/img/Placeholder.png"
										alt="Cat"
										width={200}
										height={100}
										className="border-2 border-black m-5"
									/>
								</Link>
							</h3>
							{selectedCat.children ? (
								<h3 className="bg-cat-gray-1 p-10 m-10 rounded-lg text-center">
									Children
									{selectedCat.childrenList.map((childID) => (
									<Link href={`./${childID}`}>
										<Image
											src="/img/Placeholder.png"
											alt="Cat"
											width={200}
											height={100}
											className="border-2 border-black m-5"
										/>
									</Link>
									))}
								</h3>
							) : null }
						</div>
					</div>
				</section>
			) : (
				<h1 className="text-black text-3xl text-center font-bold p-5">Error 404: Cat Not Found.</h1>
			)}
		</main>
	)
}