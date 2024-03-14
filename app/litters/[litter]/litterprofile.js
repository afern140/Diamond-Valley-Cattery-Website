import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation'
import Carousel from "@/app/components/carousel"
import LitterButton from "@/app/components/litterbutton_wrapper"

import ApiDataContext from '@/app/_utils/api_context';

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";

export default function LitterProfile({params}) {

	const [toggleKittens, setToggleKittens] = useState(false);
	const offButtonStyle = "rounded-xl py-2 px-4 bg-red-500 transition duration-150 active:bg-red-300"
	const onButtonStyle = "rounded-xl py-2 px-4 bg-green-500 transition duration-150 active:bg-green-300"

	const [litter, setLitter] = useState(null);
    const [mother, setMother] = useState(null);
    const [father, setFather] = useState(null);
    const [children, setChildren] = useState([]);
    
    async function loadLitters() {
        //console.log(id);
        const litterRef = doc(db, "litters", params.litter);
	    const litterSnap = await getDoc(litterRef);
        setLitter(litterSnap.data());

        //console.log(litterSnap.data());
        const motherRef = returnParent(litterSnap.data().mother);
        const fatherRef = returnParent(litterSnap.data().father);
        const childrenRef = returnChildren(litterSnap.data().children);
        const motherSnap = (motherRef === "") ? "" : await getDoc(motherRef);
        const fatherSnap = (fatherRef === "") ? "" : await getDoc(fatherRef);
        let childrenSnap = [];
        for (const c of childrenRef)  { childrenSnap.push(c._key.path.segments[1]); }
        //console.log(childrenSnap);

        setMother(motherRef === "" ? "" : motherSnap.data().name);
        setFather(fatherRef === "" ? "" : fatherSnap.data().name);
        if (childrenRef.length > 0) {
			setChildren(childrenSnap);
			console.log(childrenSnap);
		}
        //console.log(childrenSnap.map((child) => child.data()));
    }
    
    function returnDate(expected_date) {
        if (expected_date === undefined) { return "No Date"; }
        //console.log("Date: " + new Date(expected_date.seconds * 1000));
        
        // The 'Date' Object works with miliseconds, so we convert it by multiplying by 1000
		const date = new Date(expected_date.seconds * 1000);
		const sp = date.toUTCString().split(" ");
		return sp[1].concat(" ", sp[2], " ", sp[3]);
	}

    function returnParent(parent) {
        if (parent && parent._key && parent._key.path.segments)  { return doc(db, "litters", parent._key.path.segments[6]); }
        return "";
    }

    function returnChildren(children) {
        if (children && children.length > 0) {
            return children.map((child) => doc(db, "litters", child._key.path.segments[6]))
        }
        return [];
    }
    
    useEffect(() => {
       loadLitters();
    }, []);

	return(
		<main className="bg-gray-100">
			{litter ? (
				<section>
					<h1 className="text-black text-4xl text-center font-bold pt-8 pb-4">{litter.name}</h1>
					<Carousel />
					<div className="flex flex-row">
						<div className="flex flex-col text-black text-xl font-bold text-left">
							<div className="p-10 mx-10 mt-6 rounded-lg min-w-64">
								<h2 className="text-2xl mb-2">Details</h2>
								<h3>Expected Date: <span className="font-normal">{returnDate(litter.expDate)}</span></h3>
								<h3>Mother: <span className="font-normal">{mother}</span></h3>
								<h3>Father: <span className="font-normal">{father}</span></h3>
								<div className="mt-6"/>
								<h3>Notes: <span className="font-normal">{litter.notes}</span></h3>
							</div>
						</div>
						<div className="flex flex-col ml-auto mx-10 mt-14 mb-auto text-white text-xl font-bold text-center bg-cat-gray-1 p-6 rounded-lg">
							<h2>Want to Purchase {litter.name}?</h2>
							<Link href={"/chat"}><button className="bg-white text-cat-gray-1 font-normal p-2 m-2 rounded-md">Request a Meeting</button></Link>
						</div>
					</div>

					{/* Toggle Button Section */}
					{!toggleKittens && 
					<div className=" justify-end flex px-10 pb-10">
						<button className={toggleKittens ? onButtonStyle : offButtonStyle} onClick={() => (setToggleKittens(!toggleKittens))}>
							Toggle Kittens<br/> {toggleKittens ? <span className="font-bold">On</span> : <span className="font-bold">Off</span>}
						</button>
					</div>
					}

					{/* Kittens Section */}
					{ toggleKittens && 
					<div className="text-black text-xl font-bold px-10 pb-10">
						<h2 className="text-2xl mx-10 mt-6">Kittens</h2>
						<div className="flex flex-wrap">
							{
								children.map((child) => 
									(
									<div>
										<LitterButton id={child} />
									</div>
								))
							}
						</div>
					</div>}
				</section>
			) : (
				<h1 className="text-black text-3xl text-center font-bold p-5">Error 404: Cat Not Found.</h1>
			)}
		</main>
	)
}