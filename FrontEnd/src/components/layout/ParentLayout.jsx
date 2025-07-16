import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Home,
  Article,
  MedicalServices,
  Notifications,
  Chat,
  FolderShared,
  PersonalVideo,
  Menu,
  Logout,
  ChatBubbleOutline,
  Search,
  Vaccines,
  LocalPharmacy,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import userService from '../../services/userService';
import MedlearnLogo from '../../assets/images/Medlearn-logo.png';

const drawerWidth = 280;

const navItems = [
  { to: '/parent', label: 'Trang Chủ', icon: <Home />, key: 'home' },
  {
    to: '/parent/view-blog',
    label: 'Xem Blog',
    icon: <Article />,
    key: 'blog',
  },
  {
    to: '/parent/vaccination-events',
    label: 'Thông Tin Tiêm Chủng',
    icon: <Vaccines />,
    key: 'vaccination',
  },
  // {
  //   to: '/parent/health-history',
  //   label: 'Lịch Sử Khám Sức Khỏe',
  //   icon: <MedicalServices />,
  //   key: 'health-history',
  // },
  {
    to: '/parent/notifications',
    label: 'Thông Báo',
    icon: <Notifications />,
    key: 'notifications',
  },
  // {
  //   to: '/parent/consultation',
  //   label: 'Tư Vấn Y Tế',
  //   icon: <PersonalVideo />,
  //   key: 'consultation',
  // },
  // {
  //   to: '/parent/chat-nurse',
  //   label: 'Chat Với Y Tá',
  //   icon: <Chat />,
  //   key: 'chat',
  // },
  {
    to: '/parent/health-records',
    label: 'Hồ Sơ Sức Khỏe',
    icon: <FolderShared />,
    key: 'records',
  },

];

