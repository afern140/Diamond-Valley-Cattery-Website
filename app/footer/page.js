import React from "react";
import Link from "next/link";
import Logo from "@/app/navbar/Logo";
import Button from "@/app/navbar/Button";

const Footer = () => {
  return (
    <div className=" text-2xl bg-gray-900 left-0 bottom-0 right-0">
        <div className="w-full h-10">
            <div className="flex mx-auto px-8 h-full py-4">
                <button className="grow hover:underline">...</button>
                <button className="grow hover:underline">About</button>
                <button className="grow hover:underline">Cats</button>
                <button className="grow hover:underline">Litters</button>
            </div>
            <div className=" bg-gray-900 p-7">
                <div className="w-full flex justify-end">
                    <div className=" grid-cols-2 grid text-base">
                        <Link href="" className="hover:underline">Accessibility</Link>
                        <p>1-800-XXX-XXXX</p>
                        <Link href="" className="hover:underline">Privacy Policy</Link>
                        <p>XXXXX@X.com</p>
                        <Link href="" className="hover:underline">Data Collection</Link>
                        <p>100 XXXX Dr T4X 1X4</p>
                        <Link href="" className="hover:underline">Cookies</Link>
                        <div/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Footer;