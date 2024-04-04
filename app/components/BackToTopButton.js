import Image from "next/image";
import Link from "next/link"
import { useState, useEffect } from "react";

export default function BackToTopButton({url}) {
	const scrollY = useScroll();
  
    return (
        <main className=" fixed bottom-0 p-16 right-0 z-40">
            { scrollY > 500 &&
                <Link href={url}>
                    <button className="text-rose-300 w-14 h-14 text-6xl rounded-full drop-shadow-md border-rose-300">
                    🢁
                    </button>
                </Link>
            }
        </main>
  );
}

function useScroll() {
	const [scrollY, setScrollY] = useState(0);
  
	useEffect(() => {
	  const handleScroll = () => {
		setScrollY(window.scrollY);
	  };
	  
	  // Add event listener
	  window.addEventListener("scroll", handleScroll);
	   
	  // Call handler right away so state gets updated with initial window size
	  handleScroll();
	  
	  // Remove event listener on cleanup
	  return () => {
		window.removeEventListener("scroll", handleScroll);
	  }
	  }, []); // Empty array ensures that effect is only run on mount
	return scrollY;
}