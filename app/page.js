import Image from 'next/image'
import Link from 'next/link'
import Carousel from './components/newcarousel/page'
import Button from './components/displaybutton/page'
import "./styles.css"

export default function Home() {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto">
        {/*<Carousel />*/}

        <h2 className="home-header">Welcome to Diamond Valley Cattery</h2>
        
        <div className="flex justify-between py-6">
          <Button />
          <Button />
          <Button />
        </div>
      </div>
    </div>
  );
}
