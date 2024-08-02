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
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const ipAddress = await fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => data.ip);

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        password,
        ipAddress,
        signupTime: new Date(),
      });

      navigate("/todo");
    } catch (error) {
      alert(error.message);
    }

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
