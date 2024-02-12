"use client"

import React, { useState, useEffect } from "react";
import Dropdown from "@/app/components/dropdown";
import CatButton1 from "@/app/components/catbutton-1";
import cats from "./[cat]/cat.json"

import ApiDataProvider from '../_utils/api_provider';
import ApiDataContext from '../_utils/api_context';

import CatList from './catlist';

export default function Page() {
    
    
  return (
	<ApiDataProvider>
		<CatList />
	</ApiDataProvider>
  )
}