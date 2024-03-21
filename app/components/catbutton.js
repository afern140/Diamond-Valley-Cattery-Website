"use client";
import Image from 'next/image'
import Link from "next/link";

function CatButton({ cat }) {
	return (
		<Link href={`/cats/${cat.id}`} className="w-full flex justify-center">
			<button className="flex-col font-bold p-2 text-black place-items-center">
				<Image
					alt="Cat"
					src={ Math.random() > 0.5 ? "/img/Kitty_1.png" : "/img/Kitty_2.png" }
					width={300}
					height={300}
					className="justify-center align-center place-items-center"
					objectFit="contain"/>
				<p className=" mt-1">{cat.name}</p>
				<p className=" text-sm font-medium">{cat.breed}</p>
			</button>
		</Link>
	);
};

export default CatButton;