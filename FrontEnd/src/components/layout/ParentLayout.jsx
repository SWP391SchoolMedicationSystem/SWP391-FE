import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
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
} from "@mui/icons-material";
import userService from "../../services/userService";
import MedlearnLogo from "../../assets/images/Medlearn-logo.png";

const drawerWidth = 240;

const navItems = [
  { to: "/parent", label: "Trang Chủ", icon: <Home /> },
  { to: "/parent/view-blog", label: "Xem Blog", icon: <Article /> },
  {
    to: "/parent/vaccination-events",
    label: "Thông Tin Tiêm Chủng",
    icon: <Vaccines />,
  },
  {
    to: "/parent/health-history",
    label: "Lịch Sử Khám Sức Khỏe",
    icon: <MedicalServices />,
  },
  { to: "/parent/notifications", label: "Thông Báo", icon: <Notifications /> },
  { to: "/parent/consultation", label: "Tư Vấn Y Tế", icon: <PersonalVideo /> },
  { to: "/parent/chat-nurse", label: "Chat Với Y Tá", icon: <Chat /> },
  {
    to: "/parent/health-records",
    label: "Hồ Sơ Sức Khỏe",
    icon: <FolderShared />,
  },
];

export default function ParentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const response = await userService.getUserInfo();
      if (response.data) {
        const updatedInfo = response.data;
        setUserInfo(updatedInfo);
        localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
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
    navigate("/");
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (!userInfo) return "Phụ Huynh";
    return (
      userInfo.userName ||
      userInfo.fullname ||
      userInfo.email?.split("@")[0] ||
      "Phụ Huynh"
    );
  };

  const getUserEmail = () => {
    if (!userInfo) return "parent@example.com";
    return userInfo.email || "parent@example.com";
  };

  const getUserAvatar = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const handleUpdateProfile = useCallback(() => {
    setShowProfile(false);
    navigate("/parent/update-profile");
  }, [navigate]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Toolbar sx={{ fontWeight: "bold", fontSize: 20, color: "#2D77C1" }}>
          Parent Portal 👨‍👩‍👧‍👦
        </Toolbar>
        <List>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              to={to}
              key={to}
              end={to === "/parent"} // chỉ dùng end cho trang chủ
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      color: isActive ? "white" : "#333",
                      background: isActive
                        ? "linear-gradient(to right, #56D0DB, #2D77C1)"
                        : "transparent",
                      "&:hover": {
                        background: isActive
                          ? "linear-gradient(to right, #56D0DB, #2D77C1)"
                          : "#f0f0f0",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={label} />
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          ))}
        </List>

        {/* Bottom user info */}
        <Box
          sx={{
            mt: "auto",
            p: 2,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton onClick={() => setShowProfile(true)}>
            <Avatar sx={{ bgcolor: "#56D0DB" }}>{getUserAvatar()}</Avatar>
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getUserDisplayName()}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getUserEmail()}
            </div>
          </Box>
          <IconButton
            sx={{ marginLeft: "auto", color: "#aaa" }}
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <Logout />
          </IconButton>
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f7f7f7" }}>
        {/* Topbar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
            height: 64,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box sx={{ width: "40px", height: "40px" }}>
                <img
                  src={MedlearnLogo}
                  alt="Medlearn Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "#2D77C1",
                    lineHeight: 1,
                  }}
                >
                  MEDLEARN
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    color: "#2D77C1",
                    lineHeight: 1,
                    fontWeight: "600",
                  }}
                >
                  Parents
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content render từ router */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {/* User Profile Dialog */}
      <Dialog
        open={showProfile}
        onClose={() => setShowProfile(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: 450,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pb: 1,
            background: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          👨‍👩‍👧‍👦 Thông Tin Phụ Huynh
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {userInfo ? (
            <Box sx={{ p: 3 }}>
              {/* Avatar Section */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: "0 auto",
                    bgcolor: "#56D0DB",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    boxShadow: "0 4px 20px rgba(86, 208, 219, 0.3)",
                  }}
                >
                  {getUserAvatar()}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    fontWeight: "bold",
                    color: "#2D77C1",
                  }}
                >
                  {getUserDisplayName()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  Phụ huynh học sinh
                </Typography>
              </Box>

              {/* Info Cards */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    icon: "🆔",
                    label: "Mã số",
                    value: userInfo.userId || userInfo.id || "N/A",
                    bgColor: "#FFF3E0",
                  },
                  {
                    icon: "📧",
                    label: "Email",
                    value: userInfo.email || "N/A",
                    bgColor: "#E8F5E8",
                  },
                  {
                    icon: "📱",
                    label: "Số điện thoại",
                    value: userInfo.phone || "N/A",
                    bgColor: "#E3F2FD",
                  },
                  {
                    icon: "👨‍👩‍👧‍👦",
                    label: "Vai trò",
                    value: userInfo.role || "Phụ huynh",
                    bgColor: "#F3E5F5",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid #e0e0e0",
                      minHeight: "72px", // Ensure consistent height
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: item.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.875rem",
                          mb: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        sx={{
                          fontSize: "1rem",
                          color: "#2D77C1",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                Không có thông tin người dùng.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleUpdateProfile}
            variant="outlined"
            sx={{
              borderColor: "#56D0DB",
              color: "#2D77C1",
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold",
              "&:hover": {
                borderColor: "#2D77C1",
                background: "rgba(86, 208, 219, 0.1)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Cập nhật thông tin
          </Button>
          <Button
            onClick={() => setShowProfile(false)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
              color: "white",
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(135deg, #4BC5CE 0%, #1E5F9F 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(45, 119, 193, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
