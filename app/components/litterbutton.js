import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

import { doc, getDoc } from "firebase/firestore";
import { db } from "../_utils/firebase";

function LitterButton({ id }) {
    const [width, setWidth] = useState(0);

    const [litter, setLitter] = useState(null);
    const [mother, setMother] = useState(null);
    const [father, setFather] = useState(null);
    const [children, setChildren] = useState([]);
    
    async function loadLitters() {
        //console.log(id);
        const litterRef = doc(db, "litters", id);
	    const litterSnap = await getDoc(litterRef);
        setLitter(litterSnap.data());

        //console.log(litterSnap.data());
        const motherRef = returnParent(litterSnap.data().mother);
        const fatherRef = returnParent(litterSnap.data().father);
        const childrenRef = returnChildren(litterSnap.data().children);
        const motherSnap = (motherRef === "") ? "" : await getDoc(motherRef);
        const fatherSnap = (fatherRef === "") ? "" : await getDoc(fatherRef);
        let childrenSnap = [];
        for (const c of childrenRef)  { childrenSnap.push( await getDoc(c)); }
        //console.log(childrenSnap);

        setMother(motherRef === "" ? "" : motherSnap.data().name);
        setFather(fatherRef === "" ? "" : fatherSnap.data().name);
        if (childrenRef.length > 0) {
            let childArr = []
            for (const child of childrenSnap) {
                if (child.data())  { childArr.push(child.data().name); }
                //setChildren([...children, child.data().name]);
            }
            setChildren(childArr);
        }
        //console.log(childrenSnap.map((child) => child.data().name));
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
        if (parent && parent._key && parent._key.path.segments)  { return doc(db, "cats", parent._key.path.segments[6]); }
        return "";
    }

    function returnChildren(children) {
        if (children && children.length > 0) {
            return children.map((child) => doc(db, "cats", child._key.path.segments[6]))
        }
        return [];
    }
    
    useEffect(() => {
       loadLitters();
    }, []);


    return (
        <Link href={`/litters/${id}`} className=" w-fit flex justify-start">
        { litter ? (
        <button className="flex font-bold p-2 text-black place-items-center">
            <Image
                alt="Kitty_Litter"
                src={ litter.imgURL ? litter.imgURL : "/img/Kitty_Litter.png" }
                width="200"
                height="200"
                style={{objectFit: "cover"}}
                className="justify-center align-center place-items-center"/>
            <div className=" pl-4 mb-auto" >
                <p className=" text-left text-3xl">{litter.name}</p>
                <p className=" text-xl font-medium text-left">Date: {returnDate(litter.expDate)}</p>
                <p className=" text-xl font-medium text-left">Parents: <span>{mother}</span> <span>{father}</span></p>
                <p className=" text-xl font-medium text-left">Children: {children.map((child) => (<span>{child} </span>))}</p>
            </div>
        </button> ) : (<div />) }
        </Link>
    );
  };
export default LitterButton;