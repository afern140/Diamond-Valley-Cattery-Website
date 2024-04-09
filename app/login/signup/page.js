"use client";
import { useState } from 'react';
import { auth } from '../../_utils/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
import { useUserAuth } from "../../_utils/auth-context";
import {collection,addDoc} from "firebase/firestore";
import {db} from "../../_utils/firebase";
import BackgroundUnderlay from "@/app/components/background-underlay";

//Change for user
//Add items
export async function addUser(userDoc) {
    console.log("Entered addUser.")
    const itemsRef = collection(db, "users");
    const docRef = await addDoc(itemsRef, userDoc);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
}


export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const {user} = useUserAuth();
  const [name, setName] = useState('');


  //Handles the creation of a new user in Firebase Authentication
    async function handleRegister(e){
        e.preventDefault();
        //Create user
        console.log("Creating user.");
        await createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			//Add user data to database
			//alert(userCredential.user)
			//addUserData(userCredential.user);
			//Don't log in yet, wait for email verification
			//signOut(auth);
		})
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/email-already-in-use') {
              alert('Invalid Email or Password');
            }
            else{
             console.log(errorCode, errorMessage);
            }
          });
		//Send email verification
		await sendEmailVerification(auth.currentUser)
			.then(() => {
				console.log("Email verification sent.");
			})
			.catch((error) => {
				console.log("Error sending email verification.: " + error.message);
			});
        //Add user name
        //console.log("Adding username.");
        await updateProfile(auth.currentUser, {displayName: displayName})
          .catch ((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
        await addUserData(auth.currentUser);

		signOut(auth);
        handleRedirect();
      }

      //Add user to database (user collection in Cloud Firestore)
    async function addUserData(user){
        console.log("Entered addUserData.");
        console.log(user.displayName);
        console.log(user.uid);
        console.log(user.email);
        
        
        const userDoc = {
            username: user.displayName,
            role: "customer",

            uid: user.uid,
            email: user.email,
            name: name,

			favorites: {cats: []},
        };
        
       /*
       const userDoc = {
              username: "Sterben",
                role: "customer",
                uid: "1234567890",
                email: "anthonyho992@gmail.com",
                name: "anthony",
        };
        */
        console.log("Adding user to database.");

        const docRef = await addUser(userDoc);
        console.log(docRef)
        console.log("User added to database.");
    }
  
  function handleRedirect(){
    window.location.href = '/login';
  }

  return(
    <div className="relative">
      <BackgroundUnderlay />

      {!user && 
        <div className="min-h-screen flex items-center justify-center">
          <form onSubmit={handleRegister} className="mb-8 flex flex-col items-center p-8 bg-white rounded-xl drop-shadow-lg">
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
              placeholder="Username"
              value = {displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-black border-s-4 border-slate-300 p-2 mb-4"
              required
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-black border-s-4 border-slate-300 p-2 mb-4"
                
                />
            <button type="submit" className="bg-navbar-body-1 active:bg-slate-600 rounded-xl text-header-text-0 drop-shadow-lg p-2">
              Sign Up with Email
            </button>
          </form>
        </div>
    }
    {user && 
    <div className="min-h-screen flex flex-column items-center justify-center bg-white">
      <div className="text-slate-500">Hi {user.displayName} you're already logged in.</div>
      <button onClick={handleRedirect} className="bg-slate-500 text-white p-2">Go to Login</button>
    </div>
    }
    </div>
  );
}