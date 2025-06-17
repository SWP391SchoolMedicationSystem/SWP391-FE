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
} from "@mui/material";
import {
  Home,
  Article,
  MedicalServices,
  Notifications,
  Chat,
  FolderShared,
  PersonalVideo,
  Add,
  Edit,
  Menu,
  Logout,
  ChatBubbleOutline,
  Search,
} from "@mui/icons-material";
import userService from "../../services/userService";

const drawerWidth = 240;

const navItems = [
  { to: "/parent", label: "Trang Chủ", icon: <Home /> },
  { to: "/parent/blog", label: "Xem Blog", icon: <Article /> },
  {
    to: "/parent/health-history",
    label: "Lịch Sử Khám Sức Khỏe",
    icon: <MedicalServices />,
  },
  { to: "/parent/notifications", label: "Thông Báo", icon: <Notifications /> },
  { to: "/parent/consultation", label: "Tư Vấn Y Tế", icon: <PersonalVideo /> },
  { to: "/parent/chat", label: "Chat Với Y Tá", icon: <Chat /> },
  {
    to: "/parent/health-records",
    label: "Hồ Sơ Sức Khỏe",
    icon: <FolderShared />,
  },
  { to: "/parent/health-records/add", label: "Thêm Hồ Sơ", icon: <Add /> },
  {
    to: "/parent/health-records/edit",
    label: "Cập Nhật Hồ Sơ",
    icon: <Edit />,
  },
];

export default function ParentLayout() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

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
    if (!userInfo) return "Phụ Huynh";
    return userInfo.userName || userInfo.email?.split("@")[0] || "Phụ Huynh";
  };

  const getUserEmail = () => {
    if (!userInfo) return "parent@example.com";
    return userInfo.email || "parent@example.com";
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
          <Avatar sx={{ bgcolor: "#56D0DB" }}>{getUserAvatar()}</Avatar>
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
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton>
                <Menu />
              </IconButton>
              <Box
                sx={{
                  position: "relative",
                  width: 300,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                }}
              >
                <InputBase
                  placeholder="Tìm kiếm thông tin sức khỏe, blog..."
                  sx={{ pl: 2, pr: 2, py: 0.5, width: "100%" }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton>
                <Notifications />
              </IconButton>
              <IconButton>
                <ChatBubbleOutline />
              </IconButton>
              <Avatar sx={{ bgcolor: "#2D77C1" }}>{getUserAvatar()}</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content render từ router */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
