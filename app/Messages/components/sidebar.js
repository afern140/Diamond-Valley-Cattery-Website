"use client";
import React from "react";
import Navbar from "./mNavbar";
import Search from "./search";
import Chats from "./chats";
const Sidebar = () => {
    return(
        <div className='messageSidebar'>
            <Navbar/>
            <Search/>
            <Chats />
        </div>
    )
}

export default Sidebar;