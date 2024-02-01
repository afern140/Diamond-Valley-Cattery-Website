"use client";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import data from "@/app/cats/[cat]/cat.json"

const IDs = [
    { id: 0, link: "/img/Kitty_1.png",
      id: 1, link: "/img/Kitty_2.png" }
]

function CatButton({ id, name, age, color, eye_color, breed, gender, vaccinations, conditions, fatherID, motherID, children }) {
    const [width, setWidth] = useState(0);

    return (
        <Link href={{pathname: "/cats/cat", query: {id}}} className="w-full flex justify-center">
        <button className="flex-col font-bold p-2 text-black place-items-center">
            <Image
                alt="Kitty"
                src={ id % 2 == 0 ? "/img/Kitty_1.png" : "/img/Kitty_2.png" }
                width={width < 1024 ? "300" : "300"}
                height={width < 1024 ? "300" : "300"}
                className="justify-center align-center place-items-center"
                objectFit="contain"/>
            <p className=" mt-1">{name}</p>
            <p className=" text-sm font-medium">{breed}</p>
        </button>
        </Link>
    );
  };
export default CatButton;