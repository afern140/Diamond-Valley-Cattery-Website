import Image from "next/image"

export default function CatSelection({ cats, showCatSelection, setShowCatSelection, handleSelectCat }) {
	return (
		showCatSelection && (
			<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
				<div className="bg-white p-8 rounded-lg shadow-lg w-3/4 h-3/4 overflow-auto relative">
					<h2 className="text-lg font-bold mb-4">Select a New Cat</h2>
					<div className="flex flex-wrap border border-gray-300 p-5 rounded-lg justify-between">
						{cats ? cats.map((cat) => (
							<div key={cat.id}>
								<button onClick={() => handleSelectCat(cat)} className="w-full flex justify-center flex-col font-bold p-2 text-black place-items-center">
									<Image
										alt="Cat"
										src={cat.thumbnail || "/img/Placeholder.png"}
										width={300}
										height={300}
										className="justify-center align-center place-items-center"
										objectFit="contain"/>
									<p className=" mt-1">{cat.name}</p>
									<p className=" text-sm font-medium">{cat.breed}</p>
								</button>
							</div>
						)) : "Loading..."}
					</div>
					<div className="sticky bottom-0 right-0 p-5 bg-white rounded-lg flex justify-end mt-4">
						<button onClick={() => setShowCatSelection(false)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-4">Cancel</button>
					</div>
				</div>
			</div>
		)
	)
}