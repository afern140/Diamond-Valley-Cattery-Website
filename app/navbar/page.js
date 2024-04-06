"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"
import Logo from "./Logo";
import LinkButton from "./LinkButton"
import {useUserAuth} from "../_utils/auth-context";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import CustomCursor from "../components/CustomCursor";

import {db} from "../_utils/firebase";
import {auth} from "../_utils/firebase";
import {collection,addDoc,query,getDocs,Timestamp} from "firebase/firestore";

const Navbar = () => {
    const {user,firebaseSignOut} = useUserAuth();
    function handleSignOut(){
      firebaseSignOut();
 }

 const [expandSettings, setExpandSettings] = useState(false);
 const { theme, setTheme } = useTheme("light");
 const pathname = usePathname();

 const [expandNotifications, setExpandNotifications] = useState(false);

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

  useEffect(() => {
    if      (pathname.includes("/cats") || pathname.includes("/addcat"))     { choosePage("Cats"); }
    else if (pathname.includes("/litters"))  { choosePage("Litters"); }
    else if (pathname.includes(""))          { /* Set Navigation Button Active...*/ }
    
  }, [pathname]);


  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clickPostion, setClickPosition] = useState({ x: 0, y: 0 });
  const [contrastStartPos, setContrastStartPos] = useState({ x: 0, y: 0});
  const [contrastActive, setContrastActive] = useState(false);
  const [size, setSize] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
    //console.log("X: " + e.clientX + "\tY: " + e.clientY);
  };

  const handleMouseDown = (e) => {
    setClickPosition({ x: e.clientX, y: e.clientY });
  }

  const handleMouseUp = (e) => {
    setContrastActive(false);
  }

  function handleContrastEdit() {
    setContrastStartPos(position);
    setContrastActive(true);
  }

  const handleResize = (e) => {
    var x = e.currentTarget.innerWidth;
    var y = e.currentTarget.innerHeight;
    setSize({x: x, y: y});
  }

  const returnPositionLogic = (ePos, offset, useAbsolutePos) => {
    if (contrastActive) {
      var pos = (useAbsolutePos) ? {x: position.x + offset[0], y: position.y + offset[1]} : {x: (ePos.x - position.x + offset[0]), y: (ePos.y - position.y + offset[1])};
      console.log("returning: " + pos.x);
      return pos;
    }
    return [null, null]
  }

  return (
    <div className="font-sans text-black font-normal text-base pt-6 bg-[#9d5850] dark:bg-[#bc745a] z-40 relative">
    
    <div className="w-full sticky mx-auto p-2 z-0">
    {/*<div className="size-[400px] absolute -top-10 right-0 -z-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#E29DA7] via-[#00000000] to-[#00000000]" />*/}

      <div className="w-full h-full m-auto flex-col z-10 relative">
        <div className="w-full flex m-auto space-x-6">
          <div className="w-full pl-4 left-10">
            <Logo callback={choosePage} />
          </div>

          {/* Right-hand side button split */}
          <div className="w-full flex">
            {/* Notifications */}
            <div className="relative w-full flex m-auto justify-end">
              <button onClick={() => setExpandNotifications(!expandNotifications)}
              className="relative flex p-2 border-4 border-black rounded-full bg-white bg-opacity-0 hover:bg-opacity-30 transition duration-300 hover:scale-110">
                <Image alt="Notifications" src="/img/notification-icon.svg" width={40} height={40} />
              </button>

              { expandNotifications && 
              <div className="bg-white w-[400px] absolute top-16 border-4 rounded-xl p-2 overflow-hidden">
                <div className="h-10">
                  <p>Hello World </p>
                </div>
              </div>
              }
            </div>

            {/* Settings */}
            <div id="mousemove" className="relative justify-end px-10 z-40">
              <button className={"p-4 rounded-full relative transition duration-300 text-black border-black z-10 border-4 " + (expandSettings ? " bg-black bg-opacity-30 hover:scale-110 hover:bg-white hover:bg-opacity-30" : " hover:bg-white hover:bg-opacity-30 hover:scale-110")}
                                onClick={() => setExpandSettings(!expandSettings)}>Settings</button>
              {/*<div className="bg-yellow-700 p-3 rounded-xl -translate-y-[21px] -z-20"/>*/}

              { expandSettings &&
                (<div className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 translate-y-1 -translate-x-6 shadow transition duration-300 overflow-clip">
                  <div className="flex p-2 space-x-4 text-black dark:text-white">
                    <p>Dark Theme</p>
                    <div className="rounded-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                      <div className={"w-12 h-6 rounded-full border-2 flex transition duration-200 bg-gray-700 dark:bg-green-400"} >
                        <div className={"bg-gray-300 dark:bg-white size-4 rounded-full m-auto transition duration-300 -translate-x-3 dark:translate-x-3"} />
                      </div>
                    </div>
                  </div>
                  <div className="flex p-2 space-x-4 text-black dark:text-white relative">
                    <p>Contrast</p>
                    <div className="rounded-full w-full pr-2">
                      <div className={"w-full h-6 rounded-full border-2 flex transition duration-200 bg-gray-700 dark:bg-green-400"} >
                        <button onClick={() => handleContrastEdit()}
                          style={{left: `${returnPositionLogic(contrastStartPos, [-610, 0], true).x}px`}}
                          className={"absolute bg-gray-300 dark:bg-white size-4 rounded-full m-auto translate-x-1 translate-y-[2px]"} />
                      </div>
                    </div>
                  </div>
                  {user && <div className="relative z-40">
                    <Link className="relative z-40" href={"/dashboard"}>
                      <div className="relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 size-full text-left">
                        <span>Dashboard</span>
                      </div>
                    </Link>
                  </div>}
                  <div className="relative z-40">
                    <Link className="relative z-40" onClick={handleSignOut} href={user ? "" : "../login"}>
                      <div className="relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 size-full text-left" onClick={() => handleSignOut}>
                        {user ? <span>Sign Out</span> : <span>Sign In</span>}
                      </div>
                    </Link>
                  </div>
                </div>)
              }
            </div>
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
//used bg-slate-400 to replace #305B73, cause background-color: rgb(48 91 115) is too different from the original color though it should be the same color