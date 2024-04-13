"use client";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { auth } from "../_utils/firebase";
import { signInWithEmailAndPassword, signOut, getAuth, sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import BackgroundUnderlay from "@/app/components/background-underlay";

export default function Page() {
const {user, firebaseSignOut} = useUserAuth();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

function handleSignOut(){
     firebaseSignOut();
}

//Handles password reset
function handlePasswordReset(){
	const auth = getAuth();

	sendPasswordResetEmail(auth, email)
	.then(() => {
		alert("Password reset email sent.");
	})
	.catch((error) => {
		console.log("Error sending password reset email: " + error.message);
	});
}

function handleEmailPasswordSignIn(e){
    e.preventDefault();
	
    signInWithEmailAndPassword(auth, email, password)
	.then((userCredential) => {
		//Only allow logging in if email is verified
		if(userCredential.user.emailVerified){
			console.log("Email is verified.");
			window.location.href = `/dashboard`;
		}
		else{
			alert("Email is not verified.");
			//signOut(auth);
		}
	})
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/invalid-credential') {
          alert('Invalid email or password');
        }
        else{
        console.log(errorCode, "Error message is ", errorMessage);
        }
      });
}

 return(
    <div className="relative min-h-screen flex items-center justify-center">
        <BackgroundUnderlay />
        {!user &&
        <div dir="ltr" className="text-center bg-white dark:bg-gray-500 p-8 rounded-xl drop-shadow-lg">
          <p className="text-xl text-header-text-0 font-semibold mb-10 dark:text-dark-header-text-0">Sign in to your account</p>
          <form onSubmit={handleEmailPasswordSignIn} className="mb-8 flex flex-col items-center">
            <input type="email" value={email} className="text-black border-s-4 border-slate-300 p-2 mb-4" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} className="text-black border-s-4 border-slate-300 p-2 mb-4" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit" className=" bg-navbar-body-0 active:bg-slate-600 rounded text-white drop-shadow-lg dark:bg-gray-600 p-2">Sign In with Email</button>
        </form>
        <div>
          <button onClick={() => handlePasswordReset()} className=" text-navbar-body-0 mb-2 dark:text-gray-800">Forgot Password</button>
          <Link href='login/signup' className="text-slate-500  ml-6 dark:text-gray-800">Sign Up</Link>
        </div>
      </div>
        }
        {user && (
        <div className="text-center text-header-text-0">
            <p className=" text-3xl">
            Welcome, {user.displayName}<br /> <span className="text-xl">[{user.email}]</span>
            </p>
            <button onClick={handleSignOut} className=" bg-navbar-body-0 text-white py-4 px-6 rounded-xl drop-shadow-lg mt-8">Sign Out</button>
            <br/>
        </div>
        )}
  </div>
)}