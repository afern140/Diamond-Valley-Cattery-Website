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

 const [expandUser, setExpandUser] = useState(false);
 const [expandSettings, setExpandSettings] = useState(false);
 const { theme, setTheme } = useTheme("light");
 const pathname = usePathname();
 const [toggleLargeCursor, setToggleLargeCursor] = useState(false);


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
      var pos = (useAbsolutePos) ? {x: Math.min(Math.max((position.x + offset[0]), 0), 100),
                                    y: Math.min(Math.max(position.y + offset[1], 0), 100)}
                                 : {x: Math.min(Math.max((ePos.x - position.x + offset[0]), 0), 100),
                                    y: Math.min(Math.max((ePos.y - position.y + offset[1]), 0), 100)};
      console.log("returning: " + pos.x + "; " + pos.y);
      return pos;
    }
    return [null, null]
  }

  return (
    <div className="font-sans text-black font-normal text-base pt-6 bg-navbar-body-0 dark:bg-dark-navbar-body-0 z-40 relative">
    {toggleLargeCursor ? <CustomCursor /> : null}

    <div className="w-full sticky mx-auto p-2 z-0">
    {/*<div className="size-[400px] absolute -top-10 right-0 -z-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#E29DA7] via-[#00000000] to-[#00000000]" />*/}

      <div className="w-full h-full m-auto flex-col z-10 relative">
        <div className="w-full flex m-auto space-x-6">
          <div className="w-full pl-4 left-10">
            <Logo callback={choosePage} />
          </div>

          {/* Right-hand side button split */}
          <div className="w-full flex">
            {/* Settings */}
            <div id="mousemove" className="relative justify-end flex m-auto w-full px-10 z-40">
              <button className={"p-2 rounded-full relative transition duration-300 text-black z-10 border-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] " + (expandUser ? " bg-white bg-opacity-90 hover:scale-110 hover:bg-white hover:bg-opacity-100 border-gray-500 hover:border-gray-700" : " hover:bg-white hover:bg-opacity-90 bg-white bg-opacity-70 hover:scale-110 border-black hover:border-gray-700")}
                                onClick={() => setExpandUser(!expandUser)}><Image alt="user" src="/img/userprofile.png" width={48} height={48} /></button>
              {/*<div className="bg-yellow-700 p-3 rounded-xl -translate-y-[21px] -z-20"/>*/}

              {/*<div className="absolute -z-10 bg-white size-16 rounded-full bg-opacity-80 drop-shadow-lg">
                <Image alt="user" src="/img/userprofile.png" width={48} height={48} className="m-auto mt-2"/>
              </div>

              {/* Blocker Element *//*}
              <div className=" h-16 w-32 absolute right-[105px] z-10 opacity-0"/>
              <select className=" opacity-0 h-16 w-32">
                <option value="Settings" >
                  <div>
                    <Image alt="Settings" src="/img/settings.svg" width={32} height={32} />
                    <span>Settings</span>
                  </div>
                </option>
                {user ? (
                <>
                  <option value="Dashboard" >Dashboard</option>
                  <option value="Sign Out" >Sign Out</option>
                </>
                ) : (
                <div>
                  <option value="Sign In" >Sign In</option>
                </div>
                )}
              </select>
              */}
              { expandUser &&
                (<div className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 translate-y-[72px] -translate-x-6 shadow transition duration-300 overflow-clip">
                  <div className="relative w-full z-40">
                    <button className="relative w-full z-40 " onClick={() => setExpandSettings(!expandSettings)}>
                      <div className={"relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 size-full text-left" + (expandSettings ? " bg-gray-200 dark:bg-gray-400 hover:bg-gray-300 active:bg-gray-400" : " dark:hover:bg-gray-700 hover:bg-gray-200 active:bg-gray-400")}>
                        <Image alt="Settings" src="/img/settings.svg" width={32} height={32} />
                        <span className="my-auto pl-2">Settings</span>
                      </div>
                    </button>
                  </div>
                  {user && <div className="relative z-40 border-y">
                    <Link className="relative z-40 " href={"/dashboard"}>
                      <div className="relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 active:bg-gray-400 size-full text-left">
                        <Image alt="Settings" src="/img/dashboard.png" width={32} height={32} />
                        <span className="my-auto pl-2">Dashboard</span>
                      </div>
                    </Link>
                  </div>}
                  <div className="relative z-40">
                    <Link className="relative z-40" onClick={handleSignOut} href={user ? "" : "../login"}>
                      <div className="relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 active:bg-gray-400 size-full text-left" onClick={() => handleSignOut}>
                        <Image className="-translate-x-1" alt="Settings" src="/img/sign-in.png" width={32} height={32} />
                        {user ? <span className="my-auto pl-2">Sign Out</span> : <span className="my-auto pl-2">Sign In</span>}
                      </div>
                    </Link>
                  </div>
                </div>)
              }
              {expandSettings && expandUser && 
                (<div className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 translate-y-[72px] -translate-x-[344px] shadow transition duration-300 overflow-clip">
                <div className="flex p-2 space-x-4 text-black dark:text-white">
                  <p>Dark Theme</p>
                  <button className="rounded-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <div className={"w-12 h-6 rounded-full border-2 flex transition duration-200 bg-gray-700 dark:bg-green-400"} >
                      <div className={"bg-gray-300 dark:bg-white size-4 rounded-full m-auto transition duration-300 -translate-x-3 dark:translate-x-3"} />
                    </div>
                  </button>
                </div>
                <div className="flex p-2 space-x-4 text-black dark:text-white">
                  <p>Large Cursor</p>
                  <button className="rounded-full" onClick={() => setToggleLargeCursor(!toggleLargeCursor)}>
                    <div className={"w-12 h-6 rounded-full border-2 flex transition duration-200 " + (toggleLargeCursor ? " bg-green-400 " : " bg-gray-700 dark:bg-gray-500")} >
                      <div className={"bg-gray-300 dark:bg-white size-4 rounded-full m-auto transition duration-300 " + (toggleLargeCursor ? " translate-x-3" : " -translate-x-3")} />
                    </div>
                  </button>
                </div>
              </div>)
              }
            </div>
          </div>
        </div>

      </div>
    </div>

        {/* Navigation Buttons */}
        <div className="w-full h-full flex m-auto mt-2 relative border border-navbar-body-2  -z-10">
          <div className="border-r border-navbar-body-2  w-full flex justify-center"><LinkButton text="About" selected={aboutSelected} callback={choosePage} /></div>
          <div className="border-r border-navbar-body-2  w-full flex justify-center"><LinkButton text="Cats" href="/cats" selected={catsSelected} callback={choosePage} /></div>
          <div className="border-r border-navbar-body-2  w-full flex justify-center"><LinkButton text="Litters" href="/litters" selected={littersSelected} callback={choosePage} /></div>
          <div className="w-full flex justify-center"><LinkButton text="Contact" href="/virtualcatroom" selected={contactSelected} callback={choosePage} /></div>
        </div>
    </div>
  );
};

export default Navbar;
//used bg-slate-400 to replace #305B73, cause background-color: rgb(48 91 115) is too different from the original color though it should be the same color