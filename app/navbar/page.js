"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import LinkButton from "./LinkButton"
import {useUserAuth} from "../_utils/auth-context";
import { useTheme } from "next-themes";

const Navbar = () => {
    const {user,firebaseSignOut} = useUserAuth();
    function handleSignOut(){
      firebaseSignOut();
 }

 const [expandSettings, setExpandSettings] = useState(false);
 const { theme, setTheme } = useTheme("light");

  return (
    <div className="font-sans text-white font-normal text-base">
    <div className="w-full h-24 sticky mx-auto bg-teal-500 p-2">

      <div className="w-full m-auto flex">
        <div className="w-4/5 flex m-auto space-x-6">
          <div className="w-1/3">
            <Logo />
          </div>
          <div className="flex space-x-6">
            <LinkButton text="About" />
            <LinkButton text="Cats" href="/cats" />
            <LinkButton text="Litters" href="/litters" />
            <LinkButton text="Contact"/>
          </div>
          <div className="">

          </div>
        </div>

        {/* Settings */}
        <div className="absolute right-0 px-6 py-3">
          <button className={"p-2 rounded-xl relative transition duration-300 bg-yellow-500 text-black hover:bg-yellow-600 active:bg-yellow-400 active:translate-y-[2px] z-10 " + (expandSettings ? "bg-teal-600" : "")}
                            onClick={() => setExpandSettings(!expandSettings)}>Settings</button>
          <div className="bg-yellow-700 p-3 rounded-xl -translate-y-[21px] -z-20"/>

          { expandSettings &&
            <div className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 -translate-y-4 shadow transition duration-300">
              <div className="flex p-2 space-x-4 text-black dark:text-white">
                <p>Dark Theme</p>
                <button className="rounded-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  <div className={"w-12 h-6 rounded-full border-2 flex transition duration-200 bg-gray-700 dark:bg-green-400"} >
                    <div className={"bg-gray-300 dark:bg-white size-4 rounded-full m-auto transition duration-300 -translate-x-3 dark:translate-x-3"} />
                  </div>
                </button>
              </div>
            </div>
          }
        </div>
      </div>
      {/*
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
                {/*</li>
                <li>
                  <button className={"p-2 rounded-xl transition duration-300 hover:bg-gray-700 active:bg-gray-500 " + (expandSettings ? "bg-gray-600" : "")}
                          onClick={() => setExpandSettings(!expandSettings)}>Settings</button>

                  { expandSettings &&
                    <div className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 shadow mt-2 transition duration-300">
                      <div className="flex p-2 space-x-4 text-black dark:text-white">
                        <p>Dark Theme</p>
                        <button className="rounded-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                          <div className={"w-12 h-6 rounded-full border-2 flex transition duration-200 bg-gray-700 dark:bg-green-400"} >
                            <div className={"bg-gray-300 dark:bg-white size-4 rounded-full m-auto transition duration-300 -translate-x-3 dark:translate-x-3"} />
                          </div>
                        </button>
                      </div>
                    </div>
                  }

                </li>
            </ul>
          </div>
      
      </div>
      <div className="flex w-full h-10 bg-slate-300 justify-between -z-10 border-b-2 border-gray-700">
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">About</button></Link>
        <Link href="/cats" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Cats</button></Link>
        <Link href="/litters" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Litters</button></Link>
        <Link href="" className="flex-grow border-l border-r border-solid border-gray-700 text-center"><button className="mt-2">Contact</button></Link>
      </div>
    */}
    </div>
    </div>
  );
};

export default Navbar;
//used bg-slate-400 to replace #305B73, cause background-color: rgb(48 91 115) is too different from the original color though it should be the same color