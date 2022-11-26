import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./layout/nav";
import Login from "./pages/Login";
import Join from "./pages/Join";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Nav />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Join" element={<Join />} />
      </Routes>
    </div>
  );
}

export default App;
