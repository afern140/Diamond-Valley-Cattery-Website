'use client'
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useUserAuth } from "@/app/_utils/auth-context";
import { useTheme } from "next-themes";
import CustomCursor from "@/app/components/CustomCursor";

export default function Header() {
	const { user, dbUser, firebaseSignOut } = useUserAuth();

	//Settings menu values
	//Expands the main user menu
	const [expandUser, setExpandUser] = useState(false);
	//Expands the secondary settings menu
	const [expandSettings, setExpandSettings] = useState(false);

	//Fiona's settings menu values
	const { theme, setTheme } = useTheme("light");
	const [toggleLargeCursor, setToggleLargeCursor] = useState(false);

	function handleSignOut() {
		firebaseSignOut();
	}
	
	//Closes the expanded settings menu
	function handleCloseSettings() {
		setExpandSettings(false);
	}

	//Closes menus when clicking outside of them
	const settingsRef = useRef(null);
	useEffect(() => {
		// only add the event listener when the menu is expanded
        if (!expandUser) return;

        function handleClick(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setExpandSettings(false);
                setExpandUser(false);
            }
        }
        window.addEventListener("mouseup", handleClick);
        return () => { window.removeEventListener("mouseup", handleClick); }
	}, [expandSettings, expandUser]);

	return(
		<nav className="font-sans text-black font-normal text-base pt-6 bg-navbar-body-0 dark:bg-dark-navbar-body-0 z-[100] relative" role="navigation">
			{toggleLargeCursor && <CustomCursor />}
			<div className="w-full sticky mx-auto p-	 z-50">
				{/* Top of header: Logo and Sign In/Settings */}
				<div className="w-full flex space-x-6 relative z-50">
					{/* Logo, links to home */}
					<div className="w-full pl-4 left-10">
						<div className="flex m-auto">
							<Link href="/" className="flex">
								<Image
								src="/img/Placeholder.png"
								alt="Logo"
								width={"50"}
								height={"50"}
								className="relative"
								/>
								<h1 className="ml-2 text-md m-auto text-white">Diamond Valley Cattery</h1>
							</Link>
						</div>
					</div>
					{/* Sign In/Settings */}
					<div className="w-full flex">
						{/* Initial menu button */}
						<div className="relative justify-end flex m-auto w-full px-10 z-40">
							<button ref={settingsRef}  className={"rounded-full relative transition duration-300 text-black z-10 border-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] " + (expandUser ? " bg-white bg-opacity-90 hover:scale-110 hover:bg-white hover:bg-opacity-100 border-gray-500 hover:border-gray-700" : " hover:bg-white hover:bg-opacity-90 bg-white bg-opacity-70 hover:scale-110 border-black hover:border-gray-700")}
                                onClick={() => setExpandUser(!expandUser)}>
									<div className="-z-10 bg-white rounded-full bg-opacity-80 drop-shadow-lg overflow-hidden">
										<Image alt="user" src={dbUser && dbUser.thumbnail ? dbUser.thumbnail : "/img/userprofile.png"} width={72} height={72} className="m-auto"/>
									</div>
							</button>
						</div>
						{/* Expanded user menu */}
						{ expandUser && 
						<div ref={settingsRef} className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 translate-y-[72px] -translate-x-6 shadow transition duration-300 overflow-clip">
							{/* Expands the settings menu */}
							<div className="relative w-full z-40">
								<button className="relative w-full z-40 " onClick={() => setExpandSettings(!expandSettings)}>
									<div className={"relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 size-full text-left" + (expandSettings ? " bg-gray-200 dark:bg-gray-400 hover:bg-gray-300 active:bg-gray-400" : " dark:hover:bg-gray-700 hover:bg-gray-200 active:bg-gray-400")}>
										<Image alt="Settings" src="/img/settings.svg" width={32} height={32} />
										<span className="my-auto pl-2">Settings</span>
									</div>
								</button>
							</div>
							{/* Dashboard link */}
							{ user &&
							<div className="relative z-40 border-y">
								<Link className="relative z-40 " href={"/dashboard"}>
									<div className="flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 size-full text-left">
										<Image alt="Dashboard" src="/img/dashboard.png" width={32} height={32} />
										<span className="my-auto pl-2">Dashboard</span>
									</div>
								</Link>
							</div>}
							{/* Sign Out/Sign In */}
							<div className="relative z-40">
								<Link className="relative z-40" onClick={handleSignOut} href={user ? "" : "../login"}>
									<div className="relative z-40 flex p-2 w-full text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-200 active:bg-gray-400 size-full text-left" onClick={() => handleSignOut}>
										<Image className="-translate-x-1" alt="Settings" src="/img/sign-in.png" width={32} height={32} />
										{user ? <span className="my-auto pl-2">Sign Out</span> : <span className="my-auto pl-2">Sign In</span>}
									</div>
								</Link>
							</div>
						</div>
						}

						{/* Expanded settings menu */}
						{expandSettings && expandUser && 
						(<div ref={settingsRef} className="bg-white dark:bg-gray-600 w-80 h-fit absolute right-0 z-40 rounded-lg border-2 border-gray-300 translate-y-[72px] -translate-x-[344px] shadow transition duration-300 overflow-clip">
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
				{/* Bottom of header: Navigation */}
			</div>
			<div className="w-full h-full flex m-auto mt-2 relative border border-navbar-body-2  -z-10">
				{/*<div className="border-r border-navbar-body-2  w-full flex justify-center hover:text-gray-100 transition duration-300 text-white bg-[#092C48] bg-opacity-100 hover:bg-navbar-body-1 hover:bg-[#092C48] hover:dark:bg-[#092C48]">
					<Link href="/">About</Link>
					</div>*/}
				<LinkButton text="About" href="/about" />
				<LinkButton text="Cats" href="/cats" />
				<LinkButton text="Litters" href="/litters" />
				<LinkButton text="Contact" href="/contact" />
			</div>
		</nav>
	)
	
}

const LinkButton = ({text, href}) => {
	const pathname = usePathname()
    const selected = pathname.includes(href)
  
	return (
		<Link className="border-r border-navbar-body-2 w-full" href={href ? href : "/"}>
		  <p className={"text-xl size-full px-4 py-2 text-center hover:text-gray-100 transition duration-300 "
							+ (selected ? " text-white bg-[#092C48] bg-opacity-100" : " bg-navbar-body-1 hover:bg-[#092C48] hover:dark:bg-[#092C48]")}>
			  {text ? text : "Navigate"}
		  </p>
		</Link>
	  );
  };