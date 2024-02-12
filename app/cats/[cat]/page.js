//Cat data generated with cobbl.io

"use client"

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Cats from "./cat"
import Carousel from "@/app/components/carousel"

import { useRouter } from 'next/navigation'

import ApiDataProvider from '../../_utils/api_provider';
import ApiDataContext from '../../_utils/api_context';

import CatProfile from './catprofile';

export default function Page({ params }) {

	

	return(
		<ApiDataProvider>
			<CatProfile params={params}/>
		</ApiDataProvider>
	)
}