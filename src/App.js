//import logo from "./logo.svg";
import "./App.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
//import AuthDetails from "./components/AuthDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="/Sign-up" element={<SignUp />} />
          <Route exact path="/Chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
