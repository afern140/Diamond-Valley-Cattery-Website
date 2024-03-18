"use client";
import { Space_Mono } from "next/font/google";
import React from "react";

const Message = () => {
    return(
        <div className='message owner'>
            <div className='messageInfo'>
                <img src="https://plus.unsplash.com/premium_photo-1709143101238-ed5c82ada0fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8" alt=""/>
            <span>Just now</span>
            </div>
            <div className='messageContent'>
                <p>Hello</p>
                <img src="https://plus.unsplash.com/premium_photo-1709143101238-ed5c82ada0fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8" alt=""/>
            </div>
        </div>
    )
}

export default Message;
