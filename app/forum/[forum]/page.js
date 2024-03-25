"use client"

import React from "react";

import ApiDataProvider from '@/app/_utils/api_provider';
import Forum from './forum.js';

export default function Page({ params }) {

	return(
		<ApiDataProvider>
			<Forum params={params}/>
		</ApiDataProvider>
	)
}