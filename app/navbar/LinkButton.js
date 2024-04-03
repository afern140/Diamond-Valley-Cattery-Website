"use client"

import Image from "next/image";
import Link from "next/link";

const LinkButton = ({text, href, yellowBackdrop}) => {
    return (
      <Link className="rounded-full" href={href ? href : "/"}>
        <button className={"text-lg border size-fit m-auto px-4 py-2 rounded-full border-teal-500 hover:border-teal-50"
                          + (yellowBackdrop ? " bg-yellow-500 text-black" : "")}>
            {text ? text : "Navigate"}
        </button>
      </Link>
    );
};
export default LinkButton;