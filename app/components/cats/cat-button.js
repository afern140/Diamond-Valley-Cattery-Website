import Image from 'next/image'
import Link from "next/link";

export default function CatButton({ cat, lightText }) {
	return (
		<Link href={`/cats/${cat.id}`} className={"w-full flex justify-center flex-col font-bold p-2 place-items-center" + (lightText ? " text-white dark:text-header-text-0" : " text-black dark:text-white")}>
			<Image
				alt="Cat"
				src={cat.thumbnail ? cat.thumbnail : "/img/Placeholder.png"}
				width={200}
				height={200}
				className="justify-center align-center place-items-center border border-black rounded-xl drop-shadow-lg"
				objectFit="contain"/>
			<p className=" mt-4">{cat.name}</p>
			<p className=" text-sm font-medium">{cat.breed}</p>
		</Link>
	);
};
