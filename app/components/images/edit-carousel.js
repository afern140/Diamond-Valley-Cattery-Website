import Image from "next/image";

export default function EditCarousel({ object, handleCarouselAdd, handleCarouselDelete }) {
	return (
		<div className="size-full flex">
			<div className="relative h-full max-w-1/3 aspect-square border-[3px] border-dashed rounded-xl">
				<input id="add-carousel-picture" type="file" accept="image/*" onChange={handleCarouselAdd} className="opacity-0"/>
				<label htmlFor="add-carousel-picture" className="size-full hover:cursor-pointer absolute top-0 hover:scale-110 transition duration-300">
						<div htmlFor="add-carousel-picture" className="relative bg-gray-300 size-1/4 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md">
							<div htmlFor="add-carousel-picture" className="h-2 w-3/5 bg-gray-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md" />
							<div htmlFor="add-carousel-picture" className="w-2 h-3/5 bg-gray-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md" />
						</div>
				</label>
			</div>
			<div className="px-6 flex flex-wrap overflow-y-auto">
				{object.carouselImages && object.carouselImages.map((image, index) => (
					<div key={index} className=" px-3 py-2">
						<Image
							src={image}
							alt={`Carousel Image ${index}`}
							width={250}
							height={250}
							className="block mx-auto border-2 relative border-black m-5 mb-2 hover:cursor-pointer hover:scale-110 transition duration-300"
						/>
						<button onClick={() => handleCarouselDelete(index)} className="flex mx-auto px-4 py-2 bg-navbar-body-1 drop-shadow-lg m-2 rounded-md"><span className="mx-auto">Delete</span></button>
					</div>
				))}
			</div>
		</div>
	);
}