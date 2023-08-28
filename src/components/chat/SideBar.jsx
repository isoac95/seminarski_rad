/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
//import { colRef, db } from "../../firebase";
//import { getDocs, onSnapshot, collection } from "firebase/firestore";

const SideBar = ({
  setTarget,
  targetProp,
  usersProp,
  chatroomsProp,
  loggedUser,
}) => {
  const [input, setInput] = useState("");
  const [selection, setSelection] = useState("chats");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);

  const getUser = (arg) => {
    //arg = chat
    let array = [null, null];
    if (arg.userOne === loggedUser.email) {
      array[1] = arg.userTwo;
    } else {
      array[1] = arg.userOne;
    }
    array[0] = usersProp.filter((user) => user[1] === array[1])[0][0];
    return array;
  };

  useEffect(() => {
    //console.log("Chat prop je: ", chatroomsProp);
    setFilteredUsers(
      usersProp.filter(
        (user) => user[0].startsWith(input) || user[1].startsWith(input)
      )
    );
    //setFilteredChats(chatroomsProp);
    setFilteredChats(
      chatroomsProp.filter(
        (chatroom) =>
          getUser(chatroom)[0].startsWith(input) ||
          getUser(chatroom)[1].startsWith(input)
      )
    );
  }, [input, usersProp, chatroomsProp]);

  const eventHandler = (e, u) => {
    setTarget(u);
    //console.log("click na: ", e.target);
  };

  return (
    <>
      <div className="sidebar-input-div">
        <input
          className="sidebar-input"
          type="text"
          placeholder={`Search for ${selection}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
      </div>
      <div className="sidebar-selector">
        <div
          className={selection === "chats" ? "selected" : "not-selected"}
          onClick={() => setSelection("chats")}
        >
          Chats
        </div>
        <div
          className={selection === "users" ? "selected" : "not-selected"}
          onClick={() => setSelection("users")}
        >
          Users
        </div>
      </div>
      {selection === "users" && filteredUsers.length > 0 && (
        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user[1]}
              className={user[1] === targetProp[1] ? "target" : "not-target"} //maknuti?
              onClick={(event) => eventHandler(event, user)}
            >
              <div>
                <p className="bold">{user[0]}</p>
                &nbsp;
                <p className="email">({user[1]})</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selection === "users" && filteredUsers.length === 0 && (
        <p className="filter-msg">No users match search criteria!</p>
      )}
      {selection === "chats" && filteredChats.length > 0 && (
        <ul>
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              className={
                getUser(chat)[1] === targetProp[1] ? "target" : "not-target"
              }
              onClick={(event) => eventHandler(event, getUser(chat))}
            >
              <div>
                <p className="bold">{getUser(chat)[0]}</p>
                &nbsp;
                <p className="email">({getUser(chat)[1]})</p>
              </div>
              <div className="last-msg">
                <p>
                  {chat.lastSender === loggedUser.email ? "You: " : ""}
                  {chat.lastMessage.length < 22
                    ? chat.lastMessage
                    : chat.lastMessage.substr(0, 21).trim() + "..."}
                </p>
                <p className="timestamp">{chat.timeStamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selection === "chats" && filteredChats.length === 0 && (
        <p className="filter-msg">No chats match search criteria!</p>
      )}
    </>
  );
};

export default SideBar;
