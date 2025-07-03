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
import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import userService from "../../services/userService";
const clientId =
  "251792493601-lkt15jmuh1jfr1cvgd0a45uamdqusosg.apps.googleusercontent.com";

export default function LoginForm() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        const role = userData.role;

        // Redirect based on role
        switch (role) {
          case "Manager":
            navigate("/manager");
            break;
          case "Nurse":
            navigate("/nurse");
            break;
          case "Parent":
            navigate("/parent");
            break;
          case "Admin":
            navigate("/admin");
            break;
          default:
            // Fallback logic
            if (userData.isStaff) {
              navigate("/manager");
            } else {
              navigate("/parent");
            }
            break;
        }
      } catch {
        // If userInfo is corrupted, clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      }
    }
  }, [navigate]);

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
      const data = await userService.login(formData.email, formData.password);
      console.log("Login success:", data);

      // Lưu thông tin user và token nếu có
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Điều hướng dựa trên role từ JWT token
      const role = data.role;
      console.log("User role:", role);

      switch (role) {
        case "Manager":
          navigate("/manager");
          break;
        case "Nurse":
          navigate("/nurse");
          break;
        case "Parent":
          navigate("/parent");
          break;
        case "Admin":
          navigate("/admin"); // Trang admin placeholder
          break;
        default:
          // Fallback: nếu không có role hoặc role không xác định
          if (data.isStaff) {
            navigate("/manager"); // Backup cho staff
          } else {
            navigate("/parent"); // Backup cho parent
          }
          break;
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Email hoặc mật khẩu không đúng.");
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      } else {
        setError("Không thể kết nối đến server. Vui lòng thử lại.");
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
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#2f5148",
                mb: 1,
              }}
            >
              Sign In
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                color: "#97a19b",
                fontSize: "0.95rem",
              }}
            >
              Access your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline sx={{ color: "#2f5148" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#c1cbc2",
                  },
                  "&:hover fieldset": {
                    borderColor: "#2f5148",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2f5148",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#97a19b",
                  "&.Mui-focused": {
                    color: "#2f5148",
                  },
                },
              }}
            />

            <Box>
              <TextField
                id="password-field"
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#2f5148" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#c1cbc2",
                    },
                    "&:hover fieldset": {
                      borderColor: "#2f5148",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2f5148",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#97a19b",
                    "&.Mui-focused": {
                      color: "#2f5148",
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                }}
              >
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    color: "#73ad67",
                    fontWeight: "500",
                    "&:hover": {
                      color: "#2f5148",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  sx={{
                    color: "#2f5148",
                    "&.Mui-checked": {
                      color: "#2f5148",
                    },
                  }}
                />
              }
              label="Remember me"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: "#97a19b",
                },
              }}
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                textAlign="center"
                mt={1}
                sx={{
                  backgroundColor: "rgba(195, 85, 92, 0.1)",
                  padding: "8px 16px",
                  borderRadius: 2,
                  border: "1px solid rgba(195, 85, 92, 0.3)",
                  color: "#c3555c",
                }}
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
                background: "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1e342a 0%, #5c8a53 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(47, 81, 72, 0.3)",
                },
                py: 1.5,
                mt: 1,
                borderRadius: 2,
                fontWeight: "600",
                fontSize: "1rem",
                textTransform: "none",
                transition: "all 0.3s ease",
              }}
            >
              Sign In
            </Button>
          </form>

          <Divider sx={{ my: 1, color: "#97a19b" }}>Or sign in with</Divider>

          <GoogleOAuthProvider clientId={clientId}>
            <div style={{ padding: "2rem" }}>
              {!user ? (
                <>
                  <GoogleLogin
                    clientId={clientId}
                    onSuccess={async (credentialResponse) => {
                      const decoded = jwtDecode(credentialResponse.credential);
                      setUser(decoded);

                      // Lưu thông tin Google user
                      const googleUserData = {
                        email: decoded.email,
                        name: decoded.name,
                        role: "Parent", // Google login mặc định là Parent
                        isGoogleAuth: true,
                      };
                      localStorage.setItem(
                        "userInfo",
                        JSON.stringify(googleUserData)
                      );

                      // Google login luôn điều hướng đến Parent portal
                      navigate("/parent");
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </GoogleOAuthProvider>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}
          >
            <IconButton
              sx={{
                color: "#2f5148",
                "&:hover": {
                  backgroundColor: "rgba(47, 81, 72, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              sx={{
                color: "#2f5148",
                "&:hover": {
                  backgroundColor: "rgba(47, 81, 72, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              sx={{
                color: "#2f5148",
                "&:hover": {
                  backgroundColor: "rgba(47, 81, 72, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Instagram />
            </IconButton>
          </Box>

          {/* <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 1, color: "#97a19b" }}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="#"
              sx={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#73ad67",
                "&:hover": {
                  color: "#2f5148",
                },
              }}
            >
              Sign up now
            </Link>
          </Typography> */}
        </CardContent>
      </Card>
    </Box>
  );
}
