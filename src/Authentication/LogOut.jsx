import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar"; // Import the NavBar component

export default function Logout() {
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLogout(true);
    navigate("/");
  };

  return (
    <>
      <NavBar handleLogout={handleLogout} />
    </>
  );
}
