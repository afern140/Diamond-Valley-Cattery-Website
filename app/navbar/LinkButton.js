"use client"

import Image from "next/image";
import Link from "next/link";

const LinkButton = ({text, href, selected, callback}) => {
    
  
  return (
      <Link onClick={() => callback(text)} className="rounded-full w-full" href={href ? href : "/"}>
        <button className={"text-xl size-full px-4 py-2  hover:text-gray-100 transition duration-300"
                          + (selected ? " text-white bg-black bg-opacity-70" : " bg-[#ca8076] dark:bg-[#ac7670] hover:dark:bg-[#7b5451]  hover:bg-black hover:bg-opacity-30")}>
            {text ? text : "Navigate"}
        </button>
      </Link>
    );
};
export default LinkButton;