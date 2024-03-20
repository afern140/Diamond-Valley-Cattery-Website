"use client";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../_utils/firebase";
import ApiDataProvider from '@/app/_utils/api_provider';

const IDs = [
    { id: 0, link: "/img/Kitty_1.png",
      id: 1, link: "/img/Kitty_2.png" }
]

function CatButton({ id, name, breed, imageID}) {
    /*const [width, setWidth] = useState(0);

    const [cat, setCat] = useState(null);
    const [catName, setCatName] = useState(null)
    const [breedType, setBreedType] = useState(null)
    
    async function loadCats() {
        const catRef = doc(db, "cats", id);
	    const catSnap = await getDoc(catRef);
        setCat(catSnap.data());

        //console.log(catSnap.data());
        setCatName(catSnap.data().name);
        setBreedType(catSnap.data().breed);
    }

    useEffect(() => {
        loadCats();
     }, []);*/

    return (
        <ApiDataProvider>
            <Link href={`/cats/${id}`} className="w-full flex justify-center">
                <button className="flex-col font-bold p-2 text-black place-items-center">
                    <Image
                        alt="Kitty"
                        src={ id % 2 == 0 ? "/img/Kitty_1.png" : "/img/Kitty_2.png" }
                        /*width={width < 1024 ? "300" : "300"}
                        height={width < 1024 ? "300" : "300"}*/
						width={"300"}
						height={"300"}
                        className="justify-center align-center place-items-center"
                        objectFit="contain"/>
                    <p className=" mt-1">{name/* ? name : catName*/}</p>
                    <p className=" text-sm font-medium">{breed/* ? breed : breedType*/}</p>
                </button>
            </Link>
        </ApiDataProvider>
    );
  };
export default CatButton;