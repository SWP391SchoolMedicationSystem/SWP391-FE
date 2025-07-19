import { jwtDecode } from 'jwt-decode';
import apiClient, { API_ENDPOINTS } from './config';
import { parentService } from './parentService';

const userService = {
  // Login user
  login: async (email, password, rememberMe = false) => {
    try {
      console.log('🔐 Attempting login with:', {
        email,
        endpoint: API_ENDPOINTS.USER.LOGIN,
      });

      // Call real login API
      const response = await apiClient.post(API_ENDPOINTS.USER.LOGIN, {
        email,
        password,
      });

      const data = response; // apiClient already returns response.data
      console.log('📡 API Response:', data);

      // CRITICAL: Check if login was successful by validating JWT token
      const token = data.token || data.accessToken || data.access_token;

      if (!token) {
        console.error('❌ No JWT token in response - login failed');
        throw new Error('Đăng nhập thất bại - không nhận được token xác thực');
      }

      // Validate JWT token
      try {
        const decodedToken = jwtDecode(token);
        console.log('🔓 JWT decoded successfully:', decodedToken);

        // Check token expiration
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.error('❌ JWT token expired');
          throw new Error('Token đã hết hạn');
        }

        // Validate required fields in token
        const role = decodedToken.Role || decodedToken.role;
        const userId =
          decodedToken.Id || decodedToken.id || decodedToken.userId;
        const userEmail = decodedToken.Email || decodedToken.email;

        if (!role || !userId) {
          console.error('❌ Missing required fields in JWT token:', {
            role,
            userId,
          });
          throw new Error('Token không hợp lệ - thiếu thông tin người dùng');
        }

        // Verify email matches
        if (userEmail && userEmail.toLowerCase() !== email.toLowerCase()) {
          console.error('❌ Email mismatch in token:', {
            tokenEmail: userEmail,
            inputEmail: email,
          });
          throw new Error('Thông tin đăng nhập không khớp');
        }

        console.log('✅ JWT validation successful');

        const loginData = {
          success: true,
          token: token,
          userId: userId,
          email: userEmail || email,
          role: role,
          fullname:
            decodedToken.Fullname || decodedToken.fullname || decodedToken.name,
          phone: decodedToken.Phone || decodedToken.phone,
          status: decodedToken.Status || decodedToken.status,
          isStaff: role !== 'Parent',
          userData: decodedToken,
          decodedToken: decodedToken,
        };

        // For Parent role, set parentId to be the same as userId
        if (role === 'Parent') {
          loginData.parentId = loginData.userId;
        }

        // Handle Remember Me functionality
        if (rememberMe) {
          this.saveRememberedAccount(email, password, loginData);
        }

        console.log('🎉 Login successful for user:', { userId, email, role });
        return loginData;
      } catch (jwtError) {
        console.error('❌ JWT validation failed:', jwtError);
        throw new Error('Token không hợp lệ - vui lòng thử lại');
      }
    } catch (error) {
      console.error('❌ Login error:', error);

      // Handle API errors
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        console.error('API Error Details:', { status, responseData });

        if (status === 401) {
          // Unauthorized - wrong credentials
          throw error; // Re-throw to be handled by LoginForm
        } else if (status === 404) {
          throw new Error('Email không tồn tại trong hệ thống');
        } else if (status === 400) {
          // Bad request - invalid data
          const message =
            responseData?.message || 'Thông tin đăng nhập không hợp lệ';
          throw new Error(message);
        } else if (status >= 500) {
          throw new Error('Lỗi server - vui lòng thử lại sau');
        } else {
          const message = responseData?.message || 'Đăng nhập thất bại';
          throw new Error(message);
        }
      } else if (error.request) {
        // Network error
        throw new Error('Không thể kết nối đến server');
      } else {
        // Other error (including JWT validation errors)
        throw error;
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
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Kiểm tra token có hết hạn không
        if (decodedToken.exp <= currentTime) {
          // Token hết hạn, xóa dữ liệu
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          return null;
        }

        return (
          decodedToken.role ||
          decodedToken.Role ||
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] ||
          null
        );
      } catch (error) {
        console.error('Error decoding stored token:', error);
        // Token không hợp lệ, xóa dữ liệu
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        return null;
      }
    }

    // Fallback to userInfo if no token
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.role || null;
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        localStorage.removeItem('userInfo');
        return null;
      }
    }

    return null;
  },

  // Helper function to check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Kiểm tra token có hết hạn không
        if (decodedToken.exp <= currentTime) {
          // Token hết hạn, xóa dữ liệu
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error decoding token:', error);
        // Token không hợp lệ, xóa dữ liệu
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
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
        console.error('Error parsing user info:', error);
        localStorage.removeItem('userInfo');
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
        acc => acc.email !== email
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
        'rememberedAccounts',
        JSON.stringify(accountsToSave)
      );
    } catch (error) {
      console.error('Error saving remembered account:', error);
    }
  },

  getRememberedAccounts: () => {
    try {
      const accounts = localStorage.getItem('rememberedAccounts');
      return accounts ? JSON.parse(accounts) : [];
    } catch (error) {
      console.error('Error getting remembered accounts:', error);
      return [];
    }
  },

  removeRememberedAccount: email => {
    try {
      const rememberedAccounts = userService.getRememberedAccounts();
      const filteredAccounts = rememberedAccounts.filter(
        acc => acc.email !== email
      );
      localStorage.setItem(
        'rememberedAccounts',
        JSON.stringify(filteredAccounts)
      );
    } catch (error) {
      console.error('Error removing remembered account:', error);
    }
  },

  getLastRememberedAccount: () => {
    const accounts = userService.getRememberedAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  },

  clearAllRememberedAccounts: () => {
    localStorage.removeItem('rememberedAccounts');
  },

  // Send reset password email
  sendResetPasswordEmail: async email => {
    const response = await apiClient.post(API_ENDPOINTS.EMAIL.SEND, {
      to: email,
      subject: 'Đặt lại mật khẩu - Medlearn',
      body: 'demo',
    });
    return response; // apiClient already returns response.data
  },

  // Verify reset code (mock function - replace with real API when available)
  verifyResetCode: async (email, code) => {
    // Mock verification - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (code.length !== 6) {
      throw new Error('Mã xác nhận không hợp lệ');
    }

    return { success: true, message: 'Mã xác nhận hợp lệ' };
  },

  // Reset password (mock function - replace with real API when available)
  resetPassword: async (/* email, verificationCode, newPassword */) => {
    // Mock reset - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    return { success: true, message: 'Đặt lại mật khẩu thành công' };
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    // Note: We don't remove remembered accounts on logout
  },

  // Update user profile
  updateProfile: async userData => {
    try {
      const userRole = userService.getCurrentUserRole();

      if (userRole === 'Parent') {
        const response = await parentService.updateProfile(userData);

        // Update local storage with new data
        const currentUserInfo = JSON.parse(
          localStorage.getItem('userInfo') || '{}'
        );
        const updatedUserInfo = { ...currentUserInfo, ...userData };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

        return response;
      }

      throw new Error('Chức năng này chỉ dành cho phụ huynh');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  googleLogin: async credential => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER.GOOGLE_LOGIN, {
        credential: credential,
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
            email: decodedToken.Email || decodedToken.email,
            role: decodedToken.Role || decodedToken.role,
            fullname:
              decodedToken.Fullname ||
              decodedToken.fullname ||
              decodedToken.name,
            phone: decodedToken.Phone || decodedToken.phone,
            status: decodedToken.Status || decodedToken.status,
            isStaff: decodedToken.Role !== 'Parent',
            userData: decodedToken,
            decodedToken: decodedToken,
          };

          // For Parent role, set parentId to be the same as userId
          if (
            decodedToken.Role === 'Parent' ||
            decodedToken.role === 'Parent'
          ) {
            loginData.parentId = loginData.userId;
          }

          return loginData;
        } catch (error) {
          console.error('Error decoding Google JWT token:', error);
          // Return raw response if token decode fails
          return {
            success: true,
            ...data,
          };
        }
      }

      // If no token but response is successful
      return {
        success: true,
        ...data,
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Google login failed. Please try again.');
    }
  },
};

export default userService;
