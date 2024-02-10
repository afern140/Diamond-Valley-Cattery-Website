"use client";
import React, { useState } from "react";
import { auth, db } from "../../_utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const style = {
    form: `flex justify-center items-center h-14 w-full max-w-[728px] text-xl absolute bottom-0`,
    input: `w-[40%] p-3 bg-gray-900 text-white outline-none border-none`,
    button: `w-[20%] sm:w-[50%] md:w-[12%] lg:w-[6%] text-grey`,
};

const SendMessage = ({ scroll }) => {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a valid message");
      return;
    }
    const { uid, displayName } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: input,
      name: displayName,
      uid,
      timestamp: serverTimestamp(),
    });
    setInput("");
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("Scroll ref not available.");
    }
  };

  return (
    <form onSubmit={sendMessage} className={style.form}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type="text"
        placeholder="Message"
      />
      <button className={style.button} type="submit">
        Send
      </button>
    </form>
  );
};

export default SendMessage;
