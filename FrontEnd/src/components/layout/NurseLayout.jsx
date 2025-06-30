import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  People,
  MedicalServices,
  Article,
  Chat,
  Notifications,
  Menu,
  Logout,
  ChatBubbleOutline,
  VaccinesOutlined,
  Medication,
  Assignment,
} from "@mui/icons-material";
import userService from "../../services/userService";
import MedlearnLogo from "../../assets/images/Medlearn-logo.png";

const drawerWidth = 240;

const navItems = [
  { to: "/nurse", label: "Sự Kiện Tiêm Chủng", icon: <VaccinesOutlined /> },

  {
    to: "/nurse/medication-schedule",
    label: "Lịch Uống Thuốc",
    icon: <Medication />,
  },
  {
    to: "/nurse/handle-medicine",
    label: "Xử Lý Thuốc",
    icon: <MedicalServices />,
  },
  {
    to: "/nurse/medicine-management",
    label: "Quản Lý Thuốc",
    icon: <Medication />,
  },
  { to: "/nurse/view-student-medicine", label: "Đơn thuốc từ phụ huynh", icon: <Medication /> },
  { to: "/nurse/blog", label: "Blog", icon: <Article /> },
  { to: "/nurse/chat", label: "Chat Phụ Huynh", icon: <Chat /> },
  { to: "/nurse/student-list", label: "Danh Sách Học Sinh", icon: <People /> },
  {
    to: "/nurse/health-records",
    label: "Hồ Sơ Sức Khỏe",
    icon: <Assignment />,
  },
  {
    to: "/nurse/notifications",
    label: "Thông Báo",
    icon: <Notifications />,
  },
];

export default function NurseLayout() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

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

  const handleLogout = () => {
    userService.logout();
    navigate("/");
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (!userInfo) return "Y Tá";
    return (
      userInfo.userName ||
      userInfo.fullname ||
      userInfo.email?.split("@")[0] ||
      "Y Tá"
    );
  };

  const getUserEmail = () => {
    if (!userInfo) return "nurse@example.com";
    return userInfo.email || "nurse@example.com";
  };

  const getUserAvatar = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

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
          MedNurse 👩‍⚕️
        </Toolbar>
        <List>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              to={to}
              key={to}
              end={to === "/nurse"} // chỉ dùng end cho trang chính
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
                  Nurse
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
          👩‍⚕️ Thông Tin Y Tá
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
                  Y tá chăm sóc sức khỏe học sinh
                </Typography>
              </Box>

              {/* Info Cards */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#E3F2FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    🆔
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Mã số
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {userInfo.userId || userInfo.id || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#E8F5E8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    📧
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {userInfo.email || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {userInfo.phone && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "#FFF3E0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      📱
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Số điện thoại
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {userInfo.phone}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {userInfo.role && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "#F3E5F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      👩‍⚕️
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Vai trò
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {userInfo.role}
                      </Typography>
                    </Box>
                  </Box>
                )}
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
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
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
