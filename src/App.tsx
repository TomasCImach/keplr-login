import React from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import logo from "./logo.svg";
import "./App.scss";
import Header from "./header";
import Home from "./pages/home";
import Error from "./pages/error";
import Profile from "./pages/profile"
import Feed from "./pages/feed";

function App() {
  return (
    <div className="App">
      <section className="vbox">
        <Header />
        <section>
          <Router>
            <Routes>
              <Route path="/" index element={<Feed />} />
              <Route path="/feed" index element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* WILD CARD */}
              <Route path="*" element={<Error />} />
            </Routes>
          </Router>
        </section>
      </section>
    </div>
  );
}

export default App;
