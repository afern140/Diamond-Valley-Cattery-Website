import Image from 'next/image'
import Link from 'next/link'
import CarouselDefault from './components/carousel';
import Button from './components/displaybutton'

export default function Home() {
  
  const zigzagSize = new Array(100).fill(null);

  return (
    <div className="w-screen bg-white dark:bg-gray-700 -z-10 overflow-hidden">
      {/* Paw Prints */}
      <div className="absolute z-10 opacity-40 size-full">
        <Image className="absolute top-0 right-0 -translate-x-16 translate-y-10 rotate-[45deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />        
        <Image className="absolute top-0 right-0 -translate-x-10 translate-y-40 rotate-[45deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />
        <Image className="absolute top-0 left-0 translate-x-10 translate-y-40 rotate-[12deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />
        <Image className="absolute top-0 left-0 translate-x-20 translate-y-[260px] rotate-[-40deg]" alt="" src="/img/Paw-print.svg" width={40} height={40} />
      </div>

      {/* Top Solid-Color Part */}
      <div className="w-full mx-auto bg-teal-500 -mb-20">
        <div className="w-4/5 mx-auto">
          <CarouselDefault />
        </div>
      </div>


      {/* Zigzag */}
      <div className="relative w-full bg-repeat-x flex">
        { 
          zigzagSize.map(() => (
            <div className="flex">
              <div className="size-[16px] bg-white bg-gradient-to-tr from-white from-50% to-teal-500 to-50%" />
              <div className="size-[16px] bg-white bg-gradient-to-tl from-white from-50% to-teal-500 to-50%" />
            </div>
          ))
        }
      </div>

      {/* Bottom White Part */}
      <div className="bg-white w-full m-auto pt-20">
        <h2 className="font-sans font-normal text-2xl flex items-center justify-center text-center text-black py-4">Welcome to Diamond Valley Cattery</h2>
        <div className="flex justify-between py-6">
            <Button />
            <Button />
            <Button />
        </div>
      </div>
    </div>
  );
}
