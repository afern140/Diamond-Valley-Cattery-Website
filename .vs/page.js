"use client"

import React, { useState, useEffect } from "react";

import ApiDataProvider from '@/app/_utils/api_provider';
import CatProfile from './catprofile';

export default function Page({ params }) {

	return(
		<ApiDataProvider>
			<CatProfile params={params}/>
		</ApiDataProvider>
	)
}