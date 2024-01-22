"use client";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

const IDs = [
    { id: 0, link: "/img/Kitty_1.png",
      id: 1, link: "/img/Kitty_2.png" }
]

const CatButton = ({picID}) => {
    const [width, setWidth] = useState(0);
    const [ID, setID] = useState(picID);

    return (
        <Link href="/pages/cats/profile">
        <button className="flex-col font-bold p-2 text-black place-items-center">
            <Image
                src="/img/Kitty_1.png"
                width={width < 1024 ? "130" : "250"}
                height={width < 1024 ? "45" : "74"}
                className="justify-center align-center place-items-center"
                objectFit="contain"/>
            <p>Cat Name</p>
            <p>Cat Breed</p>
        </button>
        </Link>
    );
  };
export default CatButton;