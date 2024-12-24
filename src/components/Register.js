
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import axios from 'axios'
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    number: false,
    specialChar: false,
    capitalLetter: false,
  });

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log('api url', apiUrl);
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(`${apiUrl}/register`, { username, email, password });

      if (response.status === 201 && response.data.message) {
        setMessage(response.data.message);
        navigate("/login");
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  // Password validation logic
  const validatePassword = (password) => {
    const lengthValid = password.length >= 8;
    const numberValid = /[0-9]/.test(password);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const capitalLetterValid = /[A-Z]/.test(password);

    setPasswordRules({
      length: lengthValid,
      number: numberValid,
      specialChar: specialCharValid,
      capitalLetter: capitalLetterValid,
    });

    return lengthValid && numberValid && specialCharValid && capitalLetterValid;
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (passwordValue) {
      const isValid = validatePassword(passwordValue);
      setPasswordError(!isValid);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  // Regex for email validation
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          backgroundColor: "linear-gradient(to right, #ff7e5f, #feb47b)", // same gradient as login
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
          mt: 5,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 3, color: "#fff", textAlign: "center" }}>
          Register
        </Typography>

        {message && <Typography color="error" sx={{ marginBottom: 3 }}>{message}</Typography>}

        <TextField
          label="Username"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          sx={{
            marginBottom: 3,
            backgroundColor: "#fff", // white background for input
            borderRadius: 2,
          }}
        />

        <TextField
          label="Email"
          variant="filled"
          value={email}
          onChange={handleEmailChange}
          required
          fullWidth
          error={!isEmailValid && email.length > 0}
          helperText={!isEmailValid && email.length > 0 ? "Invalid email address" : ""}
          sx={{
            marginBottom: 3,
            backgroundColor: "#fff", // same white background for input
            borderRadius: 2,
          }}
        />

        <TextField
          label="Password"
          type="password"
          variant="filled"
          value={password}
          onChange={handlePasswordChange}
          required
          fullWidth
          error={passwordError}
          helperText={passwordError ? "Password does not meet criteria" : ""}
          sx={{
            marginBottom: 3,
            backgroundColor: "#fff", // white background for input
            borderRadius: 2,
          }}
        />

        {/* Password Rules */}
        {password && (
          <Box sx={{ marginBottom: 3, textAlign: "left", width: "100%" }}>
            <Typography variant="body2" color={passwordRules.length ? "green" : "red"}>
              - At least 8 characters
            </Typography>
            <Typography variant="body2" color={passwordRules.number ? "green" : "red"}>
              - At least 1 number
            </Typography>
            <Typography variant="body2" color={passwordRules.specialChar ? "green" : "red"}>
              - At least 1 special character
            </Typography>
            <Typography variant="body2" color={passwordRules.capitalLetter ? "green" : "red"}>
              - At least 1 capital letter
            </Typography>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            padding: "12px",
            fontSize: "16px",
            backgroundColor: "#ff6f61", // same color as login
            color: "#fff",
            "&:hover": {
              backgroundColor: "#d9534f", // darker hover effect
            },
            "&:disabled": {
              backgroundColor: "#c8c8c8", // disabled state styling
            },
          }}
          disabled={!isEmailValid || passwordError}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;

