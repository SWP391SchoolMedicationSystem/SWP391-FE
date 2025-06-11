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
  Security,
  Event,
  BarChart,
  Notifications,
  Description,
  Info,
  Settings,
  Search,
  Menu,
  Logout,
  ChatBubbleOutline,
} from "@mui/icons-material";

const drawerWidth = 240;

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <Dashboard /> },
  { to: "/admin/accounts", label: "Account Management", icon: <People /> },
  { to: "/admin/roles", label: "Permissions and Roles", icon: <Security /> },
  { to: "/admin/appointments", label: "Appointments", icon: <Event /> },
  { to: "/admin/reports", label: "Monitoring & Reporting", icon: <BarChart /> },
  { to: "/admin/notifications", label: "Notifications", icon: <Notifications /> },
  { to: "/admin/forms", label: "Category Forms", icon: <Description /> },
  { to: "/admin/info", label: "View Information", icon: <Info /> },
  { to: "/admin/settings", label: "Settings", icon: <Settings /> },
];

export default function AdminLayout() {
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
          MedAdmin 🛡
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
                      ? "linear-gradient(to right, #56D0DB, #2D77C1)"
                      : "transparent",
                    "&:hover": {
                      background: isActive
                        ? "linear-gradient(to right, #56D0DB, #2D77C1)"
                        : "#f0f0f0",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
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
          <Avatar sx={{ bgcolor: "#56D0DB" }}>A</Avatar>
          <Box>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Admin</div>
            <div style={{ fontSize: 12, color: "#888" }}>admin@gmail</div>
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
                <Search
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#888",
                    fontSize: 20,
                  }}
                />
                <InputBase
                  placeholder="Search for data, users, etc."
                  sx={{ pl: 4, pr: 2, py: 0.5, width: "100%" }}
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
              <Avatar sx={{ bgcolor: "#2D77C1" }} />
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
