// File: src/components/login/LoginForm.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import {
  MailOutline,
  LockOutlined,
  Facebook,
  Twitter,
  Instagram,
  Google,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "https://c2c0-2405-4802-9173-48c0-5084-4fcd-28bb-eeed.ngrok-free.app/api/Login/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      const data = response.data;
      console.log("Login success:", data);

      // Lưu token
      localStorage.setItem("token", data.token);

      // Điều hướng đến dashboard
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message); // Lỗi từ server
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Card
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: 6,
          width: "100%",
          maxWidth: 450,
          animation: "fadeInUp 0.6s ease-out",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Sign In
            </Typography>
            <Typography color="text.secondary">Access your account</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              name="username"
              label="Email"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  htmlFor="password-field"
                  sx={{ fontWeight: 500 }}
                >
                  Password
                </Typography>
                <Link
                  component={RouterLink}
                  to="#"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </Box>
              <TextField
                id="password-field"
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 0.5 }}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
              }
              label="Remember me"
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                textAlign="center"
                mt={1}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                color: "white",
                background: "linear-gradient(to right, #56D0DB, #2D77C1)",
                "&:hover": { opacity: 0.9 },
                py: 1.5,
                mt: 1,
              }}
            >
              Sign In
            </Button>
          </form>

          <Divider sx={{ my: 1 }}>Or sign in with</Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<Google />}
          >
            Continue with Google
          </Button>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}
          >
            <IconButton>
              <Facebook />
            </IconButton>
            <IconButton>
              <Twitter />
            </IconButton>
            <IconButton>
              <Instagram />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="#"
              sx={{ fontWeight: "bold", textDecoration: "none" }}
            >
              Sign up now
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
