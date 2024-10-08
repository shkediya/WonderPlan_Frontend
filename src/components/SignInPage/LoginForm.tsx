import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  GoogleCredentialResponse,
} from "@react-oauth/google";
import FormHeader from "../Forms/FormHeader";
import authService, { AuthData } from "../../services/auth.service";
import ErrorMessage from "../Forms/ErrorMessage";
import { useAuth } from "../../contexts/AuthProvider";
import "../../styles/Forms.css";
import "../../styles/SignInPage.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const authData = await authService.login(email, password);
      loginSuccess(authData!);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleSuccess = async (response: GoogleCredentialResponse) => {
    try {
      const authData = await authService.googleLogin(response.credential!);
      loginSuccess(authData!);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const loginSuccess = (authData: AuthData) => {
    localStorage.setItem('accessToken', authData.token);
    login(authData!);
    console.log("Login successful");
    navigate("/trips");
    navigate("/");
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was unsuccessful. Try again later");
  };

  return (
    <GoogleOAuthProvider clientId="476400310595-f9hesqa26tvd6cn31uho8k4pc3tg58or.apps.googleusercontent.com">
      <Box className="form-main-container sign-in-container">
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
            <Box className="full-width">
              <GoogleLogin
                width="400"
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </Box>
          </Box>
        </Box>
        {error && <ErrorMessage errorMessage={error} />}
        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Typography variant="body2">
            Don't have an account? <Link href="/register">Sign Up</Link>
          </Typography>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
