import Image from "next/image";

export default function EditThumbnail({ handleThumbnailChange, thumbnail }) {
	return (
		<main className="min-h-screen relative text-[#092C48] pb-16">
			<input
				type="file"
				accept="image/*"
				onChange={handleThumbnailChange}
				className="block mx-auto mb-4"
			/>
			{thumbnail ? (
				<div className="text-center">
					<Image
						src={thumbnail}
						alt="Thumbnail"
						width={100}
						height={100}
						className="block mx-auto w-32 h-32 rounded-full"
					/>
				</div>
			) : null}
		</main>
	);
}