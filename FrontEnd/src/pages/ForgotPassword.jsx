import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../css/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authService.forgotPassword(email);
      setSuccess("Mã OTP đã được gửi đến email của bạn!");
      setCurrentStep(2);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP
  const handleValidateOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authService.validateOTP(email, otpCode);
      setSuccess("Mã OTP hợp lệ! Vui lòng nhập mật khẩu mới.");
      setCurrentStep(3);
    } catch (error) {
      setError(
        error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email, newPassword);
      setSuccess("Đặt lại mật khẩu thành công!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Không thể đặt lại mật khẩu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous step
  const handleGoBack = () => {
    setError("");
    setSuccess("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authService.forgotPassword(email);
      setSuccess("Mã OTP mới đã được gửi đến email của bạn!");
    } catch (error) {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {/* Header */}
        <div className="forgot-password-header">
          <h1>🔒 Quên Mật Khẩu</h1>
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
            <div
              className={`step-line ${currentStep >= 2 ? "active" : ""}`}
            ></div>
            <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
            <div
              className={`step-line ${currentStep >= 3 ? "active" : ""}`}
            ></div>
            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
          </div>
          <div className="step-labels">
            <span className={currentStep >= 1 ? "active" : ""}>Email</span>
            <span className={currentStep >= 2 ? "active" : ""}>OTP</span>
            <span className={currentStep >= 3 ? "active" : ""}>
              Mật khẩu mới
            </span>
          </div>
        </div>

        {/* Messages */}
        {error && <div className="message error">❌ {error}</div>}
        {success && <div className="message success">✅ {success}</div>}

        {/* Step 1: Email Input */}
        {currentStep === 1 && (
          <form onSubmit={handleSendOTP} className="forgot-password-form">
            <div className="step-content">
              <h2>📧 Nhập địa chỉ email</h2>
              <p>Vui lòng nhập địa chỉ email đã đăng ký để nhận mã OTP</p>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  ← Quay lại đăng nhập
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "⏳ Đang gửi..." : "Gửi mã OTP →"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: OTP Validation */}
        {currentStep === 2 && (
          <form onSubmit={handleValidateOTP} className="forgot-password-form">
            <div className="step-content">
              <h2>🔢 Nhập mã OTP</h2>
              <p>
                Mã OTP đã được gửi đến <strong>{email}</strong>
              </p>

              <div className="form-group">
                <label>Mã OTP *</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Nhập mã OTP 6 số"
                  maxLength="6"
                  required
                  disabled={loading}
                  className="otp-input"
                />
              </div>

              <div className="resend-section">
                <span>Không nhận được mã? </span>
                <button
                  type="button"
                  className="btn-link"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Gửi lại mã OTP
                </button>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleGoBack}
                  disabled={loading}
                >
                  ← Quay lại
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "⏳ Đang xác thực..." : "Xác thực OTP →"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {currentStep === 3 && (
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <div className="step-content">
              <h2>🔑 Đặt mật khẩu mới</h2>
              <p>
                Vui lòng nhập mật khẩu mới cho tài khoản{" "}
                <strong>{email}</strong>
              </p>

              <div className="form-group">
                <label>Mật khẩu mới *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  minLength="6"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  minLength="6"
                  required
                  disabled={loading}
                />
              </div>

              <div className="password-requirements">
                <small>ℹ️ Mật khẩu phải có ít nhất 6 ký tự</small>
              </div>

              <div className="form-actions">
                {currentStep !== 3 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleGoBack}
                    disabled={loading}
                  >
                    ← Quay lại
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "⏳ Đang đặt lại..." : "Đặt lại mật khẩu ✓"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
