import apiClient, { API_ENDPOINTS } from './config.js';

// Auth Services for Forgot Password Flow
export const authService = {
  // Step 1: Send OTP to email
  forgotPassword: async email => {
    try {
      // API expects email string directly in body, not as object
      const response = await apiClient.post(
        API_ENDPOINTS.USER.FORGOT_PASSWORD,
        email,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error sending forgot password email:', error);
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
      console.error('Error validating OTP:', error);
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
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Verify current password using login endpoint
  verifyCurrentPassword: async (email, currentPassword) => {
    try {
      console.log('🔍 Verifying current password for:', email);
      console.log(
        '🔍 Password (first 2 chars):',
        currentPassword.substring(0, 2) + '***'
      );

      const response = await apiClient.post(API_ENDPOINTS.USER.LOGIN, {
        email: email,
        password: currentPassword,
      });

      console.log('✅ Password verification response:', response);
      console.log('✅ Response keys:', Object.keys(response || {}));

      // Check if we get a token back (meaning login was successful)
      const data = response; // apiClient already returns response.data

      const token = data.token || data.accessToken || data.access_token;

      if (token) {
        console.log(
          '✅ Password verification successful - token received:',
          token.substring(0, 20) + '...'
        );
        return { success: true, data };
      } else {
        console.log('❌ Password verification failed - no token received');
        console.log('❌ Response data:', JSON.stringify(data, null, 2));
        throw new Error('Invalid password - no token in response');
      }
    } catch (error) {
      console.error('❌ Error verifying current password:', error);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ Error message:', error.message);

      // Always throw error so it can be caught by the caller
      throw new Error(
        'Password verification failed: ' +
          (error.response?.data?.message || error.message)
      );
    }
  },
};

export default authService;
