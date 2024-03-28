"use client"
import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import {useUserAuth} from "../_utils/auth-context";


const Navbar = () => {
    const {user,firebaseSignOut} = useUserAuth();
    function handleSignOut(){
      firebaseSignOut();
 }

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
                    {!user && <Link href="../login"><button className=" p-2.5 rounded-3xl bg-white font-bold px-2 text-black">Sign In</button></Link> }
                    {user && <button className="p-2.5 rounded-3xl bg-white font-bold px-2 text-black" onClick={handleSignOut}>Sign Out</button> }
                    {/*<button className="h-12 rounded-3xl bg-white font-bold px-5 text-black" onClick={handleClick}>Sign In</button>*/}
                </li>
            </ul>
          </div>
      </div>
      <div className="flex w-full h-10 bg-[#305B73] sticky justify-between border-b-2 border-black">
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">About</button></Link>
        <Link href="/cats" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Cats</button></Link>
        <Link href="/litters" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Litters</button></Link>
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Contact</button></Link>
      </div>
    </div>
  );
};

export default Navbar;
//used bg-slate-400 to replace #305B73, cause background-color: rgb(48 91 115) is too different from the original color though it should be the same color