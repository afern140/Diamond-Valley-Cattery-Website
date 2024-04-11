"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../_utils/firebase";
import { useUserAuth } from "@/app/_utils/auth-context";
import { useChat } from "@/app/_utils/chat-context";
import Link from "next/link";
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function page() {
	const { user } = useUserAuth();
	const [threads, setThreads] = useState([]);

	const getThreads = async (user) => {
		const threadsDocuments = await getDocs(query(collection(db, "chats"), where("users", "array-contains", user.uid)));
		const threadsData = threadsDocuments.docs.map((doc) => ({docId: doc.id, ...doc.data()}))
		const threads = await Promise.all(threadsData.map(async (thread) => {
			const message = (await getDoc(thread.messageRefs[thread.messageRefs.length - 1])).data();
			const recipient = (await(getDocs(query(collection(db, "users"), where("uid", "==", thread.users.find(uid => uid !== user.uid)))))).docs.map(doc => doc.data())[0];
			return { ...thread, recipient: recipient, latestMessage: message };
		}));
		return threads;
	}

	useEffect(() => {
		if (user) {
			console.log("Fetches all the user's message threads");
			const fetchThreads = async () => {
				const threads = await getThreads(user);
				setThreads(threads);
				console.log(threads);
			};
		fetchThreads();
		}
	}, [user]);

	return (
		<div className="relative text-header-text-0 min-h-[66vh] h-fit pb-16">
			<BackgroundUnderlay />
			{/* Header */}
			<div className="pt-20 flex pb-10">
				<div className="w-4/5 m-auto justify-center flex-col text-center mx-auto inline-block font-bold bg-[#092C48] dark:bg-dark-header-text-0 text-transparent bg-clip-text pb-2">
				<span className="text-6xl pb-10 font-extrabold">Messages</span> <br />
				</div>
			</div>
			<div className="w-4/5 bg-white mx-auto p-10 dark:bg-gray-500 relative rounded-xl drop-shadow-lg">
				{threads ? (
					<div>
						{threads.map((thread) => (
							<div className="space-y-4">
								<Link key={thread.docId} href={`/messages/${thread.docId}`}>
								<div className="block p-2 hover:bg-gray-200 cursor-pointer">
									<h2 className="font-bold">{thread.recipient.username}</h2><br/>
									<h3>{thread.latestMessage.displayName}: Sent on {new Date(thread.latestMessage.timestamp.toDate()).toLocaleDateString()}</h3>
									<h2>{thread.latestMessage.text}</h2>
								</div>
								</Link>
							</div>
						))}
					</div>
				) : <h1>Loading</h1>}
			</div>
		</div>
	);
};
