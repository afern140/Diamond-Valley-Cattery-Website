"use client"
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";

const Navbar = () => {
    const [signOn, setSignOn] = useState(false);
    const handleClick = () => { setSignOn((signOn) => !signOn)}

  return (
    <div className="font-sans text-white font-normal text-base">
    <div className="w-full h-15 sticky mx-auto bg-gray-800 p-2">
        <div className="px-4 h-full sticky">
            <ul className="flex items-center text-white space-x-4 sticky">
                <li>
                  <Logo className="rounded-lg"/>
                </li>
                <li className="grow">
                    <p className="font-bold text-xl">Diamond Valley Cattery</p>
                </li>
                <li className=" ">
                    {(signOn == true) && <button className="px-4 py-2 rounded-full bg-white font-bold text-black" onClick={handleClick}>Sign In</button> }
                    {(signOn == false) && <button className="px-4 py-2 rounded-full bg-white font-bold text-black" onClick={handleClick}>Sign Out</button> }
                    {/*<button className="h-12 rounded-3xl bg-white font-bold px-5 text-black" onClick={handleClick}>Sign In</button>*/}
                </li>
            </ul>
          </div>
      </div>
      <div className="flex w-full h-10 bg-slate-400 sticky justify-between">
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">...</button></Link>
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">About</button></Link>
        <Link href="/pages/cats" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Cats</button></Link>
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Litters</button></Link>
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Vets</button></Link>
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Registry</button></Link>
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Contact</button></Link>
      </div>
    </div>
  );
};

export default Navbar;
//used bg-slate-400 to replace #305B73, cause background-color: rgb(48 91 115) is too different from the original color though it should be the same color