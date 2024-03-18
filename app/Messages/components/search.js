import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../_utils/firebase";
import { useUserAuth } from "../../_utils/auth-context"; 

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  // Destructure to include setSelectedUser from the context
  const { user: currentUser, setSelectedUser } = useUserAuth();

  const handleSearch = async () => {
    try {
      const q = query(collection(db, "users"), where("name", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log("User found:", userData);
          setUser(userData);
        });
        setErr(false);
      } else {
        setUser(null);
        setErr(true);
      }
    } catch (err) {
      console.error("Error searching user:", err);
      setUser(null);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") handleSearch();
  };

  const handleSelect = async (selectedUser) => {
    if (!selectedUser) return;

    const combinedId =
      currentUser.uid > selectedUser.uid
        ? `${currentUser.uid}${selectedUser.uid}`
        : `${selectedUser.uid}${currentUser.uid}`;
    console.log("Combined ID:", combinedId);

    try {
      const chatRef = doc(db, "chats", combinedId);
      await setDoc(chatRef, { messages: [] }, { merge: true });

      const userInfoUpdate = {
        userInfo: {
          uid: selectedUser.uid,
          displayName: selectedUser.name || "Unknown",
          photoURL: selectedUser.photoURL || "",
        },
        date: serverTimestamp(),
      };

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId]: userInfoUpdate,
      });

      await updateDoc(doc(db, "userChats", selectedUser.uid), {
        [combinedId]: {
          ...userInfoUpdate,
          userInfo: {
            uid: currentUser.uid,
            displayName: currentUser.displayName || "Unknown",
            photoURL: currentUser.photoURL || "",
          },
        },
      });

      console.log("User chats updated.");
      setSelectedUser(selectedUser); // Update selected user in context
    } catch (err) {
      console.error("Error updating user chats:", err);
    }

    // Clear the search
    setUser(null);
    setUsername("");
  };

  return (
    <div className="messageSearch">
      <div className="mSearchForm">
        <input
          className="mInput"
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found.</span>}
      {user && (
        <div className="userChat" onClick={() => handleSelect(user)}>
          <img className="msgImg" src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
