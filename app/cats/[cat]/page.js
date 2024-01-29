//Cat data generated with cobbl.io

"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Cats from "./cat"

export default function Page({ params }) {

	const [selectedCat, setSelectedCat] = useState(Cats[parseInt(params.cat)]);

	return(
		<main className="bg-gray-100">
			{selectedCat ? (
				<section>
					<h1 className="text-black text-4xl text-center font-bold p-5 pb-0">{selectedCat.name}</h1>
					<Image
						src="/img/Placeholder.png"
						alt="Cat"
						width={450}
						height={225}
						className="border-2 border-black m-5 mx-auto"
					/>
					<div className="flex flex-row">
						<div className="flex flex-wrap text-black text-xl font-bold text-left">
							<div className="bg-blue-100 p-10 m-10 rounded-lg min-w-64">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Breed: {selectedCat.breed}</h3>
								<h3>Age: {selectedCat.age}</h3>
								<h3>Color: {selectedCat.color}</h3>
								<h3>Eye Color: {selectedCat.eye_color}</h3>
								<h3>Gender: {selectedCat.gender}</h3>
							</div>
							<div  className="bg-blue-100 p-10 m-10 rounded-lg">
								<h2 className="text-2xl mb-2">Medical History</h2>
								<h3>Vaccinations: {selectedCat.vaccinations}</h3>
								<h3>Conditions: {selectedCat.conditions}</h3>
							</div>
						</div>
						<div className="flex flex-col text-white text-xl font-bold text-center bg-[#305B73] p-7 m-auto rounded-lg">
							<h2>Want to Purchase {selectedCat.name}?</h2>
							<button className="bg-white text-[#305B73] p-2 m-2 rounded-md">Request a Meeting</button>
						</div>
					</div>
					<div className="text-black text-xl font-bold">
						<h2 className="text-2xl m-10 mb-0">Genetics</h2>
						<div className="flex flex-wrap">
							<div>
								<h3 className="bg-blue-100 p-10 m-10 rounded-lg text-center">
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
							<h3 className="bg-blue-100 p-10 m-10 rounded-lg text-center">
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
								<h3 className="bg-blue-100 p-10 m-10 rounded-lg text-center">
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
				<h1 className="text-black text-3xl text-center font-bold p-5">Error 404: Cat Not Found</h1>
			)}
		</main>
	)
}