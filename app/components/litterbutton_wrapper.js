"use client"

import React, { useState, useEffect } from "react";

import ApiDataProvider from '@/app/_utils/api_provider';

import LitterButton from './litterbutton';

export default function LitterButton_Wrapper({ id, name, expDate, fatherID, motherID, notes, breed, gender, age, color, imgURL }) {
    
  return (
	<ApiDataProvider>
		<LitterButton id={id} name={name} expDate={expDate} motherID={motherID} fatherID={fatherID} notes={notes} breed={breed} gender={gender} age={age} color={color} imgURL={imgURL} />
	</ApiDataProvider>
  )
}