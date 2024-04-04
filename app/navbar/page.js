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

 const [aboutSelected, setAboutSelected] = useState(false);
 const [catsSelected, setCatsSelected] = useState(false);
 const [littersSelected, setLittersSelected] = useState(false);
 const [contactSelected, setContactSelected] = useState(false);

 function choosePage(name) {
    switch (name) {
      case "Home":
        setAboutSelected(false);  setCatsSelected(false);  setLittersSelected(false);  setContactSelected(false);
        break;
      case "About":
        setAboutSelected(true);  setCatsSelected(false);  setLittersSelected(false);  setContactSelected(false);
        break;
      case "Cats":
        setAboutSelected(false);  setCatsSelected(true);  setLittersSelected(false);  setContactSelected(false);
        break;
      case "Litters":
        setAboutSelected(false);  setCatsSelected(false);  setLittersSelected(true);  setContactSelected(false);
        break;
      case "Contact":
        setAboutSelected(false);  setCatsSelected(false);  setLittersSelected(false);  setContactSelected(true);
        break;
      default:
        break;
    }
 }

  return (
    <div className="font-sans text-black font-normal text-base pt-10 bg-[#EBB7A6] z-10">
    <div className="w-full h-24 sticky mx-auto p-2">
    <div className="size-[400px] absolute -top-10 right-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#E29DA7] via-[#00000000] to-[#00000000]" />


      <div className="w-full m-auto flex z-10 relative">
        <div className="w-full flex m-auto space-x-6">
          <div className="w-1/4 pl-4 absolute left-10 ">
            <Logo callback={choosePage} />
          </div>
          <div className="w-full h-full flex">
            <div className="flex m-auto space-x-6 bg-white p-2 rounded-full bg-opacity-50">
              <LinkButton text="About" selected={aboutSelected} callback={choosePage} />
              <LinkButton text="Cats" href="/cats" selected={catsSelected} callback={choosePage} />
              <LinkButton text="Litters" href="/litters" selected={littersSelected} callback={choosePage} />
              <LinkButton text="Contact" selected={contactSelected} callback={choosePage} />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="absolute right-10 px-6">
          <button className={"p-4 rounded-full relative transition duration-300 text-black border border-black z-10 " + (expandSettings ? "bg-teal-600" : "")}
                            onClick={() => setExpandSettings(!expandSettings)}>Settings</button>
          {/*<div className="bg-yellow-700 p-3 rounded-xl -translate-y-[21px] -z-20"/>*/}

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
    </div>
    </div>
  );
};

export default Navbar;