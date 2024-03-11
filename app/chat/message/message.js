import React from 'react';

const style = {
  messageContainer: `flex justify-start my-2`, 
  message: `shadow-xl py-2 px-3 rounded-lg inline-block max-w-[80%]`,
  senderName: `text-gray-600 text-xs`,
  sent: `bg-[#395dff] text-white float-right ml-auto`,
  received: `bg-[#e5e5ea] text-black float-left mr-auto`,
  image: `max-w-full h-auto`,
};

const Message = ({ message, isCurrentUser }) => {
  const messageClass = isCurrentUser ? style.sent : style.received;

  return (
    <div className={style.messageContainer}>
      <div className={`${style.message} ${messageClass}`}>
        {!isCurrentUser && message.name && <p className={style.senderName}>{message.name}</p>}
        <p>{message.text}</p>
        {message.pictureUrl && <img src={message.pictureUrl} alt="Sent" className={style.image} />}
      </div>
    </div>
  );
};

export default Message;
