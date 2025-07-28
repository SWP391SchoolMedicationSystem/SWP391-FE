import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Container, Link, Typography, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';
import { LogoutOutlined } from '@mui/icons-material';
import MedlearnLogo from '../../assets/images/Medlearn-logo.png';
import userService from '../../services/userService';

export default function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userInfoString = localStorage.getItem('userInfo');
    
    if (token && userInfoString) {
      try {
        const parsedUserInfo = JSON.parse(userInfoString);
        setUserInfo(parsedUserInfo);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user info:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    userService.logout();
    setIsLoggedIn(false);
    setUserInfo(null);
    navigate('/');
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    if (isLoggedIn && userInfo?.role === 'Parent') {
      navigate('/parent');
    } else if (!isLoggedIn) {
      // Show dialog for non-logged in users
      setLoginDialogOpen(true);
    } else {
      // If logged in but not parent, redirect to login page
      navigate('/');
    }
  };

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  const handleLoginNow = () => {
    setLoginDialogOpen(false);
    navigate('/');
  };

  const handleAboutUsClick = (e) => {
    e.preventDefault();
    // Navigate to Home page first
    navigate('/Home');
    
    // Wait for navigation to complete, then scroll to about section
    setTimeout(() => {
      const aboutUsSection = document.getElementById('about-us');
      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // If element not found, try again after a longer delay
        setTimeout(() => {
          const aboutUsSection = document.getElementById('about-us');
          if (aboutUsSection) {
            aboutUsSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 500);
      }
    }, 300);
  };

  const getUserDisplayName = () => {
    if (!userInfo) return '';
    return userInfo.userName || userInfo.fullname || userInfo.email?.split('@')[0] || 'User';
  };

  const getUserAvatar = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <Box component="header" sx={{ py: 2, fontFamily: 'Poppins, sans-serif' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            component={RouterLink}
            to="#"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box sx={{ width: '50px', height: '50px' }}>
                <img
                  src={MedlearnLogo}
                  alt="Medlearn Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#73ad67',
                    lineHeight: 1,
                  }}
                >
                  MEDLEARN
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#666',
                    lineHeight: 1,
                  }}
                >
                  Giáo dục Y tế
                </Typography>
              </Box>
            </Box>
          </Link>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              component="nav"
              sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}
            >
              <Link
                component={RouterLink}
                to="/Home"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { color: 'info.main' } }}
              >
                Trang chủ
              </Link>
              <Link
                onClick={handleServicesClick}
                color="text.secondary"
                sx={{ 
                  textDecoration: 'none', 
                  cursor: 'pointer',
                  '&:hover': { color: 'info.main' } 
                }}
              >
                Dịch vụ
              </Link>
              <Link
                onClick={handleAboutUsClick}
                color="text.secondary"
                sx={{ 
                  textDecoration: 'none', 
                  cursor: 'pointer',
                  '&:hover': { color: 'info.main' } 
                }}
              >
                Về chúng tôi
              </Link>
            </Box>
            
            {isLoggedIn && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 35,
                    height: 35,
                    background: 'linear-gradient(135deg, #73ad67 0%, #2f5148 100%)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  {getUserAvatar()}
                </Avatar>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#2f5148',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {getUserDisplayName()}
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  size="small"
                  startIcon={<LogoutOutlined />}
                  sx={{
                    color: '#2f5148',
                    borderColor: '#2f5148',
                    '&:hover': {
                      backgroundColor: '#2f5148',
                      color: 'white',
                      borderColor: '#2f5148',
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Đăng xuất
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Login Required Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={handleCloseLoginDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            color: '#2f5148',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            pb: 1,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderBottom: '1px solid #e9ecef'
          }}
        >
          🔐 Yêu cầu đăng nhập
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem',
                mb: 2
              }}
            >
              Để truy cập các dịch vụ của MedLearn, bạn cần đăng nhập vào tài khoản của mình.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#97a19b',
                fontSize: '0.95rem'
              }}
            >
              Đăng nhập để trải nghiệm đầy đủ các tính năng chăm sóc sức khỏe học đường.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 1,
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Button
            onClick={handleCloseLoginDialog}
            variant="outlined"
            sx={{
              color: '#97a19b',
              borderColor: '#c1cbc2',
              '&:hover': {
                borderColor: '#97a19b',
                backgroundColor: 'rgba(151, 161, 155, 0.04)'
              },
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Để sau
          </Button>
          <Button
            onClick={handleLoginNow}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e342a 0%, #5c8a53 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(47, 81, 72, 0.3)',
              },
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Đăng nhập ngay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
