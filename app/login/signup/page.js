"use client";
import { useState } from "react";
import { auth } from "../../_utils/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useUserAuth } from "../../_utils/auth-context";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../_utils/firebase";

// Function to add a user to the "users" collection
export async function addUser(userDoc) {
  console.log("Entered addUser.");
  try {
    const itemsRef = collection(db, "users");
    const docRef = await addDoc(itemsRef, userDoc);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding user to 'users' collection:", error);
    throw error;
  }
}

// Function to create an empty document for user chats in the "userChats" collection
export async function addUserChats(user) {
  console.log("Entered addUserChats.");
  try {
    const userChatDoc = {}; // Initialize empty document
    await setDoc(doc(db, "userChats", user.uid), userChatDoc); // Create an empty document for user chats
    console.log("Empty document created for user chats.");
  } catch (error) {
    console.error("Error creating empty document for user chats:", error);
    throw error;
  }
}

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { user } = useUserAuth();

  // Handles the creation of a new user in Firebase Authentication
  async function handleRegister(e) {
    e.preventDefault();
    // Create user
    console.log("Creating user.");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      // Add user name
      await updateProfile(newUser, { displayName: displayName });
      // Add user data to Firestore and create user chats
      await addUserData(newUser);
      handleRedirect();
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error, display error message to the user, etc.
    }
  }

  // Add user data to Firestore (users collection) and create user chats
  async function addUserData(user) {
    console.log("Entered addUserData.");
    const userDoc = {
      name: user.displayName,
      role: "customer",
      uid: user.uid,
    };
    console.log("Adding user to database.");
    console.log(userDoc);
    try {
      // Add user to users collection
      await addUser(userDoc);
      console.log("User added to 'users' collection.");
      // Create empty document for user chats
      await addUserChats(user);
      console.log("User added to 'userChats' collection.");
    } catch (error) {
      console.error("Error adding user data:", error);
      throw error;
    }
  }

  function handleRedirect() {
    window.location.href = "/login";
  }

  return (
    <div>
      {!user && (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <form
            onSubmit={handleRegister}
            className="mb-8 flex flex-col items-center"
          >
            <input
              type="email"
              value={email}
              className="text-black border-s-4 border-slate-300 p-2 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              className="text-black border-s-4 border-slate-300 p-2 mb-4"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-black border-s-4 border-slate-300 p-2 mb-4"
              required
            />
            <button
              type="submit"
              className="bg-slate-400 active:bg-slate-600 rounded text-white p-2"
            >
              Sign Up with Email
            </button>
          </form>
        </div>
      )}
      {user && (
        <div className="min-h-screen flex flex-column items-center justify-center bg-white">
          <div className="text-slate-500">
            Hi {user.displayName} you're already logged in.
          </div>
          <button
            onClick={handleRedirect}
            className="bg-slate-500 text-white p-2"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
