"use client"

import React from "react";

import ApiDataProvider from '../_utils/api_provider';

import ForumList from './forumlist.js';

export default function Page() {
    
  return (
	<ApiDataProvider>
		<ForumList />
	</ApiDataProvider>
  )
}