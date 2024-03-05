"use client"

import React, { useState, useEffect } from "react";

import ApiDataProvider from '@/app/_utils/api_provider';

import LitterButton from './litterbutton';

export default function LitterButton_Wrapper({ id, name, age, color, eye_color, breed, gender, vaccinations, conditions, fatherID, motherID, children }) {
    
  return (
	<ApiDataProvider>
		<LitterButton id={id} name={name} age={age} color={color} eye_color={eye_color} breed={breed} gender={gender} vaccinations={vaccinations} conditions={conditions} fatherID={fatherID} motherID={motherID} children={children} />
	</ApiDataProvider>
  )
}