//Cat data generated with cobbl.io

"use client"

import React, { useState, useEffect } from "react";

import ApiDataProvider from '@/app/_utils/api_provider';
import LitterProfile from './litterprofile';

export default function Page({ params }) {

	return(
		<ApiDataProvider>
			<LitterProfile params={params}/>
		</ApiDataProvider>
	)
}