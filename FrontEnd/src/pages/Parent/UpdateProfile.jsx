import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Alert,
  IconButton,
  Divider,
  Tooltip,
  Zoom,
  CircularProgress,
  Collapse,
  Card,
  CardContent,
} from '@mui/material';
import {
  AccountCircle,
  Phone,
  Email,
  Home,
  ArrowBack,
  Edit,
  Badge,
  Lock,
  Visibility,
  VisibilityOff,
  Security,
  ExpandMore,
  ExpandLess,
  Person,
  Save,
  Cancel,
} from '@mui/icons-material';
import userService from '../../services/userService';
import authService from '../../services/authService';

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Password reset states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPasswordVerified, setCurrentPasswordVerified] = useState(false);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedInfo);
        setFormData({
          fullname: parsedInfo.fullname || '',
          phone: parsedInfo.phone || '',
          email: parsedInfo.email || '',
          address: parsedInfo.address || '',
        });
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Gọi API cập nhật thông tin
      const _response = await userService.updateProfile(formData);

      // Cập nhật thông tin trong localStorage
      const updatedUserInfo = { ...userInfo, ...formData };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      setSuccess('Cập nhật thông tin thành công!');
      // Quay lại trang parent và hiển thị dialog
      navigate('/parent', {
        state: {
          fromUpdate: true,
          showProfileAfterUpdate: true,
          updatedUserInfo: updatedUserInfo,
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to get email from userInfo
  const getEmailFromToken = () => {
    try {
      console.log('🔍 Getting email from userInfo:', userInfo);

      // First try to get email from userInfo
      if (userInfo && userInfo.email) {
        console.log('✅ Found email in userInfo:', userInfo.email);
        return userInfo.email;
      }

      // Fallback: try to get from localStorage userInfo
      const storedUserInfo = localStorage.getItem('userInfo');
      console.log('🔍 Stored userInfo:', storedUserInfo);

      if (storedUserInfo) {
        const parsedInfo = JSON.parse(storedUserInfo);
        console.log('🔍 Parsed userInfo:', parsedInfo);

        if (parsedInfo.email) {
          console.log('✅ Found email in localStorage:', parsedInfo.email);
          return parsedInfo.email;
        }
      }

      // Last fallback: try to decode JWT token
      const token = localStorage.getItem('token');
      console.log('🔍 Token exists:', !!token);

      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 JWT payload:', payload);

        const email = payload.Email || payload.email;
        if (email) {
          console.log('✅ Found email in JWT:', email);
          return email;
        }
      }

      console.log('❌ No email found in any source');
      return null;
    } catch (error) {
      console.error('Error getting email:', error);
      return null;
    }
  };

  // Handle password change
  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = field => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle current password verification
  const handleCurrentPasswordVerification = async () => {
    setPasswordError('');
    setPasswordLoading(true);

    // Reset verification state
    setCurrentPasswordVerified(false);
    setPasswordSuccess('');

    try {
      // Validate current password
      if (!passwordData.currentPassword) {
        setPasswordError('Vui lòng nhập mật khẩu hiện tại');
        setPasswordLoading(false);
        return;
      }

      // Get email from userInfo
      const email = getEmailFromToken();
      if (!email) {
        setPasswordError('Không thể xác định email từ thông tin đăng nhập');
        setPasswordLoading(false);
        return;
      }

      console.log('🔍 Starting password verification for:', email);
      console.log(
        '🔍 Current password length:',
        passwordData.currentPassword.length
      );

      // Verify current password
      const result = await authService.verifyCurrentPassword(
        email,
        passwordData.currentPassword
      );

      console.log('✅ Password verification result:', result);

      if (result && result.success) {
        console.log('✅ Setting currentPasswordVerified to true');
        setCurrentPasswordVerified(true);
        setPasswordSuccess('Mật khẩu hiện tại đã được xác minh!');
      } else {
        console.log('❌ Password verification failed - no success flag');
        setPasswordError('Mật khẩu hiện tại không đúng');
        setCurrentPasswordVerified(false);
      }
    } catch (error) {
      console.error('❌ Password verification error in catch block:', error);

      // Ensure verification state is false
      setCurrentPasswordVerified(false);

      // Handle different types of errors
      if (error.message && error.message.includes('Mật khẩu sai')) {
        setPasswordError('Mật khẩu sai');
      } else if (error.response?.status === 401) {
        setPasswordError('Mật khẩu sai');
      } else if (error.response?.status === 400) {
        setPasswordError('Thông tin đăng nhập không hợp lệ');
      } else if (error.response?.status === 404) {
        setPasswordError('Không tìm thấy tài khoản');
      } else if (error.response?.status === 500) {
        setPasswordError('Lỗi server, vui lòng thử lại sau');
      } else {
        setPasswordError('Mật khẩu sai');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async e => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    try {
      // Validate passwords
      if (!passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('Vui lòng nhập đầy đủ thông tin mật khẩu');
        setPasswordLoading(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Mật khẩu xác nhận không khớp');
        setPasswordLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
        setPasswordLoading(false);
        return;
      }

      // Validate that new password is not the same as current password
      if (passwordData.newPassword === passwordData.currentPassword) {
        setPasswordError('Mật khẩu mới không được trùng với mật khẩu hiện tại');
        setPasswordLoading(false);
        return;
      }

      // Get email from userInfo
      const email = getEmailFromToken();
      if (!email) {
        setPasswordError('Không thể xác định email từ thông tin đăng nhập');
        setPasswordLoading(false);
        return;
      }

      // Call reset password API
      await authService.resetPassword(email, passwordData.newPassword);

      setPasswordSuccess('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setCurrentPasswordVerified(false);
      setShowPasswordSection(false);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle forgot password navigation
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f2f6f3 0%, #e8f5e8 100%)',
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Quay lại" TransitionComponent={Zoom}>
            <IconButton
              onClick={() => navigate('/parent')}
              sx={{
                bgcolor: 'white',
                color: '#97a19b',
                '&:hover': {
                  bgcolor: '#f8f9fa',
                  transform: 'scale(1.05)',
                },
                boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h4"
            sx={{
              color: '#2f5148',
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: 700,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #73ad67 0%, #2f5148 100%)',
                borderRadius: '2px',
              },
            }}
          >
            Cập Nhật Thông Tin
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Main Form Card */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(193, 203, 194, 0.2)',
                border: '1px solid rgba(193, 203, 194, 0.3)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Profile Header Section */}
                <Box
                  sx={{
                    background:
                      'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                    color: 'white',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '200px',
                      height: '200px',
                      background:
                        'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)',
                      borderRadius: '0 0 0 100%',
                    },
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Avatar
                          sx={{
                            width: 120,
                            height: 120,
                            mx: { xs: 'auto', md: 0 },
                            mb: 2,
                            bgcolor: 'white',
                            color: '#2f5148',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            border: '4px solid rgba(255,255,255,0.9)',
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          {userInfo?.fullname?.charAt(0).toUpperCase() || 'P'}
                        </Avatar>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontFamily: 'Satoshi, sans-serif',
                            fontWeight: 700,
                            mb: 1,
                            textAlign: { xs: 'center', md: 'left' },
                          }}
                        >
                          {userInfo?.fullname || 'Phụ Huynh'}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            gap: 3,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Email
                              sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '1.2rem',
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontFamily: 'Satoshi, sans-serif',
                                fontWeight: 500,
                              }}
                            >
                              {userInfo?.email || 'email@example.com'}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Person
                              sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '1.2rem',
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontFamily: 'Satoshi, sans-serif',
                                fontWeight: 500,
                              }}
                            >
                              Vai trò: Phụ huynh
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Badge
                              sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '1.2rem',
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontFamily: 'Satoshi, sans-serif',
                                fontWeight: 500,
                              }}
                            >
                              Trạng thái: Hoạt động
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Form Section */}
                <Box sx={{ p: 4 }}>
                  {/* Alert Messages */}
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                          color: '#97a19b',
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                          color: '#97a19b',
                        },
                      }}
                    >
                      {success}
                    </Alert>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontWeight: 600,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <AccountCircle
                        sx={{ color: '#97a19b', fontSize: '1.5rem' }}
                      />
                      Thông tin cá nhân
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Full Name */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Họ và tên"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              '& fieldset': {
                                borderColor: 'rgba(193, 203, 194, 0.5)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#73ad67',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2f5148',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#97a19b',
                              fontFamily: 'Satoshi, sans-serif',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: '#2f5148',
                              fontFamily: 'Satoshi, sans-serif',
                              fontWeight: 500,
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <AccountCircle
                                sx={{
                                  color: '#97a19b',
                                  mr: 1,
                                  fontSize: '1.2rem',
                                }}
                              />
                            ),
                          }}
                        />
                      </Grid>

                      {/* Phone */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              '& fieldset': {
                                borderColor: 'rgba(193, 203, 194, 0.5)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#73ad67',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2f5148',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#97a19b',
                              fontFamily: 'Satoshi, sans-serif',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: '#2f5148',
                              fontFamily: 'Satoshi, sans-serif',
                              fontWeight: 500,
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <Phone
                                sx={{
                                  color: '#97a19b',
                                  mr: 1,
                                  fontSize: '1.2rem',
                                }}
                              />
                            ),
                          }}
                        />
                      </Grid>

                      {/* Email */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email"
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              '& fieldset': {
                                borderColor: 'rgba(193, 203, 194, 0.5)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#73ad67',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2f5148',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#97a19b',
                              fontFamily: 'Satoshi, sans-serif',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: '#2f5148',
                              fontFamily: 'Satoshi, sans-serif',
                              fontWeight: 500,
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <Email
                                sx={{
                                  color: '#97a19b',
                                  mr: 1,
                                  fontSize: '1.2rem',
                                }}
                              />
                            ),
                          }}
                        />
                      </Grid>

                      {/* Address */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Địa chỉ"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              '& fieldset': {
                                borderColor: 'rgba(193, 203, 194, 0.5)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#73ad67',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2f5148',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#97a19b',
                              fontFamily: 'Satoshi, sans-serif',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: '#2f5148',
                              fontFamily: 'Satoshi, sans-serif',
                              fontWeight: 500,
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <Home
                                sx={{
                                  color: '#97a19b',
                                  mr: 1,
                                  fontSize: '1.2rem',
                                  alignSelf: 'flex-start',
                                  mt: 1,
                                }}
                              />
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        mt: 4,
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/parent')}
                        disabled={loading}
                        sx={{
                          borderColor: '#73ad67',
                          color: '#2f5148',
                          px: 4,
                          py: 1.5,
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontFamily: 'Satoshi, sans-serif',
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#2f5148',
                            backgroundColor: 'rgba(115, 173, 103, 0.1)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        startIcon={<Cancel sx={{ color: '#97a19b' }} />}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          background:
                            'linear-gradient(135deg, #73ad67 0%, #2f5148 100%)',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontFamily: 'Satoshi, sans-serif',
                          textTransform: 'none',
                          boxShadow: '0 4px 15px rgba(115, 173, 103, 0.3)',
                          '&:hover': {
                            background:
                              'linear-gradient(135deg, #5a8a52 0%, #1e3a32 100%)',
                            boxShadow: '0 6px 20px rgba(115, 173, 103, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Save sx={{ color: 'white' }} />
                          )
                        }
                      >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card
              elevation={0}
              sx={{
                mt: 4,
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(193, 203, 194, 0.2)',
                border: '1px solid rgba(193, 203, 194, 0.3)',
                overflow: 'hidden',
              }}
            >
              {/* Password Section Header */}
              <Box
                sx={{
                  p: 3,
                  background:
                    'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #1e3a32 0%, #5a8a52 100%)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Security sx={{ fontSize: '1.5rem' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'Satoshi, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    Đổi mật khẩu
                  </Typography>
                </Box>
                {showPasswordSection ? (
                  <ExpandLess sx={{ fontSize: '1.5rem' }} />
                ) : (
                  <ExpandMore sx={{ fontSize: '1.5rem' }} />
                )}
              </Box>

              {/* Password Section Content */}
              <Collapse in={showPasswordSection}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#97a19b',
                      mb: 3,
                      fontFamily: 'Satoshi, sans-serif',
                      fontStyle: 'italic',
                    }}
                  >
                    Để đảm bảo an toàn, hãy xác minh mật khẩu hiện tại trước khi
                    đổi mật khẩu mới
                  </Typography>

                  {passwordError && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                          color: '#97a19b',
                        },
                      }}
                    >
                      {passwordError}
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                          color: '#97a19b',
                        },
                      }}
                    >
                      {passwordSuccess}
                    </Alert>
                  )}

                  <form onSubmit={handlePasswordReset}>
                    <Grid container spacing={3}>
                      {/* Current Password Field */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Mật khẩu hiện tại"
                          name="currentPassword"
                          type={
                            showPassword.currentPassword ? 'text' : 'password'
                          }
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          disabled={currentPasswordVerified}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: currentPasswordVerified
                                ? 'rgba(76, 175, 80, 0.1)'
                                : '#f8f9fa',
                              '& fieldset': {
                                borderColor: currentPasswordVerified
                                  ? '#4caf50'
                                  : 'rgba(193, 203, 194, 0.5)',
                              },
                              '&:hover fieldset': {
                                borderColor: currentPasswordVerified
                                  ? '#4caf50'
                                  : '#73ad67',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: currentPasswordVerified
                                  ? '#4caf50'
                                  : '#2f5148',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: currentPasswordVerified
                                ? '#4caf50'
                                : '#97a19b',
                              fontFamily: 'Satoshi, sans-serif',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: currentPasswordVerified
                                ? '#4caf50'
                                : '#2f5148',
                              fontFamily: 'Satoshi, sans-serif',
                              fontWeight: 500,
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <Lock
                                sx={{
                                  color: currentPasswordVerified
                                    ? '#4caf50'
                                    : '#97a19b',
                                  mr: 1,
                                  fontSize: '1.2rem',
                                }}
                              />
                            ),
                            endAdornment: (
                              <IconButton
                                onClick={() =>
                                  togglePasswordVisibility('currentPassword')
                                }
                                sx={{ color: '#97a19b' }}
                              >
                                {showPassword.currentPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            ),
                          }}
                        />

                        {/* Verify Current Password and Forgot Password Buttons */}
                        {!currentPasswordVerified && (
                          <Box
                            sx={{
                              mt: 2,
                              display: 'flex',
                              gap: 2,
                              alignItems: 'center',
                            }}
                          >
                            <Button
                              type="button"
                              variant="outlined"
                              onClick={handleCurrentPasswordVerification}
                              disabled={
                                passwordLoading || !passwordData.currentPassword
                              }
                              sx={{
                                borderColor: '#2f5148',
                                color: '#2f5148',
                                borderRadius: '12px',
                                fontFamily: 'Satoshi, sans-serif',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                  borderColor: '#1e3a32',
                                  backgroundColor: 'rgba(47, 81, 72, 0.1)',
                                },
                              }}
                              startIcon={
                                passwordLoading ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <Security sx={{ color: '#97a19b' }} />
                                )
                              }
                            >
                              {passwordLoading
                                ? 'Đang xác minh...'
                                : 'Xác minh'}
                            </Button>

                            <Typography
                              variant="body2"
                              sx={{
                                color: '#97a19b',
                                fontFamily: 'Satoshi, sans-serif',
                              }}
                            >
                              hoặc
                            </Typography>

                            <Button
                              type="button"
                              variant="text"
                              onClick={handleForgotPassword}
                              sx={{
                                color: '#2f5148',
                                fontFamily: 'Satoshi, sans-serif',
                                fontWeight: 600,
                                textTransform: 'none',
                                textDecoration: 'underline',
                                '&:hover': {
                                  backgroundColor: 'rgba(47, 81, 72, 0.1)',
                                },
                              }}
                            >
                              Quên mật khẩu?
                            </Button>
                          </Box>
                        )}
                      </Grid>

                      {/* New Password Field - Only show if current password is verified */}
                      {currentPasswordVerified && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Mật khẩu mới"
                            name="newPassword"
                            type={
                              showPassword.newPassword ? 'text' : 'password'
                            }
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#f8f9fa',
                                '& fieldset': {
                                  borderColor: 'rgba(193, 203, 194, 0.5)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#73ad67',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2f5148',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#97a19b',
                                fontFamily: 'Satoshi, sans-serif',
                              },
                              '& .MuiOutlinedInput-input': {
                                color: '#2f5148',
                                fontFamily: 'Satoshi, sans-serif',
                                fontWeight: 500,
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <Lock
                                  sx={{
                                    color: '#97a19b',
                                    mr: 1,
                                    fontSize: '1.2rem',
                                  }}
                                />
                              ),
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    togglePasswordVisibility('newPassword')
                                  }
                                  sx={{ color: '#97a19b' }}
                                >
                                  {showPassword.newPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                      )}

                      {/* Confirm Password Field - Only show if current password is verified */}
                      {currentPasswordVerified && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            type={
                              showPassword.confirmPassword ? 'text' : 'password'
                            }
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#f8f9fa',
                                '& fieldset': {
                                  borderColor: 'rgba(193, 203, 194, 0.5)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#73ad67',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2f5148',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#97a19b',
                                fontFamily: 'Satoshi, sans-serif',
                              },
                              '& .MuiOutlinedInput-input': {
                                color: '#2f5148',
                                fontFamily: 'Satoshi, sans-serif',
                                fontWeight: 500,
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <Lock
                                  sx={{
                                    color: '#97a19b',
                                    mr: 1,
                                    fontSize: '1.2rem',
                                  }}
                                />
                              ),
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    togglePasswordVisibility('confirmPassword')
                                  }
                                  sx={{ color: '#97a19b' }}
                                >
                                  {showPassword.confirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>

                    {/* Action Buttons - Only show if current password is verified */}
                    {currentPasswordVerified && (
                      <Box
                        sx={{
                          mt: 4,
                          display: 'flex',
                          gap: 2,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={() => {
                            setShowPasswordSection(false);
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: '',
                            });
                            setPasswordError('');
                            setPasswordSuccess('');
                            setCurrentPasswordVerified(false);
                          }}
                          disabled={passwordLoading}
                          sx={{
                            borderColor: '#73ad67',
                            color: '#2f5148',
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontFamily: 'Satoshi, sans-serif',
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#2f5148',
                              backgroundColor: 'rgba(115, 173, 103, 0.1)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                          startIcon={<Cancel sx={{ color: '#97a19b' }} />}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={passwordLoading}
                          sx={{
                            background:
                              'linear-gradient(135deg, #73ad67 0%, #2f5148 100%)',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontFamily: 'Satoshi, sans-serif',
                            textTransform: 'none',
                            boxShadow: '0 4px 15px rgba(115, 173, 103, 0.3)',
                            '&:hover': {
                              background:
                                'linear-gradient(135deg, #5a8a52 0%, #1e3a32 100%)',
                              boxShadow: '0 6px 20px rgba(115, 173, 103, 0.4)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                          startIcon={
                            passwordLoading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <Lock sx={{ color: 'white' }} />
                            )
                          }
                        >
                          {passwordLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                        </Button>
                      </Box>
                    )}
                  </form>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
