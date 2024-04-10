"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";

// This functional component represents a custom cursor with a flare effect.
function CustomCursor() {
  // State to track the current cursor position (x, y coordinates).
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // State to track whether the cursor is over a clickable element.
  const [isPointer, setIsPointer] = useState(false);

  // Event handler for the mousemove event.
  const handleMouseMove = (e) => {
    // Update the cursor position based on the mouse coordinates.
    setPosition({ x: e.clientX, y: e.clientY });

    // Get the target element that the cursor is currently over.
    const target = e.target;

    // Check if the cursor is over a clickable element by inspecting the cursor style.
    setIsPointer(
      window.getComputedStyle(target).getPropertyValue("cursor") === "pointer"
    );
  };

  // Set up an effect to add and remove the mousemove event listener.
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // The empty dependency array ensures that this effect runs only once on mount.

  // Calculate the size of the flare based on whether the cursor is over a clickable element.
  const flareSize = isPointer ? 48 : 64;

  // Adjust the cursor position to create a visual effect when over a clickable element.
  const cursorStyle = isPointer ? { left: "-100px", top: "-100px" } : { left: "-100px", top: "-100px" };

  function changeCursor(cursor) {
    document.getElementById("body").style.cursor = cursor;
  }

  useEffect(() => {
    console.log("Hiding cursor!");
    changeCursor("none");

    return () => {
      changeCursor("auto");
    };
  }, []);

  // Render the custom cursor element with dynamic styles based on cursor state.
  return (
    <div
      className={" fixed pointer-events-none -translate-x-1/3 z-[200] transition cursor-none " + (isPointer ? " opacity-100 -translate-y-[10%]" : " -translate-y-[20%]")}
      style={{
        ...cursorStyle,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${flareSize}px`,
        height: `${flareSize}px`,
      }}
    >
      {isPointer ? <Image alt="cursor-hover" src="/img/big-cursor-hover.svg" width={512} height={512} />
                 : <Image alt="cursor" src="/img/big-cursor.svg" width={512} height={512} />}
    </div>
  );
}

// Export the FlareCursor component to be used in other parts of the application.
export default CustomCursor;