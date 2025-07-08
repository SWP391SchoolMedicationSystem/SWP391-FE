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
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
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
  LocalHospital,
  EventNote,
  Medication,
  Schedule,
  PictureAsPdf,
  GetApp,
  CalendarToday,
  Warning,
} from "@mui/icons-material";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
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
  const [reportPeriod, setReportPeriod] = useState("week");
  const [tabValue, setTabValue] = useState(0);

  // Get real data from APIs
  const { data: staff, loading: staffLoading } = useAdminStaff();
  const { data: blogs, loading: blogsLoading } = useAdminBlogs();
  const { data: systemLogs, loading: logsLoading } = useSystemLogs();
  const { data: statistics, loading: statsLoading } = useSystemStatistics();

  // Mock report data
  const weeklyReportData = {
    sickReports: 12,
    leaveRequests: 8,
    medicinesSent: 25,
    medicineSchedules: 45,
    incidents: 3
  };

  const monthlyReportData = {
    sickReports: 48,
    leaveRequests: 32,
    medicinesSent: 120,
    medicineSchedules: 180,
    incidents: 11
  };

  const currentReportData = reportPeriod === "week" ? weeklyReportData : monthlyReportData;

  // Chart data for reports
  const sickReportsChart = [
    { day: "T2", reports: 2, severe: 0 },
    { day: "T3", reports: 3, severe: 1 },
    { day: "T4", reports: 1, severe: 0 },
    { day: "T5", reports: 4, severe: 2 },
    { day: "T6", reports: 2, severe: 0 },
    { day: "T7", reports: 0, severe: 0 },
    { day: "CN", reports: 0, severe: 0 },
  ];

  const medicineDistribution = [
    { type: "Thuốc ho", quantity: 15, color: "#8884d8" },
    { type: "Thuốc sốt", quantity: 8, color: "#82ca9d" },
    { type: "Vitamin", quantity: 12, color: "#ffc658" },
    { type: "Thuốc dạ dày", quantity: 5, color: "#ff7300" },
  ];

  const weeklyTrend = [
    { week: "Tuần 1", sickReports: 15, medicines: 28, leaves: 6 },
    { week: "Tuần 2", sickReports: 18, medicines: 32, leaves: 8 },
    { week: "Tuần 3", sickReports: 12, medicines: 25, leaves: 5 },
    { week: "Tuần 4", sickReports: 20, medicines: 35, leaves: 10 },
  ];

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const exportPDFReport = () => {
    // Create comprehensive report data
    const reportData = {
      period: reportPeriod === "week" ? "Tuần này" : "Tháng này",
      timestamp: new Date().toLocaleString('vi-VN'),
      summary: currentReportData,
      charts: {
        sickReports: sickReportsChart,
        medicines: medicineDistribution,
        trends: weeklyTrend
      }
    };

    // Simple PDF export - in real app, use jsPDF or similar
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bao-cao-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    // Show success message
    alert(`Đã xuất báo cáo ${reportPeriod === 'week' ? 'tuần' : 'tháng'} thành công!`);
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

      {/* Health & Safety Reports Section */}
      <Card className="report-section-card" sx={{ mb: 4 }}>
        <CardContent>
          <Box className="report-header">
            <Typography variant="h5" className="report-title">
              🏥 Báo Cáo Y Tế & An Toàn Trường Học
            </Typography>
            <Box className="report-controls">
              <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Thời gian</InputLabel>
                <Select
                  value={reportPeriod}
                  label="Thời gian"
                  onChange={(e) => setReportPeriod(e.target.value)}
                >
                  <MenuItem value="week">Tuần này</MenuItem>
                  <MenuItem value="month">Tháng này</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={exportPDFReport}
                className="export-pdf-btn"
              >
                Xuất PDF
              </Button>
            </Box>
          </Box>

          {/* Report Summary Cards */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card className="report-card sick-reports">
                <CardContent>
                  <Box className="report-card-content">
                    <LocalHospital className="report-icon" />
                    <Box>
                      <Typography variant="h4" className="report-value">
                        {currentReportData.sickReports}
                      </Typography>
                      <Typography variant="body2" className="report-label">
                        Ca bệnh báo cáo
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card className="report-card leave-requests">
                <CardContent>
                  <Box className="report-card-content">
                    <EventNote className="report-icon" />
                    <Box>
                      <Typography variant="h4" className="report-value">
                        {currentReportData.leaveRequests}
                      </Typography>
                      <Typography variant="body2" className="report-label">
                        Đơn xin nghỉ
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card className="report-card medicines-sent">
                <CardContent>
                  <Box className="report-card-content">
                    <Medication className="report-icon" />
                    <Box>
                      <Typography variant="h4" className="report-value">
                        {currentReportData.medicinesSent}
                      </Typography>
                      <Typography variant="body2" className="report-label">
                        Thuốc gửi về
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card className="report-card medicine-schedules">
                <CardContent>
                  <Box className="report-card-content">
                    <Schedule className="report-icon" />
                    <Box>
                      <Typography variant="h4" className="report-value">
                        {currentReportData.medicineSchedules}
                      </Typography>
                      <Typography variant="body2" className="report-label">
                        Lịch uống thuốc
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card className="report-card incidents">
                <CardContent>
                  <Box className="report-card-content">
                    <Warning className="report-icon" />
                    <Box>
                      <Typography variant="h4" className="report-value">
                        {currentReportData.incidents}
                      </Typography>
                      <Typography variant="body2" className="report-label">
                        Sự cố nghiêm trọng
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Report Charts */}
          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
              <Tab label="Báo Cáo Bệnh Tật" />
              <Tab label="Phân Bố Thuốc" />
              <Tab label="Xu Hướng Tổng Quan" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {tabValue === 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>📊 Báo Cáo Bệnh Tật Theo Ngày</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={sickReportsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reports" fill="#8884d8" name="Báo cáo thường" />
                  <Bar dataKey="severe" fill="#ff4444" name="Trường hợp nghiêm trọng" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>💊 Phân Bố Loại Thuốc</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={medicineDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="quantity"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {medicineDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>📈 Xu Hướng 4 Tuần Gần Đây</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sickReports" stroke="#8884d8" name="Báo cáo bệnh" />
                  <Line type="monotone" dataKey="medicines" stroke="#82ca9d" name="Thuốc phát" />
                  <Line type="monotone" dataKey="leaves" stroke="#ffc658" name="Đơn nghỉ" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

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
