"use client"

import Image from "next/image";
import Link from "next/link";

const LinkButton = ({text, href, selected, callback}) => {
    
  
  return (
      <Link onClick={() => callback(text)} className="rounded-full" href={href ? href : "/"}>
        <button className={"text-lg size-fit m-auto px-4 py-2 rounded-full hover:text-gray-500"
                          + (selected ? " text-white bg-black bg-opacity-70" : "")}>
            {text ? text : "Navigate"}
        </button>
      </Link>
    );
};
export default LinkButton;