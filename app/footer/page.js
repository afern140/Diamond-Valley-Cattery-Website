import React from "react";
import Link from "next/link";
import Logo from "@/app/navbar/Logo";
import Button from "@/app/navbar/Button";

const Footer = () => {
  return (
    <div className="text-lg Capriola text-white">
        <div className="w-full h-10 bg-gray-900 top-0">
            <div className="flex mx-auto px-8 h-full w-50">
                <button className="grow hover:underline">...</button>
                <button className="grow hover:underline">About</button>
                <button className="grow hover:underline">Cats</button>
                <button className="grow hover:underline">Litters</button>
            </div>
            <div className="bg-gray-900 px-4">
                <div className="w-full flex justify-end">
                    <div className="text-base grid grid-cols-2 gap-x-4">
                        <Link href="" className="hover:underline">Accessibility</Link>
                        <p>1-800-XXX-XXXX</p>
                        <Link href="" className="hover:underline">Privacy Policy</Link>
                        <p>XXXXX@X.com</p>
                        <Link href="" className="hover:underline">Data Collection</Link>
                        <p>100 XXXX Dr T4X 1X4</p>
                        <Link href="" className="hover:underline">Cookies</Link>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Footer;