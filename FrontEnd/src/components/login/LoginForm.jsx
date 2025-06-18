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
        // Kiểm tra token có hợp lệ không
        const isAuthenticated = userService.isAuthenticated();

        if (!isAuthenticated) {
          // Token hết hạn hoặc không hợp lệ, xóa localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          return;
        }

        const userData = JSON.parse(userInfo);
        const role = userData.role;

        // Chỉ redirect nếu đang ở trang login (/)
        if (
          window.location.pathname === "/" ||
          window.location.pathname === "/login"
        ) {
          // Redirect based on role
          switch (role) {
            case "Manager":
              navigate("/manager", { replace: true });
              break;
            case "Nurse":
              navigate("/nurse", { replace: true });
              break;
            case "Parent":
              navigate("/parent", { replace: true });
              break;
            case "Admin":
              navigate("/admin", { replace: true });
              break;
            default:
              // Fallback logic
              if (userData.isStaff) {
                navigate("/manager", { replace: true });
              } else {
                navigate("/parent", { replace: true });
              }
              break;
          }
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
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

      // Lưu thông tin user và token nếu có
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Điều hướng dựa trên role từ JWT token
      const role = data.role;

      switch (role) {
        case "Manager":
          navigate("/manager", { replace: true });
          break;
        case "Nurse":
          navigate("/nurse", { replace: true });
          break;
        case "Parent":
          navigate("/parent", { replace: true });
          break;
        case "Admin":
          navigate("/admin", { replace: true });
          break;
        default:
          // Fallback: nếu không có role hoặc role không xác định
          if (data.isStaff) {
            navigate("/manager", { replace: true });
          } else {
            navigate("/parent", { replace: true });
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
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Sign In
            </Typography>
            <Typography color="text.secondary">Access your account</Typography>
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
                ></Typography>
                <Link
                  component={RouterLink}
                  to="/reset-password"
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
                required
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
                      setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
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
