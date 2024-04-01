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

/*
how to send photo to firebase storage and get url for user profile
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Create a reference to 'images/mountains.jpg'
const storage = getStorage();
const storageRef = ref(storage, 'images/mountains.jpg');

// 'file' comes from the Blob or File API
uploadBytesResumable(storageRef, file).then((snapshot) => {
  console.log('Uploaded a blob or file!');

  // Get the download URL
  getDownloadURL(snapshot.ref).then((downloadURL) => {
    console.log('File available at', downloadURL);

    // Now you can use this URL as the photoURL for the user's profile
    updateProfile(auth.currentUser, { photoURL: downloadURL });
  });
});
*/