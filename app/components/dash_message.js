"use client";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

function DashMessage({username, msgContent, msgDate}) {
    return (
        <div className="flex w-full bg-[#EAEEF1] rounded-lg">
            <div className="px-3 py-2 w-full">
                <h2>{username ? username : "<Username>"}</h2>
                <h3 className=" text-sm">{msgContent ? msgContent : "<MsgContent>"}</h3>
            </div>
            <div className="w-full text-end px-3 py-2">
                <h3 className="text-sm">Sent On: {msgDate ? msgDate : "<MsgDate>"}</h3>
            </div>
        </div>
    );
  };
export default DashMessage;