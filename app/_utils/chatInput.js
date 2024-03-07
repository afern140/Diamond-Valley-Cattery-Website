import React, { useState } from "react";
import { rtdb, auth, strg } from "./firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ChatInput({ roomId }) {
  console.log("Executing ChatInput");
  const [message, setMessage] = useState('');
  const [picture, setPicture] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '' && picture === null) {
      return;
    }

    // Upload picture to Firebase Storage if available
    let pictureUrl = null;
    if (picture) {
      const storageRef = ref(strg, `images/${Date.now()}_${picture.name}`);
      await uploadBytes(storageRef, picture).then(async snapshot => {
        pictureUrl = await getDownloadURL(snapshot.ref);
      });
    }

    // Push the message (including picture URL) to the Firebase Realtime Database
    await rtdb.ref(`rooms/${roomId}/messages`).push({
      message: message,
      pictureUrl: pictureUrl,
      timestamp: new Date().toISOString(), 
      user: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
    });

    setMessage('');
    setPicture(null);
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
