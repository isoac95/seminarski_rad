import { useEffect, useRef } from "react";

const Messages = ({ messagesProp }) => {
  let date = "";

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "instant",
      inline: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesProp]);

  const dateUpdate = (arg) => {
    let dateToPrint =
      arg.getDate() + "/" + (arg.getMonth() + 1) + "/" + arg.getFullYear();
    if (date !== dateToPrint) {
      date = dateToPrint;

      return <p className="date">{dateToPrint}</p>;
    } else {
      return;
    }
  };

  return (
    <div className="messages-container">
      {messagesProp.length !== 0 && (
        <ul className="messages">
          {messagesProp.map((message) => (
            <li
              key={
                message.text +
                message.msgDate.getMilliseconds().toString() +
                message.msgDate.getSeconds().toString()
              }
            >
              {dateUpdate(message.msgDate)}
              <p className={message.type === "Tx" ? "Tx" : "Rx"}>
                <p className="message-text">{message.text}</p>
                <p className="time">
                  {message.ts.tsTime}
                  {message.type === "Tx" && (
                    <p className={message.seen === true ? "seen" : ""}>
                      &ensp;<b>&#10003;</b>
                    </p>
                  )}
                </p>
              </p>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      )}
      {messagesProp.length === 0 && (
        <p className="empty-chatroom">No messages yet. Start chat!</p>
      )}
    </div>
  );
};

export default Messages;
