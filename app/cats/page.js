"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./styles.css";
//import SearchBox from "@/app/components/searchbox/searchbox";
//import Dropdown from "@/app/components/dropdown/dropdown";
import CatButton1 from "@/app/components/cat_button_1/catbutton-1";
import CatButton2 from "@/app/components/cat_button_2/catbutton-2";
import cats from "./cat/cat.json"

export default function Page() {
  return (
    <main className="w-full flex-col justify-center">
      <div>
        <h1 className="catlist-header">Cats</h1>
        {/*<SearchBox />*/}
      </div>

      <div className="flex py-6 w-full justify-center">
        <div className="flex w-4/5">
          {/* First split of the page */}
          <div className=" w-1/3 mr-6 align-middle justify-center flex-col flex items-center">
            <h2 className="py-4 text-2xl">Filters</h2>

            <h3 className="py-2 text-lg">Breed</h3>
            {/*<Dropdown/>*/}
            <h3 className="py-2 text-lg">Gender</h3>
            {/*<Dropdown/>*/}
            <h3 className="py-2 text-lg">Age</h3>
            {/*<Dropdown/>*/}
            <h3 className="py-2 text-lg">Color</h3>
            {/*<Dropdown/>*/}
          </div>

          {/* Second split of the page */}
          <div className="w-full flex-col">
            <div className="flex">
              <div className="w-3/5" />
            </div>
            <div className="h-6"/>
            <div className="grid w-full grid-cols-3">
                {/*<CatButton1/>
                <CatButton2 />
                <CatButton1 />
                <CatButton2 />
                <CatButton1 />
                <CatButton2 />*/}

                {
                    cats.map((cat, index) => (
                        <div key={index}>
                            {(index % 2 == 0) ? <CatButton1 picID={index} /> : <CatButton2 picID={index} />}
                        </div>
                    ))
                }
              </div>
          </div>  
        </div>
      </div>
    </main>
  )
}