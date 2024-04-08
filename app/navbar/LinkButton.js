"use client"

import Image from "next/image";
import Link from "next/link";

const LinkButton = ({text, href, selected, callback}) => {
    
  
  return (
      <Link onClick={() => callback(text)} className=" w-full" href={href ? href : "/"}>
        <p className={"text-xl size-full px-4 py-2 text-center hover:text-gray-100 transition duration-300 "
                          + (selected ? " text-white bg-[#092C48] bg-opacity-100" : " bg-navbar-body-1 dark:bg-navbar-body-1 hover:bg-[#092C48] hover:dark:bg-dark-navbar-body-2 hover:bg-opacity-100")}>
            {text ? text : "Navigate"}
        </p>
      </Link>
    );
};
export default LinkButton;