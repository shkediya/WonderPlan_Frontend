import React, { useState } from 'react';
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ContactInfo from "../Forms/ContactInfo";
import FormHeader from "../Forms/FormHeader";
import authService from "../../services/auth.service";
import "../../styles/Forms.css";
import ErrorMessage from "../Forms/ErrorMessage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(JSON.stringify({ email, password }));

    try {
      await authService.login(email, password);
      console.log("Login successful");
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      await authService.googleLogin(response.credential);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was unsuccessful. Try again later");
  };

  return (
    <GoogleOAuthProvider clientId= "476400310595-f9hesqa26tvd6cn31uho8k4pc3tg58or.apps.googleusercontent.com">
      <Box className="form-main-container">
        <FormHeader
          mainTitle="Login"
          secondaryTitle="Log in and continue your wonderful trip plans"
        />
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            type="email"
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box className="form-buttons-container">
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Log in
            </Button>
            <Box sx={{ mt: 2, mb: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </Box>
          </Box>
        </Box>
        {error && <ErrorMessage errorMessage={error} />}
        <ContactInfo />
      </Box>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
