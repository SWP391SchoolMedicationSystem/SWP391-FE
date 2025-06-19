import { jwtDecode } from "jwt-decode";
import apiClient, { API_ENDPOINTS } from "./config";
import { parentService } from "./parentService";

const userService = {
  // Login user
  login: async (email, password, rememberMe = false) => {
    try {
      // Call real login API
      const response = await apiClient.post(API_ENDPOINTS.USER.LOGIN, {
        email,
        password,
      });

      const data = response; // apiClient already returns response.data

      // If we get a token, decode it to get user info
      if (data.token || data.accessToken || data.access_token) {
        const token = data.token || data.accessToken || data.access_token;

        try {
          const decodedToken = jwtDecode(token);

          const loginData = {
            success: true,
            token: token,
            userId: decodedToken.Id || decodedToken.id || decodedToken.userId,
            email: decodedToken.Email || decodedToken.email || email,
            role: decodedToken.Role || decodedToken.role,
            fullname:
              decodedToken.Fullname ||
              decodedToken.fullname ||
              decodedToken.name,
            phone: decodedToken.Phone || decodedToken.phone,
            status: decodedToken.Status || decodedToken.status,
            isStaff: decodedToken.Role !== "Parent",
            userData: decodedToken,
            decodedToken: decodedToken,
          };

          // Handle Remember Me functionality
          if (rememberMe) {
            this.saveRememberedAccount(email, password, loginData);
          }

          return loginData;
        } catch (error) {
          console.error("Error decoding JWT token:", error);
          // Return raw response if token decode fails
          return {
            success: true,
            ...data,
            email: email,
          };
        }
      }

      // If no token but response is successful
      return {
        success: true,
        ...data,
        email: email,
      };
    } catch (error) {
      console.error("Login error:", error);

      // If API call fails, throw appropriate error
      if (error.response?.status === 401) {
        throw new Error("Email hoặc mật khẩu không đúng");
      } else if (error.response?.status === 404) {
        throw new Error("Endpoint login không tìm thấy");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Không thể kết nối đến server. Vui lòng thử lại.");
      }
    }
  },

  // Get all users
  getAllUsers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL);
    return response.value || response; // Return the users array
  },

  // Helper function to get role from stored token
  getCurrentUserRole: () => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Kiểm tra token có hết hạn không
        if (decodedToken.exp <= currentTime) {
          // Token hết hạn, xóa dữ liệu
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          return null;
        }

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
        // Token không hợp lệ, xóa dữ liệu
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        return null;
      }
    }

    // Fallback to userInfo if no token
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.role || null;
      } catch (error) {
        console.error("Error parsing stored user info:", error);
        localStorage.removeItem("userInfo");
        return null;
      }
    }

    return null;
  },

  // Helper function to check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Kiểm tra token có hết hạn không
        if (decodedToken.exp <= currentTime) {
          // Token hết hạn, xóa dữ liệu
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error decoding token:", error);
        // Token không hợp lệ, xóa dữ liệu
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        return false;
      }
    }

    // Fallback: kiểm tra userInfo (cho trường hợp không có token)
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        // Kiểm tra xem có đủ thông tin cần thiết không
        return !!(user && (user.role || user.email));
      } catch (error) {
        console.error("Error parsing user info:", error);
        localStorage.removeItem("userInfo");
        return false;
      }
    }

    return false;
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
    const response = await apiClient.post(API_ENDPOINTS.EMAIL.SEND, {
      to: email,
      subject: "Đặt lại mật khẩu - Medlearn",
      body: "demo",
    });
    return response; // apiClient already returns response.data
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
  resetPassword: async (/* email, verificationCode, newPassword */) => {
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

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const userRole = userService.getCurrentUserRole();
      
      if (userRole === "Parent") {
        const response = await parentService.updateProfile(userData);
        
        // Update local storage with new data
        const currentUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const updatedUserInfo = { ...currentUserInfo, ...userData };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        
        return response;
      }
      
      throw new Error("Chức năng này chỉ dành cho phụ huynh");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};

export default userService;
