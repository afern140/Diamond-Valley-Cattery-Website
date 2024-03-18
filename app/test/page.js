"use client";
import Comments from '../components/comments';
import ApiDataProvider from '../_utils/api_provider';
import React, { useState, useEffect } from 'react';

export default function Page() {

    return (
		<ApiDataProvider>
			<Comments/>
		</ApiDataProvider>

	)

}