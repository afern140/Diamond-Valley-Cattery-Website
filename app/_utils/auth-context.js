"use client";
 
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import {getUser} from "./user_services";
import { set } from "firebase/database";
 
const AuthContext = createContext();
 
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await getUser(currentUser);
        setUser({ ...userData, uid: currentUser.uid
        });
      } else
      setUser(null);
    });
    return () => unsubscribe();
  }, [user]);
 
  return (
    <AuthContext.Provider value={{ user, gitHubSignIn, firebaseSignOut, emailPasswordSignIn, emailPasswordSignUp }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useUserAuth = () => {
    //console.log(useContext(AuthContext));
  return useContext(AuthContext);
};