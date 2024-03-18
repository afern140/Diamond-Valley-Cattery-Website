import React from "react";
import Messages from "./messages";
import Inputs from "./inputs";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chatInfo">
        <span></span>
      </div>
      <Messages />
      <Inputs />
    </div>
  );
};

export default Chat;
