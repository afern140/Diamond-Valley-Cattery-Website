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
    <form onSubmit={handleEmailPasswordSignUp}>
      <input type="email" value={email} className="text-black" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
      <input type="password" value={password} className="text-black" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
      <button type="submit">Sign Up with Email</button>
    </form>
  );
}