"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // GitHub Sign-In
  const gitHubSignIn = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Sign-In with Email and Password
  const emailPasswordSignIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign-Up with Email and Password
  const emailPasswordSignUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign Out
  const firebaseSignOut = () => {
    return signOut(auth);
  };

  // Auth State Change Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // This function is returned to be called on cleanup
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedUser,
        setSelectedUser,
        gitHubSignIn,
        firebaseSignOut,
        emailPasswordSignIn,
        emailPasswordSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
