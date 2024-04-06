"use client"

import { useState, React } from "react";

function GradientColorButton({callback, theme, name}) {
    return (
        <button onClick={() => callback(theme)} className="relative flex-col z-20 rounded-xl p-2 hover:bg-gray-900 transition duration-300">
            <div className="space-y-2">
                <div className={"rounded-full size-20 bg-gradient-to-r" + theme} />
                <p>{name ? name : ""}</p>
            </div>
        </button>
    );
}

export default GradientColorButton;