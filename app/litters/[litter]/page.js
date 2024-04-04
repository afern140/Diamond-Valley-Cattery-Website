"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { getObject, getObjects } from "@/app/_utils/firebase_services";
import Carousel from "@/app/components/carousel"
import CatButton from "@/app/components/cats/catbutton";
import CatSelection from "@/app/components/cats/cat-selection";
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page({ params }) {
	const [litter, setLitter] = useState();
	const [cats, setCats] = useState([]);
	const [showChildSelection, setShowChildSelection] = useState(false);

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

	useEffect(() => {
		const fetchCats = async () => {
			const cats = await getObjects('cats');
			setCats(cats);
		};
		fetchCats();
	}, []);

	return (
		<main className=" text-gray-700">
			{litter ? (
				<section className="relative">
					<BackgroundUnderlay />

					<div className="pt-20 flex pb-10">
						<div className="w-4/5 space-x-6 m-auto justify-center flex-row text-center mx-auto inline-block font-bold bg-gradient-to-r from-[#A783D5] via-[#EB9839] to-[#E37B87] text-transparent bg-clip-text">
							<span className="text-6xl pb-10 font-extrabold uppercase">{litter.name}</span>
							<button className="m-auto translate-y-2">
								<div className="relative">
									<Image alt="Favorite" src="/img/circle.svg" width={64} height={64} />
									<Image className="absolute top-[18px] right-4" alt="Heart" src="/img/heart.svg" width={32} height={32} />
								</div>
							</button>
							<button className="relative">
								<Image alt="Edit" src="/img/edit.svg" width={48} height={48} />
							</button>
						</div>
					</div>
					
					<div className="px-20 w-full flex">
						<Carousel />
					</div>
					<div className="flex flex-row w-full px-20 xl:px-20">
						<div className="flex flex-row space-x-6 w-full text-xl font-bold text-left">
							<div className="p-10 w-2/5 mt-6 rounded-lg min-w-64 bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] text-gray-700">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Expected Date: <span className="font-normal">{new Date(litter.expDate.toDate()).toLocaleDateString()}</span></h3>
								<h3>Completed: <span className="font-normal">{litter.completed ? "Completed" : "Not Completed"}</span></h3>
								<h3>Mother: <span className="font-normal">{litter.mother.name}</span></h3>
								<h3>Father: <span className="font-normal">{litter.father.name}</span></h3>
								{
									litter.children && litter.children.length > 0 ?
									(
										<div>
											<h1>Kittens: </h1>
											{
												litter.children.map((child) => (<span className="font-normal">{child.name + " "}</span>))
											}
										</div>
									)
									: (<div></div>)
								}
							</div>
							<div className="w-3/5 p-10 mt-6 rounded-lg min-w-64 bg-gradient-to-b from-[#696EFF] to-[#F8ACFF] text-gray-700">
								<h2 className="text-2xl mb-2 font-extrabold">Description</h2>
								<p className="font-normal">{litter.description ? litter.description : "No Description"}</p>
							</div>
						</div>
						<div className="flex flex-col ml-auto mx-10 mb-auto mt-10">
							<div className="text-gray-700 font-bold">
								
							</div>
						</div>
					</div>
					<div className="text-black text-xl font-bold p-10">
						<h2 className="text-2xl mx-10 mt-10">Parents</h2>
						<div className="flex flex-wrap">
							<div className="bg-[#F6DCE6] drop-shadow-lg p-10 m-10 rounded-lg text-center">
								{litter.father.name}
								<Link href={`./${2}`}>
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
							<div className="bg-[#F6DCE6] drop-shadow-lg p-10 m-10 rounded-lg text-center">
								{litter.mother.name}
								<Link href={`./${3}`}>
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
						</div>
						<h2 className="text-2xl mx-10 mt-10">Children</h2>
						<div className="flex flex-wrap">
							{
								litter.children.map((child, index) => (
									<div key={index} className="bg-[#F6DCE6] drop-shadow-lg p-10 m-10 rounded-lg text-center">
										{child.name}
										<Link href={`./${index}`}>
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
							}
						</div>
					</div>
					<div className="p-10 mx-10 mt-6 rounded-lg min-w-64">
						{/*<Addimg onImageUpload={handleImageUpload} />*/}
					</div>
					{/*<Comments/>*/}
				</section>
				/*<div>
					<h1>{litter.name}</h1>
					<Carousel/>
					<div>
						<h2>Details</h2>
						<h3>Expected Date: <span>{new Date(litter.expDate.toDate()).toISOString().split('T')[0]}</span></h3>
						<h3>Completed: <span>{litter.completed ? "Completed" : "Not Completed"}</span></h3>
					</div>
					<div>
						<h2>Description</h2>
						<p>{litter.description}</p>
					</div>
					<div>
						<h2>Parents</h2>
						<div>
							<h3>Mother</h3>
							<CatButton cat={litter.mother}/>
						</div>
						<div>
							<h3>Father</h3>
							<CatButton cat={litter.father}/>
						</div>
					</div>
					<div>
						{litter.completed ? (
							<div>
								<h2>Children</h2>
								{litter.children.map((child) => (
									<CatButton cat={child}/>
								))}
							</div>
						) : <></>}
					</div>
					<Link href={`./${litter.id}/edit`}>Edit {litter.name}</Link>
				</div>*/
			) : (
				<h1>Error 404: Litter not Found</h1>
			)}
		</main>
	)
}