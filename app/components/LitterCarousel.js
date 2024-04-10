'use client';
import { Carousel } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getObjects } from "../_utils/firebase_services";

export default function CarouselDefault({ LitterData }) {
	const [imgUrl, setImgUrl] = useState([]);


	useEffect(() => {
		try {
			if (LitterData.carouselImage) {
				let arr = LitterData.carouselImage.map((item) => {
					return item.url
				})
				setImgUrl(arr);
			} 
		} catch (error) {
			
		}
		
	}, [])


	return (
		<div className="grid max-h-[440px] w-full place-items-center overflow-x-hidden overflow-y-hidden p-6">
			<Carousel
				className="pb-5"
				autoplay
				loop
				navigation={({ setActiveIndex, activeIndex, length }) => (
					<div className="absolute bottom-0 left-2/4 z-50 flex -translate-x-2/4 gap-2">
						{new Array(length).fill("").map((_, i) => (
							<span
								key={i}
								className={`block h-3 w-3 cursor-pointer rounded-full transition-colors content-[''] ${activeIndex === i ? "bg-black" : "bg-gray-300"
									}`}
								onClick={() => setActiveIndex(i)}
							/>
						))}
					</div>
				)}
			>

				{imgUrl.length > 0 ? (
					imgUrl.map((item, index) => (
						<img
							key={index}
							src={item}
							alt={`image ${index + 1}`}
							className="h-full w-full object-cover"
						/>
					))
				) : (
					[
						"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
						"https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
						"https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
					].map((src, index) => (
						<img
							key={index}
							src={src}
							alt={`image ${index + 1}`}
							className="h-full w-full object-cover"
						/>
					))
				)}


			</Carousel>
		</div>
	)
		;
}