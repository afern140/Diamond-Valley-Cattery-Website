"use client";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { auth } from "../_utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Chat from "../chat/Chat";
import Link from "next/link";

export default function Page() {
  
  const {user, firebaseSignOut} = useUserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSignOut() {
    firebaseSignOut();
  }

  function handleEmailPasswordSignIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
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

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      {!user && (
        <div dir="ltr" className="text-center">
          <p className="text-xl text-slate-400 font-semibold mb-10">
            Sign in to your account
          </p>
          <form
            onSubmit={handleEmailPasswordSignIn}
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
            <button
              type="submit"
              className="bg-slate-400 active:bg-slate-600 rounded text-white p-2"
            >
              Sign In with Email
            </button>
          </form>
          <div>
            <button
              onClick={() => auth.sendPasswordResetEmail(email)}
              className="text-slate-500 mb-2"
            >
              Forgot Password
            </button>
            <Link href="login/signup" className="text-slate-500  ml-6">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
        }
        {user && (
        <div className="text-center text-slate-500">
            <p>
            Welcome, {user.displayName} ({user.email})
          </p>
          <button
            onClick={handleSignOut}
            className="bg-slate-500 text-white p-2"
          >
            Sign Out
          </button>
          <br />
        </div>
      )}
      {user ? <Chat /> : null}
    </div>
  );
}
