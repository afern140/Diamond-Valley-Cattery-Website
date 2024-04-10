import Image from "next/image";
import Link from "next/link"
import { useState, useEffect, componentDidMount } from "react";

export default function BackToTopButton({url}) {
	const scrollY = useScroll();

	useEffect (() => {
		
	}, []);

    return (
        <main className=" fixed bottom-0 p-16 right-0 z-40">
            { scrollY > 500 &&
                <Link href={url}>
                    <div className="text-[#092C48] bg-white size-12 text-3xl rounded-full drop-shadow-lg flex justify-center hover:scale-105 transition duration-300">
                    	<span className=" translate-y-[3px] drop-shadow-md">🢁</span>
                    </div>
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