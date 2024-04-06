"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";

const VirtualCatPlayroom = () => {
    const [catPosition, setCatPosition] = useState({ x: 0, y: 0});

    const handleMouseMove = (event) => {
        setCatPosition({ x: event.clientX, y: event.clientY });
        //console.log(catPosition);
    };

    window.onload = function() {

        document.getElementById("mousemove").onmousemove = function(e) {
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            console.log("Left: " + x + "; Top: " + y + "; Rect.left: " + rect.right + "; Rect.top: " + rect.top);
        }
    }

    return (
        <div className="relative h-screen flex justify-center items-center bg-blue-200"
                 onMouseMove={handleMouseMove}
                 id="mousemove">
            
            <div className="absolute"
                 style={{ left: catPosition.x, top: catPosition.y }}
            >
                <Image alt="Kitty" src="/img/Kitty_1.png" width={300} height={300} />
            </div>
        </div>
    )
}

export default VirtualCatPlayroom;