import { useState } from "react";
import { colRefMessages, db } from "../../firebase";
import { addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

const MessageInput = ({ loggedUser, chatRoomIdProp }) => {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      //console.log("Dodavanje nove poruke u message database");
      addDoc(colRefMessages, {
        chatroom: chatRoomIdProp,
        sender: loggedUser.email,
        text: message,
        timestamp: serverTimestamp(),
        seenStatus: false,
      }).then(() => {
        //console.log("Update seen statusa u chatroom database-u");
        updateDoc(doc(db, "chats", chatRoomIdProp), {
          lastMessage: message,
          timestamp: serverTimestamp(),
          lastSender: loggedUser.email,
        })
          .then(() => {
            //console.log("Updated succesfully")
          })
          .catch(() => {
            //console.log("Error kod update-a")
          });
      });
      setMessage("");
    }
  };

  return (
    <form onSubmit={sendMessage} className="message-input">
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button type="submit">Send Message</button>
    </form>
  );
};

export default MessageInput;
