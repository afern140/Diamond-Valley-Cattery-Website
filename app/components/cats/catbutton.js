import Image from 'next/image'
import Link from "next/link";

export default function CatButton({ cat }) {
	return (
		<Link href={`/cats/${cat.id}`} className="w-full flex justify-center flex-col font-bold p-2 text-black place-items-center">
			<Image
				alt="Cat"
				src={cat.thumbnail}
				width={300}
				height={300}
				className="justify-center align-center place-items-center"
				objectFit="contain"/>
			<p className=" mt-1">{cat.name}</p>
			<p className=" text-sm font-medium">{cat.breed}</p>
		</Link>
	);
};
