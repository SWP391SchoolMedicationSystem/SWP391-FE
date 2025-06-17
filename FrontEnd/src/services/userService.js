import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_CONFIG from "./config";

const userService = {
  // Login user
  login: async (email, password, rememberMe = false) => {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_LOGIN}`,
      {
        email,
        password,
      }
    );

    const data = response.data;

    // If response contains a token, decode it to get user info and role
    if (data.token) {
      try {
        const decodedToken = jwtDecode(data.token);

        // Extract role from JWT token
        // The role might be in different fields depending on JWT structure
        const role =
          decodedToken.role ||
          decodedToken.Role ||
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
          decodedToken["role"] ||
          null;

        // Extract other user info from token
        const userId =
          decodedToken.sub ||
          decodedToken.userId ||
          decodedToken.nameid ||
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] ||
          null;

        const userName =
          decodedToken.name ||
          decodedToken.username ||
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] ||
          email;

        const loginData = {
          ...data,
          role: role,
          userId: userId,
          userName: userName,
          email: email,
          decodedToken: decodedToken,
        };

        // Handle Remember Me functionality
        if (rememberMe) {
          this.saveRememberedAccount(email, password, loginData);
        }

        // Return enhanced data with decoded token info
        return loginData;
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        // If token decode fails, return original data
        return data;
      }
    }

    // Check if login was successful without token (fallback)
    if (data && data.userId) {
      // Determine role based on isStaff field
      let role = "parent"; // default role
      if (data.isStaff) {
        // You might need to add more logic here to determine specific staff roles
        // For now, defaulting to admin for staff users
        role = "admin";
      }

      const loginData = {
        success: true,
        userId: data.userId,
        email: data.email,
        isStaff: data.isStaff,
        role: role,
        token: null, // No JWT token from this API
        userData: data,
      };

      // Handle Remember Me functionality
      if (rememberMe) {
        this.saveRememberedAccount(email, password, loginData);
      }

      // Return user info without JWT token
      return loginData;
    }

    return data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ALL_USERS}`
    );
    return response.data;
  },

  // Helper function to get role from stored token
  getCurrentUserRole: () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return (
          decodedToken.role ||
          decodedToken.Role ||
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
          null
        );
      } catch (error) {
        console.error("Error decoding stored token:", error);
        return null;
      }
    }

    // Fallback to userInfo if no token
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.role || null;
      } catch (error) {
        console.error("Error parsing stored user info:", error);
        return null;
      }
    }
    return null;
  },

  // Helper function to check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      } catch {
        return false;
      }
    }

    // Fallback to userInfo if no token
    const userInfo = localStorage.getItem("userInfo");
    return userInfo !== null;
  },

  // Remember Me functionality
  saveRememberedAccount: (email, password, userData) => {
    try {
      const rememberedAccounts = userService.getRememberedAccounts();

      // Remove existing account if exists
      const filteredAccounts = rememberedAccounts.filter(
        (acc) => acc.email !== email
      );

      // Add new account info
      const accountToSave = {
        email: email,
        password: password, // In production, consider encrypting this
        userData: {
          userName: userData.userName || userData.email,
          role: userData.role,
          userId: userData.userId,
          isStaff: userData.isStaff,
        },
        savedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      filteredAccounts.unshift(accountToSave); // Add to beginning

      // Keep only last 5 remembered accounts
      const accountsToSave = filteredAccounts.slice(0, 5);

      localStorage.setItem(
        "rememberedAccounts",
        JSON.stringify(accountsToSave)
      );
    } catch (error) {
      console.error("Error saving remembered account:", error);
    }
  },

  getRememberedAccounts: () => {
    try {
      const accounts = localStorage.getItem("rememberedAccounts");
      return accounts ? JSON.parse(accounts) : [];
    } catch (error) {
      console.error("Error getting remembered accounts:", error);
      return [];
    }
  },

  removeRememberedAccount: (email) => {
    try {
      const rememberedAccounts = userService.getRememberedAccounts();
      const filteredAccounts = rememberedAccounts.filter(
        (acc) => acc.email !== email
      );
      localStorage.setItem(
        "rememberedAccounts",
        JSON.stringify(filteredAccounts)
      );
    } catch (error) {
      console.error("Error removing remembered account:", error);
    }
  },

  getLastRememberedAccount: () => {
    const accounts = userService.getRememberedAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  },

  clearAllRememberedAccounts: () => {
    localStorage.removeItem("rememberedAccounts");
  },

  // Send reset password email
  sendResetPasswordEmail: async (email) => {
    const response = await axios.post(
      "https://api-schoolhealth.purintech.id.vn/api/Email/sendEmail",
      {
        to: email,
        subject: "Đặt lại mật khẩu - Medlearn",
        body: "demo",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // Verify reset code (mock function - replace with real API when available)
  verifyResetCode: async (email, code) => {
    // Mock verification - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (code.length !== 6) {
      throw new Error("Mã xác nhận không hợp lệ");
    }

    return { success: true, message: "Mã xác nhận hợp lệ" };
  },

  // Reset password (mock function - replace with real API when available)
  resetPassword: async (email, verificationCode, newPassword) => {
    // Mock reset - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { success: true, message: "Đặt lại mật khẩu thành công" };
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    // Note: We don't remove remembered accounts on logout
  },
};

export default userService;
