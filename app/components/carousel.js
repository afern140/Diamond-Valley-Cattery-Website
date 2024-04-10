'use client';
import { Carousel } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getObjects } from "../_utils/firebase_services";

export default function CarouselDefault({ images, iscatpage }) {
	const theme = {
		carousel: {
			defaultProps: {
				prevArrow: ({ loop, handlePrev, firstIndex }) => {
					return (
						<button
							onClick={handlePrev}
							disabled={!loop && firstIndex}
							className="!absolute top-2/4 left-4 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-white hover:bg-white/10 active:bg-white/30 grid place-items-center"
						>
							{/*<ChevronLeftIcon strokeWidth={3} className="-ml-1 h-7 w-7" />*/}
						</button>
					);
				},
				nextArrow: ({ loop, handleNext, lastIndex }) => (
					<button
						onClick={handleNext}
						disabled={!loop && lastIndex}
						className="!absolute top-2/4 right-4 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-white hover:bg-white/10 active:bg-white/30 grid place-items-center"
					>
						{/*<ChevronRightIcon strokeWidth={3} className="ml-1 h-7 w-7" />*/}
					</button>
				),
				navigation: ({ setActiveIndex, activeIndex, length }) => (
					<div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
						{new Array(length).fill("").map((_, i) => (
							<span
								key={i}
								className={`block h-3 w-3 cursor-pointer rounded-full transition-colors content-[''] ${activeIndex === i ? "bg-white" : "bg-white/50"
									}`}
								onClick={() => setActiveIndex(i)}
							/>
						))}
					</div>
				),
				autoplay: true,
				autoplayDelay: 5000,
				transition: {
					type: "tween",
					duration: 0.5,
				},
				loop: false,
				className: "",
			},
			styles: {
				base: {
					carousel: {
						position: "relative",
						width: "w-full",
						height: "h-full",
						overflowX: "overflow-x-hidden",
						overflowY: "overflow-y-hidden",
						display: "flex",
					},

					slide: {
						width: "w-full",
						height: "h-full",
						display: "inline-block",
						flex: "flex-none",
					},
				},
			},
		},
	}
	const [imgUrl, setImgUrl] = useState([]);

	const getAllImg = () => {
		getObjects('HomeCarousel').then((obj) => {
			let arr = obj.map((item) => {
				return item.url
			})
			setImgUrl(arr)
		})
	}


	useEffect(() => {
		if (images && images.length > 0) {
			let arr = images.map((item) => {
				return item.url
			})
			setImgUrl(arr);
		} else if (!iscatpage) {
			getAllImg();
		}
	}, [images])


	return (
		<div className="grid aspect-video w-full place-items-center overflow-x-hidden overflow-y-hidden p-6">
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
				{/* <img
							src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
							alt="image 1"
							className="h-full w-full object-cover"
						/>
						<img
							src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
							alt="image 2"
							className="h-full w-full object-cover"
						/>
						<img
							src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
							alt="image 3"
							className="h-full w-full object-cover"
						/> */}

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