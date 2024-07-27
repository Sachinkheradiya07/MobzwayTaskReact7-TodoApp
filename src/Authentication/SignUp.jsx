import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {})
      .then(() => {
        console.log("User profile updated with name:");
        navigate("/todo");
      })

      .catch((error) => {
        alert(error.message);
      });
    console.log("Email:", email);
    console.log("Password:", password);
    // Reset form fields after submission if needed
    setEmail("");
    setPassword("");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>
      <FormControl fullWidth margin="normal" required>
        <TextField
          label="Enter Your Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal" required>
        <TextField
          label="Enter Your Password"
          placeholder="Enter Your Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        fullWidth
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
