import React, { useState } from "react";
import { Container, Tab, Tabs, Box } from "@mui/material";
import Signup from "../Authentication/SignUp";
import Login from "../Authentication/LoginJs";

const HomePage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#EFEFEF",
      }}
    >
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Signup" sx={{ marginRight: 4, backgroundColor: "" }} />
        <Tab label="Login" sx={{ marginLeft: 4, backgroundColor: "" }} />
      </Tabs>
      <Box mt={2}>
        {value === 0 && <Signup />}
        {value === 1 && <Login />}
      </Box>
    </Container>
  );
};

export default HomePage;
