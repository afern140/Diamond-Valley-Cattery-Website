"use client";
 
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getAuth
} from "firebase/auth";
import { auth } from "./firebase";
import {getUser} from "./user_services";
import { set } from "firebase/database";
 
const AuthContext = createContext();
const auth = getAuth(displayName, photoURL);
 
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

/*
  * Updates the user's profile with a new display name and/or photo URL.
  *
  * @param {string} newDisplayName - The new display name for the user.
  * @param {string} newPhotoURL - The new photo URL for the user.
  * 
  * If either parameter is provided, it will update the corresponding field in the user's profile.
  * If the update is successful, an alert will be shown with the message "Profile updated".
  * If the update fails, an alert will be shown with the message "Profile update failed".
*/
export function upateUserProflie(newDisplayName, newPhotoURL){
  const updateObject = {};
  if (newDisplayName) {
    updateObject.displayName = newDisplayName;
  }
  if (newPhotoURL) {
    updateObject.photoURL = newPhotoURL;
  }
  if (newDisplayName || newPhotoURL) {
    updateProfile(auth.currentUser, updateObject)
      .then(() => {
        alert ("Profile updated");
      })
      .catch((error) => {
        console.log(error);
        alert("Profile update failed");
      });
  }
}

 
export const useUserAuth = () => {
    //console.log(useContext(AuthContext));
  return useContext(AuthContext);
};