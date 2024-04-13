import Image from "next/image"

export default function CatSelection({ cats, showCatSelection, setShowCatSelection, handleSelectCat, gender = "", filtered = [] }) {
	let filteredCats = cats;
	//Gender filter: Only shows cats of the given gender
	if (gender != "")
		filteredCats = filteredCats.filter((cat) => cat.gender == gender);
	//Manual filter: Only shows cats that are not in the filtered list
	//Used to prevent duplicate children
	if (filtered.length > 0)
		filteredCats = filteredCats.filter((cat) => !filtered.includes(cat.id));
	return (
		showCatSelection && (
			<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-xl z-50">
				<div className="bg-white dark:bg-gray-600 p-8 rounded-lg drop-shadow-lg w-3/4 h-[90%] relative">
					<h2 className="text-lg font-bold mb-4 dark:text-dark-header-text-0">Select a New Cat</h2>
					<div className="relative h-[80%] flex flex-wrap bg-white dark:bg-gray-500 p-4 rounded-xl drop-shadow-lg overflow-auto justify-between">
						{filteredCats ? filteredCats.map((cat) => (
							<div key={cat.id} className="bg-navbar-body-1 dark:bg-gray-300 m-2 p-2 rounded-xl drop-shadow-lg">
								<button onClick={() => handleSelectCat(cat)} className="w-full flex justify-center flex-col font-bold p-2 text-black place-items-center">
									<Image
										alt="Cat"
										src={cat.thumbnail ?cat.thumbnail : "/img/Placeholder.png"}
										width={150}
										height={150}
										className="justify-center align-center place-items-center"
										objectFit="contain"/>
									<p className=" mt-1">{cat.name}</p>
									<p className=" text-sm font-medium">{cat.breed}</p>
								</button>
							</div>
						)) : "Loading..."}
					</div>
					<div className="absolute bottom-0 right-0 py-2 px-8 flex justify-end mt-2">
						<button onClick={() => setShowCatSelection(false)} className=" bg-navbar-body-0 text-white font-bold py-2 px-4 rounded">Cancel</button>
					</div>
				</div>
			</div>
		)
	)
}