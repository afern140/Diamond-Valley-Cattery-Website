"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {db} from "../_utils/firebase";
import {auth} from "../_utils/firebase";
import {collection,addDoc,query,getDocs,Timestamp} from "firebase/firestore";

export default function Comments({ cat, user }) {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		console.log("No cats are good cats.")
		try {
			getComments(cat).then((comments) => {
				const sortedComments = comments.sort((a, b) => b.createTime - a.createTime);
				setComments(sortedComments);
			});
		}
		catch (error) {
			console.error("Error getting comments: ", error);
		}
	}, [] );

	return (
		<section className="text-gray-800 pt-4 w-full mt-10">
			<h1 className="text-5xl font-bold text-center text-gray-700 dark:text-dark-header-text-0 drop-shadow">Comments</h1>
			<div className=" m-auto flex-col justify-center bg-white dark:bg-gray-500 bg-opacity-100 mt-10 p-8 drop-shadow-lg rounded-xl  overflow-hidden">
				<NewComment cat={cat} setComments={setComments} user={user}/>
				<div className="w-full h-[1px] bg-gray-300 my-12" />
				<div className="overflow-y-auto max-h-[1000px]">
					{comments.map((comment) => (
						<Comment 
							key={comment.id}
							createTime={comment.createTime ? new Date(comment.createTime.toDate().toISOString().split('T'[0])) : new Date() }
							catName={comment.catName}
							message={comment.message}
							createName={comment.createName}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

async function getComments(cat){
	const itemsRef = collection(db, 'cats', cat.docId, 'comments');
	const q = query(itemsRef);
	const snapshot = await getDocs(q);
	const itemsList = snapshot.docs.map((doc) => {
		return {id: doc.id, ...doc.data()};
	});
	return itemsList;
}

async function addComment(commentDoc,cat){
	//console.log("Entered addComment.")
	const itemsRef = collection(db, 'cats', cat.docId, 'comments');
	console.log("Cat in add comment is: ");
	console.log(cat.docId);
	const docRef = await addDoc(itemsRef, commentDoc);
	return docRef.id;
}

function NewComment({ cat, setComments, user }) {
	const [message, setMessage] = useState("");
	const currentCat = cat

	async function handleAddComment(e){
		e.preventDefault();
		const date = new Date();
		const timestamp = Timestamp.fromDate(date);
		const commentDoc = {
			message: message,
			createUID: auth.currentUser.uid,
			createName: auth.currentUser.displayName,
			catID: currentCat.id,
			catName: currentCat.name,
			createTime: timestamp
		};
		await addComment(commentDoc,cat);
		setMessage("");
		setComments((prevComments) => [...prevComments, commentDoc]);
		//window.location.reload();
	}

	return(
		<div className="text-black mt-8">
			<h2 className="text-3xl flex flex-col items-center pb-4">New Comment</h2>
			{ user ? (
				<form onSubmit={handleAddComment} className="mb-8 flex flex-col items-center">
					<textarea  
						type="text"
						placeholder="Comment Here"
						value = {message}
						onChange={(e) => setMessage(e.target.value)}
						className="border-s-4 border-[#c7c7e1] max-h-[300px] p-2 mb-16 w-full rounded-md min-h-32 drop-shadow-lg text-black bg-navbar-body-1 dark:bg-gray-300"
					/>
					<button type="submit" className=" drop-shadow-lg bg-navbar-body-1 dark:bg-gray-300 rounded text-black py-4 text-2xl px-6 transition duration-300 hover:scale-110">
						Comment
					</button>
				</form>
			) : (
				<div className="w-full flex">
					<Link href={"/login"} className=" drop-shadow-lg justify-center mx-auto mt-6 bg-navbar-body-1  dark:bg-gray-300 rounded text-black py-4 text-2xl px-6 transition duration-300 hover:scale-110">
						Sign In to Comment
					</Link>
				</div>
			)}
		</div>
	);
}

function Comment({catName, message, createName, createTime}) {
	//console.log("Entered Comment.");
	//console.log(createTime);
	return (
		<div className="text-black w-full bg-navbar-body-1 dark:bg-gray-300 p-4 my-4 rounded-xl drop-shadow-lg">
			<h2 className="text-xl mb-4">{createName}</h2>
			<p className="mb-4 w-full text-ellipsis overflow-y-auto max-h-[300px]">{message}</p>
			<p>Posted on: {createTime.toLocaleDateString()}</p>
		</div>
	);
}