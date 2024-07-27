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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LoginJs = () => {
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
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user);
        // Redirect to /todo page after successful login
        navigate("/todo");
      })
      .catch((error) => {
        alert(error.message);
      });
    // Reset form fields after submission if needed
    setEmail("");
    setPassword("");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Login
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
        Login
      </Button>
    </Box>
  );
};

export default LoginJs;
