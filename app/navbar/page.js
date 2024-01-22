"use client"
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import "./styles.css"


const Navbar = () => {
    const [signOn, setSignOn] = useState(false);
    const handleClick = () => { setSignOn((signOn) => !signOn)}

  return (
    <div className="navbar">
    <div className="w-full h-15 sticky mx-auto bg-gray-800 p-2">
        <div className="px-4 h-full sticky">
            <ul className="flex items-center text-white space-x-4 sticky">
                <li>
                    <Link href="/pages/about" className="rounded-lg">
                        <Logo className="rounded-lg"/>
                    </Link>
                </li>
                <li className="grow">
                    <p className="font-bold text-xl">Diamond Valley Cattery</p>
                </li>
                <li className=" ">
                    {(signOn == true) && <button className="signing-button" onClick={handleClick}>Sign In</button> }
                    {(signOn == false) && <button className="signing-button" onClick={handleClick}>Sign Out</button> }
                    {/*<button className="h-12 rounded-3xl bg-white font-bold px-5 text-black" onClick={handleClick}>Sign In</button>*/}
                </li>
            </ul>
          </div>
      </div>
      <div className="background-button-container">
        <Link href="" className="button-container"><button className="mt-2">...</button></Link>
        <Link href="" className="button-container"><button className="mt-2">About</button></Link>
        <Link href="/pages/cats" className="button-container"><button className="mt-2">Cats</button></Link>
        <Link href="" className="button-container"><button className="mt-2">Litters</button></Link>
        <Link href="" className="button-container"><button className="mt-2">Vets</button></Link>
        <Link href="" className="button-container"><button className="mt-2">Registry</button></Link>
        <Link href="" className="button-container"><button className="mt-2">Contact</button></Link>
      </div>
    </div>
  );
};

export default Navbar;