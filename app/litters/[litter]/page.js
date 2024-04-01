"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { getObject, getObjects } from "@/app/_utils/firebase_services";
import Carousel from "@/app/components/carousel"
import CatButton from "@/app/components/cats/catbutton";
import CatSelection from "@/app/components/cats/cat-selection";

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
		<main className="bg-white text-black">
			{litter ? (
				<div>
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
				</div>
			) : (
				<h1>Error 404: Litter not Found</h1>
			)}
		</main>
	)
}