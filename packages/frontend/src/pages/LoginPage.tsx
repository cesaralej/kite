import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { Auth } from "aws-amplify";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import logo from "../assets/logo.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    const defaultEmail = "cesar@comkite.com";
    const defaultPassword = "Passw0rd!";
    setIsLoading(true);
    try {
      const loginEmail = email || defaultEmail;
      const loginPassword = password || defaultPassword;
      await Auth.signIn(loginEmail, loginPassword);
      userHasAuthenticated(true);
      console.log("Logged in");
      navigate("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        height="100vh"
        textAlign="center"
        alignItems="center"
      >
        {/* Placeholder image for the app logo */}
        <img
          src={logo}
          alt="App Logo"
          width="150"
          height="150"
          style={{ marginBottom: "20px" }}
        />
        <Typography variant="h4" gutterBottom>
          KiTE
        </Typography>
        <Typography variant="h6" gutterBottom>
          Please log in to continue
        </Typography>
        <TextField
          autoFocus
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? <CircularProgress size={24} /> : "Log In"}
        </Button>
      </Box>
    </Container>
  );
};
export default Login;
