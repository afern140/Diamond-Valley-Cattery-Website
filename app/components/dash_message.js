"use client";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";

function DashMessage({message}) {

    function formatDate(dateISO) {
		const splitDateTime = dateISO.split("T"); // [0] is date, [1] is time
		const d = splitDateTime[0].split("-");
		const t = (splitDateTime[1].slice(0, splitDateTime[1].length - 5)).split(":");
		const date = d[2] + "-" + d[1] + "-" + d[0];
		const time = t[0] + ":" + t[1] + ":" + t[2];
		return (time + " " + date);
	}

    return (
        <div>
            {message && (
            <div className="flex w-full bg-[#EAEEF1] rounded-lg">
                <div className="px-3 py-2 w-full">
                    <h2>{message.name ? message.name : "<Username>"}</h2>
                    <h3 className=" text-sm">{message.text ? <span>"{message.text}"</span> : <span>""</span>}</h3>
                </div>
                <div className="w-full text-end px-3 py-2">
                    <h3 className="text-sm">Sent On: {message.timestamp ? formatDate(message.timestamp) : "<MsgDate>"}</h3>
                </div>
            </div>)
            }
        </div>
    );
  };
export default DashMessage;