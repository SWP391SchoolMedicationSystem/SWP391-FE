import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  useAdminStaff,
  useAdminBlogs,
  useSystemLogs,
  useSystemStatistics,
} from "../../utils/hooks/useAdmin";
import "../../css/Admin/Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState([]);

  // Get real data from APIs
  const { data: staff, loading: staffLoading } = useAdminStaff();
  const { data: blogs, loading: blogsLoading } = useAdminBlogs();
  const { data: systemLogs, loading: logsLoading } = useSystemLogs();
  const { data: statistics, loading: statsLoading } = useSystemStatistics();

  // Calculate real statistics
  useEffect(() => {
    const calculateStats = () => {
      const totalStaff = staff ? staff.length : 0;
      const totalBlogs = blogs ? blogs.length : 0;
      const pendingBlogs = blogs
        ? blogs.filter((b) => b.status === "pending").length
        : 0;
      const totalLogs = systemLogs ? systemLogs.length : 0;

      const stats = [
        {
          title: "Tổng Nhân Viên",
          value: totalStaff.toString(),
          change: "+2", // Mock change
          changeType: "increase",
          icon: <SupervisorAccount />,
          color: "#3B82F6",
        },
        {
          title: "System Logs",
          value: totalLogs.toString(),
          change: "+45", // Mock change
          changeType: "increase",
          icon: <Assignment />,
          color: "#10B981",
        },
        {
          title: "Tổng Bài Viết",
          value: totalBlogs.toString(),
          change:
            pendingBlogs > 0 ? `${pendingBlogs} chờ duyệt` : "Đã duyệt hết",
          changeType: pendingBlogs > 0 ? "warning" : "increase",
          icon: <Category />,
          color: "#F59E0B",
        },
        {
          title: "Hoạt Động",
          value: "98%", // Mock system uptime
          change: "+2%",
          changeType: "increase",
          icon: <TrendingUp />,
          color: "#EF4444",
        },
      ];

      setDashboardStats(stats);
    };

    if (!staffLoading && !blogsLoading && !logsLoading) {
      calculateStats();
    }
  }, [staff, blogs, systemLogs, staffLoading, blogsLoading, logsLoading]);

  // Get recent activities from real data
  const getRecentActivities = () => {
    const activities = [];

    // Add recent staff activities
    if (staff && staff.length > 0) {
      const recentStaff = staff
        .filter((s) => s.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);

      recentStaff.forEach((staffMember) => {
        activities.push({
          id: staffMember.id,
          action: `Tạo tài khoản: ${staffMember.fullName || staffMember.name}`,
          user: "Admin",
          time: new Date(staffMember.createdAt).toLocaleDateString("vi-VN"),
          type: "create",
        });
      });
    }

    // Add recent blog activities
    if (blogs && blogs.length > 0) {
      const recentBlogs = blogs
        .filter((b) => b.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 1);

      recentBlogs.forEach((blog) => {
        activities.push({
          id: `blog_${blog.id}`,
          action: `Bài viết mới: "${blog.title}"`,
          user: "Admin",
          time: new Date(blog.createdAt).toLocaleDateString("vi-VN"),
          type: "update",
        });
      });
    }

    // Add mock activities if not enough real data
    while (activities.length < 4) {
      activities.push({
        id: `mock_${activities.length}`,
        action: "Xem system logs",
        user: "Admin",
        time: "1 giờ trước",
        type: "view",
      });
    }

    return activities.slice(0, 4);
  };

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

  const handleQuickAction = (path) => {
    navigate(path);
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
        {staffLoading || blogsLoading || logsLoading ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography>⏳ Đang tải thống kê...</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          dashboardStats.map((stat, index) => (
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
                              : stat.changeType === "warning"
                              ? "#F59E0B"
                              : "#EF4444",
                          fontWeight: "medium",
                        }}
                      >
                        {stat.change}
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
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
                  onClick={() => handleQuickAction("/admin/manage-managers")}
                >
                  Quản Lý Manager
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  sx={{ mb: 2, width: "100%" }}
                  onClick={() => handleQuickAction("/admin/system-logs")}
                >
                  Xem System Logs
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Category />}
                  sx={{ width: "100%" }}
                  onClick={() => handleQuickAction("/admin/form-categories")}
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
                {getRecentActivities().map((activity) => (
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
