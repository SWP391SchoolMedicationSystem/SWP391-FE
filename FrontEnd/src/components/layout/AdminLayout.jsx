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
  Dashboard,
  SupervisorAccount,
  Assignment,
  Category,
  Settings,
  Menu,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";
import userService from "../../services/userService";

const drawerWidth = 240;

const navItems = [
  { to: "/admin", label: "Bảng Điều Khiển", icon: <Dashboard /> },
  {
    to: "/admin/manage-managers",
    label: "Quản Lý Manager",
    icon: <SupervisorAccount />,
  },
  { to: "/admin/system-logs", label: "Xem System Logs", icon: <Assignment /> },
  {
    to: "/admin/form-categories",
    label: "Danh Mục Biểu Mẫu",
    icon: <Category />,
  },
  { to: "/admin/settings", label: "Cài Đặt", icon: <Settings /> },
];

export default function AdminLayout() {
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
    if (!userInfo) return "Admin";
    return userInfo.userName || userInfo.email?.split("@")[0] || "Admin";
  };

  const getUserEmail = () => {
    if (!userInfo) return "admin@example.com";
    return userInfo.email || "admin@example.com";
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
        <Toolbar sx={{ fontWeight: "bold", fontSize: 20, color: "#DC2626" }}>
          <AdminPanelSettings sx={{ mr: 1 }} />
          AdminPanel
        </Toolbar>
        <List>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              to={to}
              key={to}
              end={to === "/admin"} // chỉ dùng end cho dashboard
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
                        ? "linear-gradient(to right, #DC2626, #B91C1C)"
                        : "transparent",
                      "&:hover": {
                        background: isActive
                          ? "linear-gradient(to right, #DC2626, #B91C1C)"
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
          <Avatar sx={{ bgcolor: "#DC2626" }}>{getUserAvatar()}</Avatar>
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
        <Outlet />
      </Box>
    </Box>
  );
}
