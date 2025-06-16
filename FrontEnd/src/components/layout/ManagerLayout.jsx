import { Outlet, NavLink } from "react-router-dom";
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
  People,
  Article,
  Vaccines,
  Notifications,
  Description,
  Info,
  Settings,
  Menu,
  Logout,
  ChatBubbleOutline,
  BarChart,
} from "@mui/icons-material";

const drawerWidth = 240;

const navItems = [
  { to: "/manager", label: "Bảng Điều Khiển", icon: <Dashboard /> },
  { to: "/manager/accounts", label: "Quản Lý Tài Khoản", icon: <People /> },
  { to: "/manager/blogs", label: "Quản Lý Blog", icon: <Article /> },
  {
    to: "/manager/vaccinations",
    label: "Danh Sách Tiêm Chủng",
    icon: <Vaccines />,
  },
  {
    to: "/manager/StudentList",
    label: "Danh Sách Học Sinh",
    icon: <BarChart />,
  },
  {
    to: "/manager/notifications",
    label: "Thông Báo",
    icon: <Notifications />,
  },
  { to: "/manager/forms", label: "Biểu Mẫu Danh Mục", icon: <Description /> },
  { to: "/manager/info", label: "Xem Thông Tin", icon: <Info /> },
  { to: "/manager/settings", label: "Cài Đặt", icon: <Settings /> },
];

export default function ManagerLayout() {
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
          MedManager 🛡
        </Toolbar>
        <List>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              to={to}
              key={to}
              end={to === "/manager"} // chỉ dùng end cho dashboard
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
          <Avatar sx={{ bgcolor: "#56D0DB" }}>M</Avatar>
          <Box>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Manager</div>
            <div style={{ fontSize: 12, color: "#888" }}>manager@gmail.com</div>
          </Box>
          <IconButton sx={{ marginLeft: "auto", color: "#aaa" }}>
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
                  placeholder="Tìm kiếm thông tin, học sinh, etc."
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
              <Avatar sx={{ bgcolor: "#2D77C1" }}>M</Avatar>
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