export default function ParentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const response = await userService.getUserInfo();
      if (response.data) {
        const updatedInfo = response.data;
        setUserInfo(updatedInfo);
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

    // Lấy theme preference từ localStorage
    const storedTheme = localStorage.getItem('parentTheme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  // Handle profile updates
  useEffect(() => {
    const state = location.state;
    if (state?.fromUpdate) {
      if (state.updatedUserInfo) {
        setUserInfo(state.updatedUserInfo);
      }
      if (state.showProfileAfterUpdate) {
        setShowProfile(true);
      }
      // Clear the state after using it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const handleLogout = () => {
    userService.logout();
    navigate('/');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('parentTheme', newMode ? 'dark' : 'light');
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (!userInfo) return 'Parent Care';
    return (
      userInfo.userName ||
      userInfo.fullname ||
      userInfo.email?.split('@')[0] ||
      'Phụ Huynh'
    );
  };

  const getUserEmail = () => {
    if (!userInfo) return 'parent@medlearn.com';
    return userInfo.email || 'parent@medlearn.com';
  };

  const getUserAvatar = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const handleUpdateProfile = useCallback(() => {
    setShowProfile(false);
    navigate('/parent/update-profile');
  }, [navigate]);

  // Theme colors
  const theme = {
    light: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(240, 253, 244, 0.1) 100%), linear-gradient(45deg, #f0fdf4 0%, #ecfdf5 25%, #f8fafc 50%, #f0fdf4 75%, #f8fafc 100%)',
      sidebarBg:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(240, 253, 244, 0.15) 100%)',
      headerBg:
        'linear-gradient(135deg, rgba(240, 253, 244, 0.3) 0%, rgba(240, 253, 244, 0.2) 100%)',
      cardBg:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(240, 253, 244, 0.3) 100%)',
      cardBgHover:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(240, 253, 244, 0.2) 100%)',
      cardBgInactive:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(240, 253, 244, 0.1) 100%)',
      logoGradient:
        'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #10b981 100%)',
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      textGradient:
        'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      activeText: '#15803d',
      border: 'rgba(255, 255, 255, 0.3)',
      iconButton:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(240, 253, 244, 0.1) 100%)',
      iconButtonHover:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(240, 253, 244, 0.2) 100%)',
    },
    dark: {
      background:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.95) 0%, rgba(29, 29, 29, 0.9) 50%, rgba(29, 29, 29, 0.85) 100%), linear-gradient(45deg, #1d1d1d 0%, #242424 25%, #2a2a2a 50%, #313131 75%, #2a2a2a 100%)',
      sidebarBg:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.9) 0%, rgba(29, 29, 29, 0.7) 100%)',
      headerBg:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.9) 0%, rgba(29, 29, 29, 0.7) 100%)',
      cardBg:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.8) 0%, rgba(36, 36, 36, 0.6) 100%)',
      cardBgHover:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.9) 0%, rgba(36, 36, 36, 0.7) 100%)',
      cardBgInactive:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.5) 0%, rgba(36, 36, 36, 0.3) 100%)',
      logoGradient:
        'linear-gradient(135deg, #22c55e 0%, #10b981 50%, #059669 100%)',
      textPrimary: '#eaebed',
      textSecondary: '#eaebed',
      textGradient:
        'linear-gradient(135deg, #eaebed 0%, #eaebed 50%, #eaebed 100%)',
      activeText: '#15803d',
      border: 'rgba(234, 235, 237, 0.2)',
      iconButton:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.7) 0%, rgba(36, 36, 36, 0.5) 100%)',
      iconButtonHover:
        'linear-gradient(135deg, rgba(29, 29, 29, 0.9) 0%, rgba(36, 36, 36, 0.7) 100%)',
    },
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        background: currentTheme.background,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: 'all 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: drawerWidth,
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1200,
          background: currentTheme.sidebarBg,
          backdropFilter: 'blur(30px)',
          borderRight: `1px solid ${currentTheme.border}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: currentTheme.cardBgInactive,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(15px)',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={MedlearnLogo}
              alt="Logo"
              style={{
                width: '24px',
                height: '24px',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Typography
            sx={{
              background: currentTheme.logoGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            MedLearn
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, px: 2 }}>
          {navItems.map(({ to, label, icon, key }) => (
            <NavLink
              to={to}
              key={key}
              end={to === '/parent'}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: '12px 16px',
                    mb: 1,
                    borderRadius: '15px',
                    color: isActive
                      ? currentTheme.activeText
                      : currentTheme.textSecondary,
                    background: isActive ? currentTheme.cardBg : 'transparent',
                    backdropFilter: isActive ? 'blur(15px)' : 'none',
                    border: isActive
                      ? `1px solid ${currentTheme.border}`
                      : '1px solid transparent',
                    boxShadow: isActive
                      ? '0 4px 15px rgba(0, 0, 0, 0.1)'
                      : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: currentTheme.cardBgHover,
                      backdropFilter: 'blur(15px)',
                      border: `1px solid ${currentTheme.border}`,
                      color: '#15803d',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      '& svg': {
                        fontSize: '20px',
                        color: 'inherit',
                      },
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: isActive ? 600 : 400,
                      color: 'inherit',
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              )}
            </NavLink>
          ))}
        </Box>

        {/* Bottom section */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: '12px 16px',
              borderRadius: '15px',
              background: currentTheme.cardBgInactive,
              backdropFilter: 'blur(15px)',
              border: `1px solid ${currentTheme.border}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: currentTheme.cardBgHover,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                '& svg': {
                  fontSize: '20px',
                  color: currentTheme.textSecondary,
                },
              }}
            >
              <FolderShared />
            </Box>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: currentTheme.textSecondary,
              }}
            >
              Transfers
            </Typography>
          </Box>

          <Box
            onClick={() => setShowProfile(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: '12px 16px',
              mt: 1,
              borderRadius: '15px',
              background: currentTheme.cardBgInactive,
              backdropFilter: 'blur(15px)',
              border: `1px solid ${currentTheme.border}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: currentTheme.cardBgHover,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: '12px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              }}
            >
              {getUserAvatar()}
            </Avatar>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: currentTheme.textSecondary,
              }}
            >
              Profile
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: `${drawerWidth}px`,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        {/* Top Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            background: currentTheme.headerBg,
            backdropFilter: 'blur(30px)',
            borderBottom: `1px solid ${currentTheme.border}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <Box>
            <Typography
              sx={{
                background: currentTheme.textGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '26px',
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Welcome back, {getUserDisplayName()}! 👨‍👩‍👧‍👦
            </Typography>
            <Typography
              sx={{
                color: currentTheme.textSecondary,
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Parent Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Search Bar */}
            <Box
              sx={{
                position: 'relative',
                width: 300,
                background: currentTheme.iconButton,
                backdropFilter: 'blur(15px)',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '12px',
                '&:hover': {
                  background: currentTheme.iconButtonHover,
                },
              }}
            >
              <InputBase
                placeholder="Tìm kiếm con em, thông tin, etc."
                sx={{
                  pl: 2,
                  pr: 2,
                  py: 0.5,
                  width: '100%',
                  color: currentTheme.textSecondary,
                  '& ::placeholder': {
                    color: currentTheme.textSecondary,
                    opacity: 0.7,
                  },
                }}
              />
            </Box>

            <IconButton
              onClick={() => navigate('/parent/notifications')}
              sx={{
                width: 40,
                height: 40,
                background: currentTheme.iconButton,
                backdropFilter: 'blur(15px)',
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.textSecondary,
                borderRadius: '12px',
                '&:hover': {
                  background: currentTheme.iconButtonHover,
                  color: currentTheme.textPrimary,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Notifications />
            </IconButton>

            <IconButton
              sx={{
                width: 40,
                height: 40,
                background: currentTheme.iconButton,
                backdropFilter: 'blur(15px)',
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.textSecondary,
                borderRadius: '12px',
                '&:hover': {
                  background: currentTheme.iconButtonHover,
                  color: currentTheme.textPrimary,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <ChatBubbleOutline />
            </IconButton>

            {/* Dark Mode Toggle */}
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                width: 40,
                height: 40,
                background: currentTheme.iconButton,
                backdropFilter: 'blur(15px)',
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.textSecondary,
                borderRadius: '12px',
                '&:hover': {
                  background: currentTheme.iconButtonHover,
                  color: isDarkMode ? '#fbbf24' : '#22c55e',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background:
                    'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  border: `2px solid ${currentTheme.border}`,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                  cursor: 'pointer',
                }}
                onClick={() => setShowProfile(true)}
              >
                {getUserAvatar()}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    color: currentTheme.textPrimary,
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  {getUserDisplayName()}
                </Typography>
                <Typography
                  sx={{
                    color: currentTheme.textSecondary,
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Parent
                </Typography>
              </Box>
              <IconButton
                onClick={handleLogout}
                sx={{
                  width: 36,
                  height: 36,
                  background: currentTheme.iconButton,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '10px',
                  color: currentTheme.textSecondary,
                  '&:hover': {
                    color: '#ef4444',
                    background: currentTheme.iconButtonHover,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Logout />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
          }}
        >
          <Outlet
            context={{ theme: currentTheme, isDarkMode, toggleDarkMode }}
          />
        </Box>
      </Box>

      {/* User Profile Dialog */}
      <Dialog
        open={showProfile}
        onClose={() => setShowProfile(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: '100%',
            maxWidth: 450,
            background: currentTheme.cardBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${currentTheme.border}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            pb: 1,
            background: currentTheme.logoGradient,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.3rem',
          }}
        >
          👨‍👩‍👧‍👦 Thông Tin Phụ Huynh
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {userInfo ? (
            <Box sx={{ p: 3 }}>
              {/* Avatar Section */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    background: currentTheme.logoGradient,
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
                    color: 'white',
                  }}
                >
                  {getUserAvatar()}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    color: currentTheme.textPrimary,
                  }}
                >
                  {getUserDisplayName()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: currentTheme.textSecondary,
                    fontStyle: 'italic',
                  }}
                >
                  Phụ huynh học sinh
                </Typography>
              </Box>

              {/* Info Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    background: currentTheme.iconButton,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: `1px solid ${currentTheme.border}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: currentTheme.cardBgInactive,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    🆔
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: currentTheme.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      User ID
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: currentTheme.textPrimary,
                        fontWeight: 600,
                      }}
                    >
                      {userInfo.userId || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    background: currentTheme.iconButton,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: `1px solid ${currentTheme.border}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: currentTheme.cardBgInactive,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    📧
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: currentTheme.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Email
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: currentTheme.textPrimary,
                        fontWeight: 600,
                      }}
                    >
                      {getUserEmail()}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    background: currentTheme.iconButton,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: `1px solid ${currentTheme.border}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: currentTheme.cardBgInactive,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    👤
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: currentTheme.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Username
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: currentTheme.textPrimary,
                        fontWeight: 600,
                      }}
                    >
                      {userInfo.userName || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: currentTheme.textSecondary }}>
                Không có thông tin người dùng
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleUpdateProfile}
            sx={{
              background: currentTheme.iconButton,
              color: currentTheme.textPrimary,
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              border: `1px solid ${currentTheme.border}`,
              '&:hover': {
                background: currentTheme.iconButtonHover,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Cập Nhật
          </Button>
          <Button
            onClick={() => setShowProfile(false)}
            sx={{
              background: currentTheme.logoGradient,
              color: 'white',
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              '&:hover': {
                background: currentTheme.logoGradient,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
