"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import LinkButton from "./LinkButton"
import {useUserAuth} from "../_utils/auth-context";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const {user,firebaseSignOut} = useUserAuth();
    function handleSignOut(){
      if (user) {
        console.log("Signing out...");
        firebaseSignOut();
      }
    }

 const [expandSettings, setExpandSettings] = useState(false);
 const { theme, setTheme } = useTheme("light");
 const pathname = usePathname();

 const [aboutSelected, setAboutSelected] = useState(false);
 const [catsSelected, setCatsSelected] = useState(false);
 const [littersSelected, setLittersSelected] = useState(false);
 const [contactSelected, setContactSelected] = useState(false);
 const [mousePos, setMousePos] = useState({ x: 0, y: 0});
 const [clickMousePos, setClickMousePos] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    if      (pathname.includes("/cats") || pathname.includes("/addcat"))     { choosePage("Cats"); }
    else if (pathname.includes("/litters"))  { choosePage("Litters"); }
    else if (pathname.includes(""))          { /* Set Navigation Button Active...*/ }
    
  }, [pathname])

  return (
    <div className="font-sans text-black font-normal text-base pt-6 bg-[#9d5850] dark:bg-[#bc745a] z-40 relative">
    <div className="w-full sticky mx-auto p-2 z-0">
    {/*<div className="size-[400px] absolute -top-10 right-0 -z-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#E29DA7] via-[#00000000] to-[#00000000]" />*/}

      <div className="w-full h-full m-auto flex-col z-10 relative">
        <div className="w-full flex m-auto space-x-6">
          <div className="w-1/4 pl-4 left-10 ">
            <Logo callback={choosePage} />
          </div>

          {/* Settings */}
          <div id="mousemove" className="absolute right-10 px-6 z-40">
            <button className={"p-4 rounded-full relative transition duration-300 text-black border-black z-10 border " + (expandSettings ? " bg-black bg-opacity-30" : "")}
                              onClick={() => setExpandSettings(!expandSettings)}>Settings</button>
            {/*<div className="bg-yellow-700 p-3 rounded-xl -translate-y-[21px] -z-20"/>*/}

            { expandSettings &&
              (<div className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 translate-y-1 -translate-x-6 shadow transition duration-300 overflow-clip">
                <div className="flex p-2 space-x-4 text-black dark:text-white">
                  <p>Dark Theme</p>
                  <button className="rounded-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <div className={"w-12 h-6 rounded-full border-2 flex transition duration-200 bg-gray-700 dark:bg-green-400"} >
                      <div className={"bg-gray-300 dark:bg-white size-4 rounded-full m-auto transition duration-300 -translate-x-3 dark:translate-x-3"} />
                    </div>
                  </button>
                </div>
                <div className="flex p-2 space-x-4 text-black dark:text-white relative">
                  <p>Contrast</p>
                  <div className="rounded-full w-full pr-2">
                    <div className={"w-full h-6 rounded-full border-2 flex transition duration-200 bg-gray-700 dark:bg-green-400"} >
                      <button
                              className={"bg-gray-300 dark:bg-white size-4 rounded-full m-auto transition duration-300 -translate-x-3 dark:translate-x-3"} />
                    </div>
                  </div>
                </div>
                {user && <div className="relative z-40">
                  <Link className="relative z-40" href={"/dashboard"}>
                    <button className="relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 size-full text-left">
                      Dashboard
                    </button>
                  </Link>
                </div>}
                <div className="relative z-40">
                  <Link className="relative z-40" onClick={handleSignOut} href={user ? "" : "../login"}>
                    <button className="relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 size-full text-left" onClick={() => handleSignOut}>
                      {user ? <span>Sign Out</span> : <span>Sign In</span>}
                    </button>
                  </Link>
                </div>
              </div>)
            }
          </div>
        </div>

      </div>
    </div>
        {/* Navigation Buttons */}
        <div className="w-full h-full flex m-auto mt-2 relative border border-[#eecbc7] dark:border-[#6f403a] -z-10">
          <div className="border-r border-[#eecbc7] dark:border-[#6f403a] w-full flex justify-center"><LinkButton text="About" selected={aboutSelected} callback={choosePage} /></div>
          <div className="border-r border-[#eecbc7] dark:border-[#6f403a] w-full flex justify-center"><LinkButton text="Cats" href="/cats" selected={catsSelected} callback={choosePage} /></div>
          <div className="border-r border-[#eecbc7] dark:border-[#6f403a] w-full flex justify-center"><LinkButton text="Litters" href="/litters" selected={littersSelected} callback={choosePage} /></div>
          <div className="w-full flex justify-center"><LinkButton text="Contact" href="/virtualcatroom" selected={contactSelected} callback={choosePage} /></div>
        </div>
    </div>
  );
};

export default Navbar;