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
} from '@mui/material';
import {
  AccountCircle,
  Phone,
  Email,
  Home,
  ArrowBack,
  Edit,
  Badge,
} from '@mui/icons-material';
import userService from '../../services/userService';

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
  const [isEditing, setIsEditing] = useState({
    fullname: false,
    phone: false,
    email: false,
    address: false,
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Gọi API cập nhật thông tin
      const response = await userService.updateProfile(formData);
      
      // Cập nhật thông tin trong localStorage
      const updatedUserInfo = { ...userInfo, ...formData };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      setSuccess('Cập nhật thông tin thành công!');
      // Quay lại trang parent và hiển thị dialog
      navigate('/parent', { 
        state: { 
          fromUpdate: true,
          showProfileAfterUpdate: true,
          updatedUserInfo: updatedUserInfo
        } 
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: 3,
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          position: 'relative',
        }}
      >
        <Tooltip title="Quay lại" TransitionComponent={Zoom}>
          <IconButton 
            onClick={() => navigate('/parent')}
            sx={{ 
              bgcolor: 'white', 
              '&:hover': { 
                bgcolor: '#f5f5f5',
                transform: 'scale(1.1)',
              },
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          color="#2f5148"
          sx={{
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, #73ad67 0%, #2f5148 100%)',
              borderRadius: '2px',
            }
          }}
        >
          Cập Nhật Thông Tin
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Avatar and Info */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #73ad67 0%, #2f5148 100%)',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
              },
            }}
          >
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Avatar
                sx={{
                  width: 130,
                  height: 130,
                  margin: '0 auto',
                  bgcolor: 'white',
                  color: '#2f5148',
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  border: '4px solid rgba(255,255,255,0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                  },
                }}
              >
                {userInfo?.fullname?.charAt(0).toUpperCase() || 'P'}
              </Avatar>
              <Badge 
                sx={{ 
                  position: 'absolute',
                  bottom: 10,
                  right: '50%',
                  transform: 'translateX(40px)',
                  color: 'white',
                  fontSize: '2rem',
                }}
              />
            </Box>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              sx={{ 
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {userInfo?.fullname || 'Phụ Huynh'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.9, 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Email fontSize="small" />
              {userInfo?.email || 'email@example.com'}
            </Typography>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 3 }} />
            <Box sx={{ px: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.9,
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                }}
              >
                "Cập nhật thông tin cá nhân của bạn để chúng tôi có thể liên hệ khi cần thiết và đảm bảo thông tin luôn chính xác."
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Form */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 4,
              bgcolor: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle at top right, rgba(86, 208, 219, 0.1), transparent 70%)',
                borderRadius: '0 0 0 100%',
              },
            }}
          >
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    '0%': { opacity: 0, transform: 'translateX(-20px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
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
                  animation: 'slideIn 0.3s ease-out',
                }}
              >
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <AccountCircle sx={{ color: '#2f5148', mr: 2, mb: 0.5 }} />
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                          '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderColor: '#2f5148' },
                        }}
                      />
                      <Tooltip title="Chỉnh sửa" TransitionComponent={Zoom}>
                        <IconButton 
                          onClick={() => toggleEdit('fullname')}
                          sx={{ 
                            ml: 1,
                            color: isEditing.fullname ? '#2f5148' : 'text.secondary',
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Phone sx={{ color: '#2f5148', mr: 2, mb: 0.5 }} />
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                          '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderColor: '#2f5148' },
                        }}
                      />
                      <Tooltip title="Chỉnh sửa" TransitionComponent={Zoom}>
                        <IconButton 
                          onClick={() => toggleEdit('phone')}
                          sx={{ 
                            ml: 1,
                            color: isEditing.phone ? '#2f5148' : 'text.secondary',
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Email sx={{ color: '#2f5148', mr: 2, mb: 0.5 }} />
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        required
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                          '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderColor: '#2f5148' },
                        }}
                      />
                      <Tooltip title="Chỉnh sửa" TransitionComponent={Zoom}>
                        <IconButton 
                          onClick={() => toggleEdit('email')}
                          sx={{ 
                            ml: 1,
                            color: isEditing.email ? '#2f5148' : 'text.secondary',
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Home sx={{ color: '#2f5148', mr: 2, mb: 0.5 }} />
                      <TextField
                        fullWidth
                        label="Địa chỉ"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                          '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderColor: '#2f5148' },
                        }}
                      />
                      <Tooltip title="Chỉnh sửa" TransitionComponent={Zoom}>
                        <IconButton 
                          onClick={() => toggleEdit('address')}
                          sx={{ 
                            ml: 1,
                            color: isEditing.address ? '#2f5148' : 'text.secondary',
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box 
                sx={{ 
                  mt: 5, 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  position: 'relative',
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
                    borderRadius: 2,
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: '#2f5148',
                      background: 'rgba(86, 208, 219, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #73ad67 0%, #2f5148 100%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4BC5CE 0%, #1E5F9F 100%)',
                      boxShadow: '0 4px 15px rgba(45, 119, 193, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Lưu Thay Đổi'
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 