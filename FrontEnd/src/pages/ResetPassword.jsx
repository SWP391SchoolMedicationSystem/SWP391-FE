import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  InputAdornment,
  Alert,
  Link,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  MailOutline,
  LockOutlined,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import userService from "../services/userService";
import "../css/ResetPassword.css";

const steps = ["Nhập Email", "Xác Nhận", "Đặt Lại Mật Khẩu"];

export default function ResetPassword() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call real API to send reset email
      await userService.sendResetPasswordEmail(email);

      setSuccess(
        `Email đặt lại mật khẩu đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư của bạn.`
      );
      setActiveStep(1);
    } catch (err) {
      console.error("Error sending reset email:", err);
      if (err.response) {
        setError(
          `Lỗi gửi email: ${err.response.data?.message || err.response.status}`
        );
      } else if (err.request) {
        setError(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet."
        );
      } else {
        setError(
          "Không thể gửi email reset. Vui lòng kiểm tra lại địa chỉ email."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call API to verify code
      await userService.verifyResetCode(email, verificationCode);

      setSuccess("Mã xác nhận hợp lệ. Vui lòng đặt mật khẩu mới.");
      setActiveStep(2);
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Mã xác nhận không đúng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setLoading(false);
      return;
    }

    try {
      // Call API to reset password
      await userService.resetPassword(email, verificationCode, newPassword);

      setSuccess(
        "Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập..."
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <form onSubmit={handleEmailSubmit}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              Quên Mật Khẩu?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt
              lại mật khẩu.
            </Typography>

            <TextField
              label="Địa chỉ Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                color: "white",
                background: "linear-gradient(to right, #73ad67, #2f5148)",
                "&:hover": { opacity: 0.9 },
                py: 1.5,
                mb: 2,
              }}
            >
              {loading ? "Đang gửi..." : "Gửi Mã Xác Nhận"}
            </Button>
          </form>
        );

      case 1:
        return (
          <form onSubmit={handleVerificationSubmit}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              Xác Nhận Email
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Chúng tôi đã gửi mã xác nhận 6 chữ số đến email{" "}
              <strong>{email}</strong>. Vui lòng nhập mã để tiếp tục.
            </Typography>

            <TextField
              label="Mã Xác Nhận (6 chữ số)"
              fullWidth
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              required
              sx={{ mb: 3 }}
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: "center",
                  fontSize: "1.5rem",
                  letterSpacing: "0.5rem",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || verificationCode.length !== 6}
              sx={{
                color: "white",
                background: "linear-gradient(to right, #73ad67, #2f5148)",
                "&:hover": { opacity: 0.9 },
                py: 1.5,
                mb: 2,
              }}
            >
              {loading ? "Đang xác nhận..." : "Xác Nhận"}
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={() => setActiveStep(0)}
              sx={{ color: "#73ad67" }}
            >
              Thay đổi địa chỉ email
            </Button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handlePasswordReset}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              Đặt Mật Khẩu Mới
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
            </Typography>

            <TextField
              label="Mật Khẩu Mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Xác Nhận Mật Khẩu"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                color: "white",
                background: "linear-gradient(to right, #73ad67, #2f5148)",
                "&:hover": { opacity: 0.9 },
                py: 1.5,
                mb: 2,
              }}
            >
              {loading ? "Đang cập nhật..." : "Đặt Lại Mật Khẩu"}
            </Button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#F0F9FF",
      }}
    >
      <Header />

      <Container
        component="main"
        maxWidth="sm"
        sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Back to Login Link */}
          <Box sx={{ width: "100%", mb: 3 }}>
            <Link
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#73ad67",
                fontWeight: 500,
                "&:hover": { opacity: 0.8 },
              }}
            >
              <ArrowBack sx={{ mr: 1 }} />
              Quay lại Đăng nhập
            </Link>
          </Box>

          {/* Progress Stepper */}
          <Box sx={{ width: "100%", mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Main Card */}
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: 6,
              width: "100%",
              maxWidth: 500,
              animation: "fadeInUp 0.6s ease-out",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Success Message */}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
                  {success}
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Step Content */}
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Help Text */}
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
          >
            Cần hỗ trợ? Liên hệ{" "}
            <Link
              href="mailto:support@medlearn.com"
              sx={{ color: "#73ad67", textDecoration: "none" }}
            >
              support@medlearn.com
            </Link>
          </Typography>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
