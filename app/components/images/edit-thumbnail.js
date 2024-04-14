import Image from "next/image";

export default function EditThumbnail({ handleThumbnailChange, thumbnail }) {
	return (
		<main className="relative text-[#092C48] pb-16 size-full">
			<input
				id="add-profile-picture"
				type="file"
				accept="image/*"
				onChange={handleThumbnailChange}
				className="block mx-auto mb-4 opacity-0"
			/>
			{thumbnail ? (
				<label htmlFor="add-profile-picture" className="text-center size-full">
					<Image
						htmlFor="add-profile-picture"
						src={thumbnail}
						alt="Thumbnail"
						width={100}
						height={100}
						className="block mx-auto w-32 h-32 rounded-full hover:cursor-pointer hover:scale-110 transition duration-300"
					/>
				</label>
			) : (
				<label htmlFor="add-profile-picture" className=" absolute border-[3px] border-dashed rounded-xl size-full top-0">
					<div htmlFor="add-profile-picture" className="size-full hover:cursor-pointer hover:scale-110 transition duration-300">
						<div htmlFor="add-profile-picture" className="relative bg-gray-300 size-1/4 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md">
							<div htmlFor="add-profile-picture" className="h-2 w-3/5 bg-gray-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md" />
							<div htmlFor="add-profile-picture" className="w-2 h-3/5 bg-gray-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md" />
						</div>
					</div>
				</label>
			)}
		</main>
	);
}