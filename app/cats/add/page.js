"use client"

import { useState } from "react"

export default function Page() {
	const [cat, setCat] = useState({
		id: null,
		name: null,
		age: null,
		color: null,
		eye_color: null,
		breed: null,
		gender: null,
		vaccinations: null,
		conditions: null,
		fatherID: null,
		motherID: null,
		children: null
	});

	const Cats = null;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCat((prevCat) => ({ ...prevCat, [name]: value }));
	}

	const handleSubmit = async () => {
		console.log(cat)
	}

	return(
		<main className="bg-gray-100">
			<h1 className="text-black text-4xl text-center font-bold p-5 pb-0">Add Cat</h1>
			<div className="flex flex-col">
				<h2 className="text-black text-2xl font-bold p-5 pb-0">Details</h2>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="name"
					placeholder="Cat Name"
					value={cat.name}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="breed"
					placeholder="Cat Breed"
					value={cat.breed}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="gender"
					placeholder="Cat Gender"
					value={cat.gender}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="age"
					placeholder="Cat Age"
					value={cat.age}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="color"
					placeholder="Cat Color"
					value={cat.color}
					onChange={handleChange}
				/>
				<input
					className="text-black p-2 m-5 mb-0 text-center border-2 border-[#305B73]"
					type="text"
					name="eye-color"
					placeholder="Cat Eye Color"
					value={cat.eye_color}
					onChange={handleChange}
				/>
			</div>
			<button className="text-white text-2xl rounded-lg px-5 py-3 m-5 bg-[#305B73]" onClick={handleSubmit}>Next</button>
		</main>
	)
}