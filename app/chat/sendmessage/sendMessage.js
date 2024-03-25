import React, { useState } from "react";
import { db, auth, strg } from "@/app/_utils/firebase"; 
import { doc, collection, addDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Adjusted SendMessage component for Firestore
export default function SendMessage({ chatId }) {
  const [input, setInput] = useState("");
  const [picture, setPicture] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === "" && !picture) {
      alert("Please enter a message or select a picture");
      return;
    }

    const { uid, displayName } = auth.currentUser;
    let pictureUrl = null;

    // Handle picture upload
    if (picture) {
      const fileRef = storageRef(
        strg,
        `chat_images/${Date.now()}_${picture.name}`
      );
      const snapshot = await uploadBytes(fileRef, picture);
      pictureUrl = await getDownloadURL(snapshot.ref);
    }

    // Add message to Firestore
    await addDoc(collection(db, "chats", chatId, "messages"), {
      uid,
      displayName,
      text: input,
      pictureUrl,
      timestamp: new Date(),
    });

    setInput("");
    setPicture(null);
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <input
        type="file"
        onChange={(e) => setPicture(e.target.files[0])}
        accept="image/*"
      />
      <button type="submit">Send</button>
    </form>
  );
}
