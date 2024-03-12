"use client"

import React, { useState, useEffect } from "react";

import ApiDataProvider from '../_utils/api_provider';

import Litters from './litters';

export default function Page() {
    
  return (
	<ApiDataProvider>
		<Litters />
	</ApiDataProvider>
  )
}