import Image from 'next/image'
import Link from "next/link";

export default function AddCatButton() {
	return (
		<Image
			alt="Cat"
			src={"/img/Placeholder.png"}
			width={200}
			height={200}
			className="justify-center align-center place-items-center border border-black rounded-xl drop-shadow-lg"
			objectFit="contain"
		/>
	);
};
