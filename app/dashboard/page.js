"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";

export default function Page() {
    // const {user} = useUserAuth();
	const user = {
		name: "temp",
		username: "username",
		email: "temp@temp.com"
	}
    console.log(user);

	const [updatedUser, setUpdatedUser] = useState(user);
	const [image, setImage] = useState("/img/Placeholder.png")

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
	}

	const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
    }

    return(
        <main className="bg-white min-h-screen flex items-center justify-center text-black">
			<h1>Dashboard</h1>
			{user ? (
				<div>
					<Image
						src={image}
						alt="Profile Picture"
						width={100}
						height={100}
						className="border-2 border-black m-5"
					/>
					<input
						type="file"
						accept="image/"
						onChange={handleImageChange}>
					</input>
					<input
						type="text"
						name="name"
						placeholder={user.name}
						value={updatedUser.name}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="username"
						placeholder={user.username}
						value={updatedUser.username}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="phone"
						placeholder={user.phone}
						value={updatedUser.phone}
						onChange={handleChange}
					/>
					{/* <h2><Link>Reset Password</Link></h2> */}
				</div>
				) : (
				<div>Please <Link href="./login">log in</Link> to view your dashboard</div>
				)}
        </main>
    );

}