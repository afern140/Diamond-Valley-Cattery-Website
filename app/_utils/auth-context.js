"use client";
 
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "./firebase";
import {getUser} from "./user_services";
 
const AuthContext = createContext();
 
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDBUser] = useState(null);
 
  const gitHubSignIn = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const emailPasswordSignIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const emailPasswordSignUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
 
  const firebaseSignOut = () => {
    return signOut(auth);
  };
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);
 
  useEffect(() => {
    const fetchUser = async () => {
      const newUser = await getUser(user);
      setDBUser(newUser);
    };
    fetchUser();
  }, [user]);

  

  return (
    <AuthContext.Provider value={{dbUser, user, gitHubSignIn, firebaseSignOut, emailPasswordSignIn, emailPasswordSignUp }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useUserAuth = () => {
  return useContext(AuthContext);
};

export function resetPasswordByEmail(email){
  return sendPasswordResetEmail(auth, email)
  .then(() => {
    alert("Password reset email sent");
  })
  .catch((error) => {
    console.log(error);
    alert("Password reset email failed");

  });
}