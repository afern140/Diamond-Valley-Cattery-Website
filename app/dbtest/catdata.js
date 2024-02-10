'use client'

import React, { useState, useEffect } from 'react';
import ApiDataContext from '../_utils/api_context';

export default function CatData(onSubmit){
	const dbdata = React.useContext(ApiDataContext);
	const [data, setData] = useState(React.useContext(ApiDataContext));

	useEffect(() => {
		setData(dbdata);
	}, [dbdata]);

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit(event);
	};

	if (data) return (
			<div className="flex">
				{/* Read */}
				<div>
					<h1>DB Test</h1>
					<p>Testing database connection</p>
					{data.map((item) => (
						<div className="my-7">
						<p>Name: {item.name}</p>
						<p>Gender: {item.gender}</p>
						<p>Breed: {item.breed}</p>
						<p>Color: {item.color}</p>
						</div>
					))}
				</div>
				{/* Write */}
				<div>
					<h1>New cat</h1>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col">
							<label htmlFor="name">Name</label>
							<input type="text" name="name" id="name" />

							<label htmlFor="gender">Gender</label>
							<input type="text" name="gender" id="gender" />

							<label htmlFor="breed">Breed</label>
							<input type="text" name="breed" id="breed" />

							<label htmlFor="color">Color</label>
							<input type="text" name="color" id="color" />

							<button type="submit">Add cat</button>
						</div>
					</form>
				</div>
			</div>
	)
	else return (
		<div>
			<h1>DB Test</h1>
			<p>Awaiting database connection</p>
		</div>
	);
}