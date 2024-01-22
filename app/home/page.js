'use client';
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <header className="bg-black">
        <div className="w-11/12 mx-auto flex flex-row items-center py-4">
          <div className="">
            <img src="/logo.png" className="mr-10"/>
          </div>
          <div className="text-white">
            <p className="text-3xl">Diamond Valley Cattery</p>
          </div>
        </div>
      </header>
      <nav className="bg-amber-200">
        <ul className="text-white flex flex-row justify-around text-center items-center text-xl h-10 ">
          <li className="w-full border-r border-black py-2"><a href=""><img src="/nav.png" className="mx-auto aspect-auto h-8"/></a></li>
          <li className="w-full border-r border-black py-2"><a href="">About</a></li>
          <li className="w-full border-r border-black py-2"><a href="">Cats</a></li>
          <li className="w-full border-r border-black py-2"><a href="">Litters</a></li>
          <li className="w-full border-r border-black py-2"><a href="">Vets</a></li>
          <li className="w-full border-r border-black py-2"><a href="">Registry</a></li>
          <li className="w-full"><a href="">Contact</a></li>
        </ul>
      </nav>
      <section>
      <img src="/banner1.jpg"/>
      </section>
      <section className="w-11/12 mx-auto py-5">
        <h2 className="text-3xl py-3 font-black">Welcome to Diamond Valley Cattery!</h2>
        <div className=" flex flex-row justify-between">
          <div className="w-1/3 bg-amber-200 p-8">
            <div>
              <img src="/cat.jpg"/>
            </div>
            <div className="text-center">
              <p className="text-base font-black leading-10">Announcements</p>
            </div>
          </div>
          <div className="w-1/3 mx-12 bg-amber-200  p-8">
            <div>
              <img src="/cat.jpg"/>
            </div>
            <div className="text-center">
              <p className="text-base font-black leading-10">Available Cats</p>
            </div>
          </div>
          <div className="w-1/3 bg-amber-200  p-8">
            <div>
              <img src="/cat.jpg"/>
            </div>
            <div className="text-center">
              <p className="text-base font-black leading-10">Upcoming Litters</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-black text-white">
        <ul className="w-11/12 mx-auto py-5 flex justify-between">
          <li>
            <h3 className="text-xl py-3 font-black leading-10">About us</h3>
          </li>
          <li>
            <h3 className="text-xl py-3 font-black leading-10">Services</h3>
          </li>
          <li>
            <h3 className="text-xl py-3 font-black leading-10">Policies</h3>
            <p><a href="">Accessibility</a></p>
            <p><a href="">Privacy Policy</a></p>
            <p><a href="">Data Collection</a></p>
            <p><a href="">Cookies</a></p>
          </li>
          <li>
            <h3 className="text-xl py-3 font-black leading-10">Contact</h3>
            <p>1-800-XXX-XXXX</p>
          </li>
        </ul>
        <div className="flex justify-end w-11/12 mx-auto py-2">
          <img src="/f.jpg" className="h-10"/>
          <img src="/g.jpg" className="h-10 ml-2"/>
          <img src="/y.jpg" className="h-10 ml-2"/>
        </div>
      </footer>
    </main>
  );
}