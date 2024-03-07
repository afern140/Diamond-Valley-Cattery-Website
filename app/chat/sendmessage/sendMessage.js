import React, { useState } from "react";
import { auth, rtdb, strg } from "../../_utils/firebase";
import { ref, push } from "firebase/database";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

const style = {
  form: `flex justify-center items-center h-14 w-full max-w-[728px] text-xl absolute bottom-0`,
  input: `w-[40%] p-3 bg-gray-900 text-white outline-none border-none`,
  button: `w-[20%] sm:w-[50%] md:w-[12%] lg:w-[6%] text-grey`,
};

const SendMessage = ({ scroll }) => {
    const [input, setInput] = useState("");
    const [picture, setPicture] = useState(null);

    // Function to handle file drop
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      setPicture(file);
    };
  
    const sendMessage = async (e) => {
      e.preventDefault();
      if (input === "" && picture === null) {
        alert("Please enter a message or select a picture");
        return;
      }
  
      const { uid, displayName } = auth.currentUser;
  
      // Upload picture to Firebase Storage if available
      let pictureUrl = null;
      if (picture) {
        const storage = getStorage();
        const storageRef = `${Date.now()}_${picture.name}`;
        await uploadBytes(storageRef, picture).then(async snapshot => {
          pictureUrl = await getDownloadURL(snapshot.ref);
        });
      }
  
      // Push the message (including picture URL) to the Firebase Realtime Database
      const messagesRef = ref(rtdb, 'messages');
      await push(messagesRef, {
        text: input,
        pictureUrl: pictureUrl,
        name: displayName,
        uid,
        timestamp: new Date().toISOString(),
      });
  
      setInput("");
      setPicture(null);
  
      if (scroll.current) {
        scroll.current.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn("Scroll ref not available.");
      }
    };

    return (
      <form onSubmit={sendMessage} className={style.form} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="relative outline-none border border-gray-400 rounded-lg py-1 px-2 w-auto bg-white text-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Message"
        />
        <input
          type="file"
          onChange={(e) => setPicture(e.target.files[0])}
          accept="image/*"
        />
        <button className="w-auto bg-slate-400 text-white rounded-lg py-2 px-4 m-4" type="submit">
          Send
        </button>
      </form>
    );
  };

export default SendMessage;
