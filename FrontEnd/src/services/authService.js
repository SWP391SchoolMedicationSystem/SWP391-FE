import apiClient, { API_ENDPOINTS } from "./config.js";

// Auth Services for Forgot Password Flow
export const authService = {
  // Step 1: Send OTP to email
  forgotPassword: async (email) => {
    try {
      // API expects email string directly in body, not as object
      const response = await apiClient.post(
        API_ENDPOINTS.USER.FORGOT_PASSWORD,
        email,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      throw error;
    }
  },

  // Step 2: Validate OTP code
  validateOTP: async (email, otpCode) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER.VALIDATE_OTP, {
        email: email,
        otpCode: otpCode,
      });
      return response;
    } catch (error) {
      console.error("Error validating OTP:", error);
      throw error;
    }
  },

  // Step 3: Reset password
  resetPassword: async (email, newPassword) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER.RESET_PASSWORD, {
        email: email,
        newPassword: newPassword,
      });
      return response;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },
};

export default authService;
