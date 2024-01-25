"use client";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { auth } from "../_utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
 

export default function Page() {
const {user, gitHubSignIn, firebaseSignOut } = useUserAuth();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

function handleSignOut(){
     firebaseSignOut();
}

function handleEmailPasswordSignIn(e){
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
}

 return(
    <div>
        {!user && 
        <div>
            <form onSubmit={handleEmailPasswordSignIn}>
                <input type="email" value={email} className="text-black" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} className="text-black" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Sign In with Email</button>
            </form>
            <button onClick={() => auth.sendPasswordResetEmail(email)}>Forgot Password</button>
            <Link href='login/signup'>Sign Up</Link>
        </div>
        }
        {user && (
        <div>
            <p>
            Welcome, {user.displayName} ({user.email})
            </p>
            <button onClick={handleSignOut}>Sign Out</button>
            <br/>
        </div>
        )}
  </div>
)}