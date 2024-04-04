import Image from 'next/image'
import Link from "next/link";

export default function CatButton({ cat }) {
	return (
		<Link href={`/cats/${cat.id}`} className="w-full flex justify-center flex-col font-bold p-2 text-black place-items-center rounded-xl overflow-hidden">
			<div className=" rounded-xl overflow-hidden">
				<Image
					alt="Cat"
					src={cat.id % 2 === 0 ? "/img/Kitty_1.png" : "/img/Kitty_2.png"}
					width={300}
					height={300}
					className="justify-center align-center place-items-center"
					objectFit="contain"/>
			</div>
			<p className=" mt-1">{cat.name}</p>
			<p className=" text-sm font-medium">{cat.breed}</p>
		</Link>
	);
};