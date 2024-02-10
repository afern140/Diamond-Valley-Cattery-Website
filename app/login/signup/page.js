"use client";
import { useState } from 'react';
import { auth } from '../../_utils/firebase'; // assuming you have a firebase.js file that exports the auth object
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useUserAuth } from "../../_utils/auth-context";

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const {user} = useUserAuth();

  async function handleRegister(e){
    e.preventDefault();
    //Create user
    console.log("Creating user.");
    await createUserWithEmailAndPassword(auth, email, password)
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
      //Add user name
      console.log("Adding username.");
    await updateProfile(auth.currentUser, {displayName: displayName})
      .catch ((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    //await sendEmailVerification(auth.currentUser);
    handleRedirect();
  }
  
  function handleRedirect(){
    window.location.href = '/login';
  } 

  return(
    <div>
      {!user && 
        <div className="min-h-screen flex items-center justify-center bg-white">
          <form onSubmit={handleRegister} className="mb-8 flex flex-col items-center">
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
              value = {displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-black border-s-4 border-slate-300 p-2 mb-4"
              required
            />
            <button type="submit" className="bg-slate-400 active:bg-slate-600 rounded text-white p-2">
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