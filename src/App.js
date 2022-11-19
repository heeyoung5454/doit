import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <nav>
        <Link to='/'>Login</Link>
      </nav>

      <Routes>
        <Route path='/' element={<Login />} />
        {/* <Route path='/about' element={<About />} /> */}
      </Routes>
    </div>
  );
}

export default App;
