// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtfaUXAXjz_s3ScvuWqhEYWLxMGhYWVaE",
  authDomain: "todolist-dfba2.firebaseapp.com",
  projectId: "todolist-dfba2",
  storageBucket: "todolist-dfba2.appspot.com",
  messagingSenderId: "230631162943",
  appId: "1:230631162943:web:c680309a6c3cc320e3a48a",
  measurementId: "G-5YKGW1DCN2",
};

/*const firebaseConfig = {
  apiKey: "AIzaSyC1Jj9TRvWAtyJ0_CZZBcApWsSZqlMnLsk",
  authDomain: "chatproject-7cf5b.firebaseapp.com",
  projectId: "chatproject-7cf5b",
  storageBucket: "chatproject-7cf5b.appspot.com",
  messagingSenderId: "836815840034",
  appId: "1:836815840034:web:2001eb24981ba83184fb7b",
};*/

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const colRefUsers = collection(db, "users");
export const colRefChats = collection(db, "chats");
export const colRefMessages = collection(db, "messages");
