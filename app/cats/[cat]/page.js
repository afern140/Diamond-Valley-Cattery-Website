//Cat data generated with cobbl.io

"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Cats from "./cat"
import Carousel from "@/app/components/carousel"

import { useRouter } from 'next/navigation'


export default function Page({ params }) {

	const [selectedCat, setSelectedCat] = useState(Cats[parseInt(params.cat)]);
	const router = useRouter();
	const data = router.query;

	console.log(data);

	return(
		<main className="bg-gray-100">
			{selectedCat ? (
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
						<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
							<h2>Want to Purchase {selectedCat.name}?</h2>
							<Link href={"/chat"}><button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md">Request a Meeting</button></Link>
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