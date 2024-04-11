"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, updateDoc, addDoc, query, where } from "firebase/firestore";
import { db } from "../_utils/firebase";

export const getObjects = async (type) => {
	const documents = await getDocs(collection(db, type));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	console.log(`Fetched ${type} objects`)
	return data;
}

export const getObject = async (type, id) => {
	const document = await getDocs(query(collection(db, type), where("id", "==", id)));
	const object = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	console.log(`Fetched ${type} object`)
	console.log(object);
	return object;
}

export const createObject = async (type, object) => {
	const document = await addDoc(collection(db, type), object)
	alert(`Added new ${type} object`)
	return document;
}

export const updateObject = async (type, updatedObject, confirm) => {
	const { docId, ...updatedObjectPrunedDocID } = updatedObject;
	const objectRef = doc(db, type, docId);
	await updateDoc(objectRef, updatedObjectPrunedDocID);
	if (confirm) {
		alert(`Updated ${type} object`);
	}
}