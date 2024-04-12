"use client";
import { useState } from "react";
import { useUserAuth } from "../../_utils/auth-context";
import { auth } from "../../_utils/firebase";
import { signInWithEmailAndPassword, signOut, getAuth, sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
 

export default function Page() {
const {user, firebaseSignOut} = useUserAuth();
const [email, setEmail] = useState('');

function handleSignOut(){
     firebaseSignOut();
}

//Handles password reset
function handlePasswordReset(e){
	e.preventDefault();

	const auth = getAuth();

	sendPasswordResetEmail(auth, email)
	.then(() => {
		alert("Password reset email sent.");
		//Return to login page
		window.location.href = "../login";
	})
	.catch((error) => {
		console.log("Error sending password reset email: " + error.message);
	});
}

 return(
    <div className="bg-white min-h-screen flex items-center justify-center">
        {!user &&
        <div dir="ltr" className="text-center">
          <p className="text-xl text-slate-400 font-semibold mb-10">Forgot Password</p>
          <form onSubmit={handlePasswordReset} className="mb-8 flex flex-col items-center">
            <input type="email" value={email} className="text-black border-s-4 border-slate-300 p-2 mb-4" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <button type="submit" className="bg-slate-400 active:bg-slate-600 rounded text-white p-2">Reset Password</button>
        </form>
        <div>
          <Link href='../login' className="text-slate-500  ml-6">Back</Link>
        </div>
      </div>
        }
        {user && (
        <div className="text-center text-header-text-0">
            <p className=" text-3xl">
            Welcome, {user.displayName}<br /> <span className="text-xl"> ({user.email})</span>
            </p>
            <button onClick={handleSignOut} className=" bg-navbar-body-0 text-white py-4 px-6 rounded-xl drop-shadow-lg mt-8">Sign Out</button>
            <br/>
        </div>
        )}
  </div>
)}