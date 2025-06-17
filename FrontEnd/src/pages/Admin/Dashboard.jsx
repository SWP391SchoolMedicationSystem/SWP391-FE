import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import {
  SupervisorAccount,
  Assignment,
  Category,
  TrendingUp,
  People,
  Security,
  Notifications,
  Analytics,
} from "@mui/icons-material";
import "../../css/Admin/Dashboard.css";

function AdminDashboard() {
  // Mock data for admin dashboard
  const stats = [
    {
      title: "Tổng Manager",
      value: "12",
      change: "+2",
      changeType: "increase",
      icon: <SupervisorAccount />,
      color: "#3B82F6",
    },
    {
      title: "System Logs",
      value: "1,234",
      change: "+45",
      changeType: "increase",
      icon: <Assignment />,
      color: "#10B981",
    },
    {
      title: "Danh Mục Form",
      value: "8",
      change: "+1",
      changeType: "increase",
      icon: <Category />,
      color: "#F59E0B",
    },
    {
      title: "Hoạt Động",
      value: "98%",
      change: "+2%",
      changeType: "increase",
      icon: <TrendingUp />,
      color: "#EF4444",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Tạo tài khoản Manager mới",
      user: "Admin",
      time: "2 phút trước",
      type: "create",
    },
    {
      id: 2,
      action: "Cập nhật danh mục biểu mẫu",
      user: "Admin",
      time: "15 phút trước",
      type: "update",
    },
    {
      id: 3,
      action: "Xem system logs",
      user: "Admin",
      time: "1 giờ trước",
      type: "view",
    },
    {
      id: 4,
      action: "Xóa tài khoản Manager",
      user: "Admin",
      time: "2 giờ trước",
      type: "delete",
    },
  ];

  const systemHealth = [
    { service: "Database", status: "healthy", uptime: "99.9%" },
    { service: "API Server", status: "healthy", uptime: "99.8%" },
    { service: "File Storage", status: "warning", uptime: "98.5%" },
    { service: "Mail Service", status: "healthy", uptime: "99.7%" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "create":
        return "🆕";
      case "update":
        return "📝";
      case "delete":
        return "🗑️";
      case "view":
        return "👁️";
      default:
        return "📄";
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#1f2937" }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#6b7280", mt: 1 }}>
          Quản lý tổng thể hệ thống School Medication
        </Typography>
      </div>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="stat-card">
              <CardContent>
                <Box className="stat-content">
                  <div
                    className="stat-icon"
                    style={{ backgroundColor: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          stat.changeType === "increase"
                            ? "#10B981"
                            : "#EF4444",
                        fontWeight: "medium",
                      }}
                    >
                      {stat.change} từ tháng trước
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card className="quick-actions-card">
            <CardContent>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Thao Tác Nhanh
              </Typography>
              <Box className="quick-actions">
                <Button
                  variant="contained"
                  startIcon={<SupervisorAccount />}
                  sx={{ mb: 2, width: "100%" }}
                  href="/admin/manage-managers"
                >
                  Quản Lý Manager
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  sx={{ mb: 2, width: "100%" }}
                  href="/admin/system-logs"
                >
                  Xem System Logs
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Category />}
                  sx={{ width: "100%" }}
                  href="/admin/form-categories"
                >
                  Quản Lý Danh Mục
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card className="activities-card">
            <CardContent>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Hoạt Động Gần Đây
              </Typography>
              <Box className="activities-list">
                {recentActivities.map((activity) => (
                  <Box key={activity.id} className="activity-item">
                    <Box className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Box className="activity-content">
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={4}>
          <Card className="system-health-card">
            <CardContent>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Tình Trạng Hệ Thống
              </Typography>
              <Box className="system-health-list">
                {systemHealth.map((service, index) => (
                  <Box key={index} className="health-item">
                    <Box className="health-info">
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        {service.service}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Uptime: {service.uptime}
                      </Typography>
                    </Box>
                    <Chip
                      label={service.status}
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminDashboard;
