"use client"

import Image from 'next/image'
import Link from 'next/link'
import CarouselDefault from './components/carousel';
import Button from './components/displaybutton'
import React from 'react';

export default function Home() {

  return (
    <div className="w-full bg-white dark:bg-gray-700 -z-10">
      <div className="container mx-auto">
        <CarouselDefault />

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