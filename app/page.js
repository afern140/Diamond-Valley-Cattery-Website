import Image from 'next/image'
import Link from 'next/link'
import CarouselDefault from './components/carousel';
import Button from './components/displaybutton'

export default function Home() {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto">
        <CarouselDefault />

        <h2 className=" text-4xl flex text-center justify-center text-black py-4">Welcome to Diamond Valley Cattery</h2>
        
        <div className="flex justify-between py-6">
          <Button />
          <Button />
          <Button />
        </div>
      </div>
    </div>
  );
}
