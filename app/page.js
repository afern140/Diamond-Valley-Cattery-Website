"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { getObject } from './_utils/firebase_services';
import CarouselDefault from './components/images/carousel';
import Button from './components/displaybutton'
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Home() {
	const [images, setImages] = useState();

	useEffect(() => {
		const fetchImages = async () => {
			const images = await getObject('images', 'home');
			setImages(images.carouselImages);
		};
		fetchImages();
	}, []);

  return (
    <main className=" relative overflow-hidden">
      <div className="relative size-full">
        <BackgroundUnderlay />

        {/* Paw Prints */}
        <div className="absolute z-10 opacity-10 size-full">
          <Image className="absolute top-0 right-0 -translate-x-16 translate-y-10 rotate-[45deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />        
          <Image className="absolute top-0 right-0 -translate-x-10 translate-y-40 rotate-[45deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />
          <Image className="absolute top-0 left-0 translate-x-10 translate-y-40 rotate-[12deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />
          <Image className="absolute top-0 left-0 translate-x-20 translate-y-[260px] rotate-[-40deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />
        </div>

        {/* Top Solid-Color Part */}
        <div className="w-full mx-auto -mb-32 relative z-10">
          <div className="w-4/5 mx-auto pt-8 z-10 relative">
            <CarouselDefault images={images}/>
          </div>
        </div>


        {/* Bottom Part */}
        <div className="w-full m-auto pt-40 pb-40 relative flex flex-col z-10">
          <div className="pb-52 mx-auto inline-block text-4xl font-bold bg-[#092C48] dark:bg-[#EEEEEE]  text-transparent bg-clip-text">
            Welcome to Diamond Valley Cattery
          </div>

          <div className="pb-24 mx-auto inline-block text-4xl font-bold bg-[#092C48] dark:bg-[#EEEEEE] text-transparent bg-clip-text">
            Announcements!
          </div>
          <div className="w-4/5 mx-auto container flex justify-evenly py-6 items-start space-x-4">
              <div className="w-full"><Button /></div>
              <div className="w-full"><Button /></div>
              <div className="w-full"><Button /></div>
              <div className="w-full"><Button /></div>
          </div>
        </div>
      </div>
    </main>
  );
}
