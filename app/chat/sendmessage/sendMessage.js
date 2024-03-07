import React, { useState } from "react";
import { auth, rtdb } from "../../_utils/firebase";
import { ref, push } from "firebase/database";

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
    // Push the message to the Firebase Realtime Database
    const messagesRef = ref(rtdb, 'messages');
    await push(messagesRef, {
      text: input,
      name: displayName,
      uid,
      timestamp: new Date().toISOString(), 
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
        className="relative outline-none border border-gray-400 rounded-lg py-1 px-2 w-auto bg-white text-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Message"
      />
      <button className="w-auto bg-slate-400 text-white rounded-lg py-2 px-4 m-4" type="submit">
        Send
      </button>
    </form>
  );
};

export default SendMessage;
