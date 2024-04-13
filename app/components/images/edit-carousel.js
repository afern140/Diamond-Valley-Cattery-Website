import Image from "next/image";

export default function EditCarousel({ object, handleCarouselAdd, handleCarouselDelete }) {
	return (
		<div>
			{object.carouselImages && object.carouselImages.map((image, index) => (
				<div key={index} className="">
					<Image
						src={image}
						alt={`Carousel Image ${index}`}
						width={250}
						height={250}
						className="block mx-auto w-32 h-32 rounded-full"
					/>
					<button onClick={() => handleCarouselDelete(index)}>Delete</button>
				</div>
			))}
			<input type="file" accept="image/*" onChange={handleCarouselAdd} />
		</div>
	);
}