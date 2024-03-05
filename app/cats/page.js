"use client"

import React, { useState, useEffect } from "react";

import ApiDataProvider from '../_utils/api_provider';

import CatList from './catlist';

export default function Page() {
    
  return (
	<ApiDataProvider>
		<CatList />
	</ApiDataProvider>
  )
}