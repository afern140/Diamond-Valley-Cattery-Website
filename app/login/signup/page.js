"use client";
import { useState } from 'react';
import { auth } from '../../_utils/firebase'; // assuming you have a firebase.js file that exports the auth object
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailPasswordSignUp(e){
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  return(
<div className="min-h-screen flex items-center justify-center bg-white">
  <form onSubmit={handleEmailPasswordSignUp} className="mb-8 flex flex-col items-center">
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
    <button type="submit" className="bg-slate-400 active:bg-slate-600 rounded text-white p-2">
      Sign Up with Email
    </button>
  </form>
</div>


  );
}