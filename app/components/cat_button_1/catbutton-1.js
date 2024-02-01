"use client";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import data from "@/app/cats/cat/cat.json"

const IDs = [
    { id: 0, link: "/img/Kitty_1.png",
      id: 1, link: "/img/Kitty_2.png" }
]

function CatButton({ picID }) {
    const [width, setWidth] = useState(0);
    const [ID, setID] = useState(picID);
    return (
        <Link href={{pathname: "/cats/cat", query: "Felix"}} className="w-full flex justify-center">
        <button className="flex-col font-bold p-2 text-black place-items-center">
            <Image
                alt="Kitty"
                src="/img/Kitty_1.png"
                width={width < 1024 ? "300" : "300"}
                height={width < 1024 ? "300" : "300"}
                className="justify-center align-center place-items-center"
                objectFit="contain"/>
            <p>Cat Name</p>
            <p>Cat Breed</p>
        </button>
        </Link>
    );
  };
export default CatButton;