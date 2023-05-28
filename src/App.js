import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/enter/Login";
import Join from "./pages/enter/Join";
import Main from "./pages/Main";
import Day from "./pages/task/Day";
import TaskDetail from "./pages/task/TaskDetail";
import TaskUpdate from "./pages/task/TaskUpdate";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/main" element={<Main />} />
        <Route path="/day" element={<Day />} />
        <Route path="/detail" element={<TaskDetail />} />
        <Route path="/taskUpdate" element={<TaskUpdate />} />
      </Routes>
    </div>
  );
}

export default App;
