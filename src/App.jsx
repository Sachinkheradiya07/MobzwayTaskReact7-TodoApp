import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Homepage from "./pages/HomePage";
import TodoApp from "./pages/TodoApp";
import Task from "./menuItem/Tasks";
import TaskList from "./menuItem/TaskList";
import Users from "./menuItem/Users";
import NavBar from "./NavBar";

function App() {
  const [logout, setLogout] = useState(false);

  const handleLogout = () => {
    setLogout(true);
  };

  return (
    <div className="App">
      <Router>
        <ConditionalNavBar handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/todo" element={<TodoApp />} />
          <Route path="/tasks" element={<Task />} />
          <Route path="/tasklist" element={<TaskList />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
  );
}

const ConditionalNavBar = ({ handleLogout }) => {
  const location = useLocation();
  const hideNavBar = location.pathname === "/";

  return !hideNavBar && <NavBar handleLogout={handleLogout} />;
};

export default App;
