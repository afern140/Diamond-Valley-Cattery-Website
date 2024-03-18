"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../_utils/firebase";

export const getObjects = async (type) => {
	const documents = await getDocs(collection(db, type));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	return data;
}

export const getObject = async (type, id) => {
	const documents = await getDocs(collection(db, type));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	const object = data.find(item => item.id == id);
	return object;
}

export const updateObject = async (type, updatedObject) => {
	const { docId, ...updatedObjectPrunedDocID } = updatedObject;
	const objectRef = doc(db, type, docId);
	await updateDoc(objectRef, updatedObjectPrunedDocID);
	alert(`Updated ${type} data`);
}