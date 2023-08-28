import AuthDetails from "./chat/AuthDetails";
import SideBar from "./chat/SideBar";
import { Link } from "react-router-dom";
import {
  auth,
  colRefChats,
  colRefMessages,
  db,
  colRefUsers,
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDocs,
  onSnapshot,
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  or,
  and,
  serverTimestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import Messages from "./chat/Messages";
import Target from "./chat/Target";
import MessageInput from "./chat/MessageInput";

const Chat = () => {
  const [authUser, setAuthUser] = useState(null);
  const [target, setTarget] = useState([null, null]);
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (chatRoomId !== null && target[1] !== null) {
      //console.log("Update seen statusa poruka");
      const refSeen = query(
        colRefMessages,
        //and(
        where("sender", "==", target[1].toString()), //authUser.email.toString() //"testuser5@test.test"
        where("chatroom", "==", chatRoomId.toString()), //chatRoomId.toString() //"tlIDSOge47WWBR5dRLGr"
        where("seenStatus", "==", false)
        //)
      );
      getDocs(refSeen)
        .then((snapshot) => {
          //console.log("Snapshot docs: ", snapshot.docs);
          snapshot.docs.forEach((dok) => {
            updateDoc(doc(db, "messages", dok.id), {
              seenStatus: true,
            })
              .then(() => {
                //console.log("Updated succesfully");
              })
              .catch(() => {
                //console.log("Error kod update-a");
              });
          });
        })
        .catch(() => {
          //console.log("Error u dohvacanju message-a");
        });
    }
  }, [messages, chatRoomId, target]); //mozda samo target ili chatRoomId //messages, chatRoomId, target

  useEffect(() => {
    if (authUser != null && target[1] !== null) {
      //console.log("Trazenje chatroom id-a");
      //&& chatRooms.length > 0
      const ref = query(
        colRefChats,
        or(
          and(
            where("userOne", "==", authUser.email.toString()),
            where("userTwo", "==", target[1].toString())
          ),
          and(
            where("userOne", "==", target[1].toString()),
            where("userTwo", "==", authUser.email.toString())
          )
        )
      );
      getDocs(ref)
        .then((snapshot) => {
          //console.log(snapshot.docs[0].id);
          setChatRoomId(snapshot.docs[0].id);
        })
        .catch((error) => {
          //problem -> sto ako je neki drugi error
          //console.log("Error je: ", error);
          addDoc(colRefChats, {
            userOne: authUser.email,
            userTwo: target[1],
            lastMessage: "Start conversation",
            lastSender: "System",
            timestamp: serverTimestamp(),
          });
        });
    }
  }, [authUser, target, chatRooms]); //mozda samo target //authUser, target, chatRooms

  useEffect(() => {
    const unsubMessages = onSnapshot(collection(db, "messages"), () => {
      if (chatRoomId != null) {
        //console.log("Trazenje relevantnih poruka");
        const ref = query(
          colRefMessages,
          where("chatroom", "==", chatRoomId.toString()) //chatRoomId.toString() //"tlIDSOge47WWBR5dRLGr"
        );
        getDocs(ref)
          .then((snapshot) => {
            let Messages = [];
            snapshot.docs.forEach((doc) => {
              Messages.push({
                type: doc.data().sender === authUser.email ? "Tx" : "Rx",
                text: doc.data().text,
                msgDate: doc.data().timestamp.toDate(),
                seen: doc.data().seenStatus,
                ts: {
                  tsDate: doc.data().timestamp.toDate().toDateString(),
                  tsTime: doc
                    .data()
                    .timestamp.toDate()
                    .toTimeString()
                    .substr(0, 5),
                },
              });
            });
            Messages.sort((a, b) => a.msgDate - b.msgDate);
            setMessages(Messages);
            //console.log(Messages);
          })
          .catch((error) => {
            //console.log(error)
          });
      }
    });
    return () => {
      unsubMessages();
    };
  }, [chatRoomId, authUser]); //mozda samo chatRoomId //chatRoomId, authUser

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    const unsubChats = onSnapshot(collection(db, "chats"), () => {
      if (authUser != null) {
        //console.log("Trazenje relevantnih chatroom-a");
        const ref = query(
          colRefChats,
          or(
            where("userOne", "==", authUser.email.toString()), //authUser.email.toString() //"testuser5@test.test"
            where("userTwo", "==", authUser.email.toString())
          )
        );
        getDocs(ref)
          .then((snapshot) => {
            let chatsArray = [];
            snapshot.docs.forEach((doc) => {
              chatsArray.push({
                userOne: doc.data().userOne,
                userTwo: doc.data().userTwo,
                lastMessage: doc.data().lastMessage,
                msgDate: doc.data().timestamp.toDate(),
                timeStamp: doc
                  .data()
                  .timestamp.toDate()
                  .toTimeString()
                  .substr(0, 5),
                lastSender: doc.data().lastSender,
                id: doc.id,
              });
            });
            chatsArray.sort((a, b) => b.msgDate - a.msgDate);
            setChatRooms(chatsArray);
          })
          .catch((error) => {
            //console.log(error)
          });
      }
    });

    const unsubUsers = onSnapshot(collection(db, "users"), () => {
      //console.log("Dohvacanje user database-a");
      getDocs(colRefUsers)
        //bez query-a potrebni su svi useri
        .then((snapshot) => {
          let userArray = [];
          snapshot.docs.forEach((doc) => {
            //console.log(doc.data().username);
            userArray.push([doc.data().nickname, doc.data().username]);
          });
          userArray.sort((a, b) =>
            a[0] !== b[0] ? (a[0] < b[0] ? -1 : 1) : 0
          );
          setUsers(userArray);
        })
        .catch((error) => {
          //console.log(error)
        });
    });

    return () => {
      listen();
      unsubChats();
      unsubUsers();
    };
  }, [authUser]); //authUser
  return (
    <>
      {authUser !== null && (
        <div className="chat-container">
          <div className="sidebar-container">
            <AuthDetails loggedUser={authUser} usersProp={users} />
            <SideBar
              setTarget={setTarget}
              targetProp={target}
              usersProp={users}
              chatroomsProp={chatRooms}
              loggedUser={authUser}
            />
          </div>
          <div className="right-side-container">
            <Target targetProp={target} />
            {target[1] !== null && (
              <>
                <Messages messagesProp={messages} />
                <MessageInput
                  loggedUser={authUser}
                  chatRoomIdProp={chatRoomId}
                />
              </>
            )}
            {target[1] === null && (
              <div className="welcome-screen">
                <div>
                  <h1>Welcome to chat app!</h1>
                  <p> Chat with your friends.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {authUser === null && (
        <div className="signed-out-error">
          <p>
            Error! You are not signed in.
            <br />
            <Link to="/">Sign in</Link> to see your messages!
          </p>
        </div>
      )}
    </>
  );
};

export default Chat;
