import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Container, Link, Typography, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { LogoutOutlined } from '@mui/icons-material';
import MedlearnLogo from '../../assets/images/Medlearn-logo.png';
import userService from '../../services/userService';

export default function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    } else {
      // If not logged in, redirect to login page
      navigate('/');
    }
  };

  const handleAboutUsClick = (e) => {
    e.preventDefault();
    const aboutUsSection = document.getElementById('about-us');
    if (aboutUsSection) {
      aboutUsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
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
                  Medical Education
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
                Home
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
                Services
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
                About Us
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
    </Box>
  );
}
