import React from 'react';

const style = {
  messageContainer: `flex justify-start my-2 w-full`, 
  message: ` py-2 px-3 inline-block w-full`,
  senderName: `text-gray-600 text-xs`,
  sent: `bg-[#C9D9E3] text-black float-right ml-auto text-right`,
  received: `bg-[#E3C9C9] text-black float-left mr-auto`,
  image: `max-w-full h-auto`,
};

const Message = ({ message, isCurrentUser }) => {
  const messageClass = isCurrentUser ? style.sent : style.received;

  return (
    <div className={style.messageContainer}>
      <div className={`${style.message} ${messageClass}`}>
        {message.name && <p className={style.senderName}>{message.name}</p>}
        <p>{message.text}</p>
        {message.pictureUrl && <img src={message.pictureUrl} alt="Sent" className={style.image} />}
      </div>
    </div>
  );
};

export default Message;
