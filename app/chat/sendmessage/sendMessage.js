import React, { useState } from "react";
import { auth, rtdb, strg } from "../../_utils/firebase";
import { ref, push } from "firebase/database";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

const style = {
  form: `flex justify-center items-center h-14 w-full max-w-[728px] text-xl border-t-2 border-gray-400`,
  input: `w-[40%] pl-2 bg-[#F3F3F3] text-black outline-none border-none rounded-bl-lg`,
  button: `w-auto bg-slate-400 text-white rounded-lg py-2 px-4 m-4`,
};

const SendMessage = ({ scroll }) => {
  const [input, setInput] = useState("");
  const [picture, setPicture] = useState(null);

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

    let pictureUrl = null;
    if (picture) {
      try {
        const storage = getStorage();
        const storageRef = storage.ref(`images/${Date.now()}_${picture.name}`);
        const snapshot = await uploadBytes(storageRef, picture);
        pictureUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading picture:", error);
        // Handle error uploading picture
      }
    }

    const messagesRef = ref(rtdb, "messages");
    try {
      await push(messagesRef, {
        text: input,
        pictureUrl: pictureUrl || "", // Set a default value if pictureUrl is null
        name: displayName,
        uid,
        timestamp: new Date().toISOString(),
      });
      console.log("Pushed a new message!");
    } catch (error) {
      console.error("Error pushing message to database:", error);
      // Handle error pushing message to database
    }

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
      <button className="text-gray-500 text-3xl ml-2 bg-gray-200 px-2 rounded-full">+</button>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type="text"
        placeholder="Type your message..."
      />
      <input
        type="file"
        onChange={(e) => setPicture(e.target.files[0])}
        accept="image/*"
      />
      <button className={style.button} type="submit">
        Send
      </button>
    </form>
  );
};

export default SendMessage;
