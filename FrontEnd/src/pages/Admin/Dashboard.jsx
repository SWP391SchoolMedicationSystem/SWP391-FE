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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  People,
  Security,
  Notifications,
  Analytics,
  LocalHospital,
  EventNote,
  Medication,
  Schedule,
  CalendarToday,
  Warning,
  Dashboard as DashboardIcon,
  Refresh,
  Settings,
  Visibility,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { adminDashboardService } from "../../services/adminService";
import "../../css/Admin/Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState([]);
  const [reportPeriod, setReportPeriod] = useState("week");
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard statistics from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await adminDashboardService.getDashboardStatistics();
        console.log('📊 Dashboard data loaded:', data);
        
        // Handle the API response structure
        if (data && data.data) {
          setDashboardData(data.data);
        } else if (data) {
          setDashboardData(data);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        // Set empty data to show error state
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  // Report data based on API statistics
  const weeklyReportData = {
    sickReports: Math.floor((dashboardData?.totalStudents || 80) * 0.15), // 15% of students
    leaveRequests: Math.floor((dashboardData?.totalStudents || 80) * 0.1), // 10% of students
    medicinesSent: Math.floor((dashboardData?.totalStudents || 80) * 0.3), // 30% of students
    medicineSchedules: Math.floor((dashboardData?.totalStudents || 80) * 0.5), // 50% of students
  };

  const monthlyReportData = {
    sickReports: Math.floor((dashboardData?.totalStudents || 80) * 0.6), // 60% of students
    leaveRequests: Math.floor((dashboardData?.totalStudents || 80) * 0.4), // 40% of students
    medicinesSent: Math.floor((dashboardData?.totalStudents || 80) * 1.2), // 120% of students
    medicineSchedules: Math.floor((dashboardData?.totalStudents || 80) * 2), // 200% of students
  };

  const currentReportData = reportPeriod === "week" ? weeklyReportData : monthlyReportData;

  // Chart data for user roles
  const userRoleData = [
    { name: "Học Sinh", value: dashboardData?.totalStudents || 0 },
    { name: "Phụ Huynh", value: dashboardData?.totalParents || 0 },
    { name: "Nhân Viên", value: (dashboardData?.totalManagers || 0) + (dashboardData?.totalNurses || 0) },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];





  // Calculate real statistics
  useEffect(() => {
    const calculateStats = () => {
      if (!dashboardData) {
        setDashboardStats([]);
        return;
      }

      const stats = [
        {
          title: "Tổng Người Dùng",
          value: dashboardData.totalUsers?.toString() || "0",
          change: `+${dashboardData.activeUsers || 0} hoạt động`,
          changeType: "increase",
          icon: <People />,
          color: "#3B82F6",
          gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        },
        {
          title: "Tổng Nhân Viên",
          value: dashboardData.totalStaff?.toString() || "0",
          change: `+${dashboardData.totalManagers || 0} Manager, +${dashboardData.totalNurses || 0} Nurse`,
          changeType: "increase",
          icon: <Analytics />,
          color: "#10B981",
          gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        },
        {
          title: "Tổng Học Sinh",
          value: dashboardData.totalStudents?.toString() || "0",
          change: "+15",
          changeType: "increase",
          icon: <LocalHospital />,
          color: "#F59E0B",
          gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        },
        {
          title: "Tổng Phụ Huynh",
          value: dashboardData.totalParents?.toString() || "0",
          change: "+8",
          changeType: "increase",
          icon: <Security />,
          color: "#EF4444",
          gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        },
      ];

      setDashboardStats(stats);
    };

    if (!loading) {
      calculateStats();
    }
  }, [dashboardData, loading]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderCustomizedTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const refreshDashboard = () => {
    window.location.reload();
  };

  return (
    <div className="admin-dashboard">
      {/* Enhanced Header */}
      <div className="dashboard-header">
        <Box className="header-content">
          <Box className="header-left">
            <Typography
              variant="h3"
              component="h1"
              sx={{ 
                fontWeight: "800", 
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1
              }}
            >
              <DashboardIcon sx={{ fontSize: "2.5rem" }} />
              Admin Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: "400" }}>
              Quản lý tổng thể hệ thống School Medication
            </Typography>
          </Box>
          <Box className="header-actions">
            <Tooltip title="Làm mới dashboard">
              <IconButton 
                onClick={refreshDashboard}
                sx={{ 
                  color: "white", 
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </div>

      {/* Enhanced Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          <Grid item xs={12}>
            <Card className="loading-card">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <div className="loading-spinner"></div>
                  <Typography>Đang tải dữ liệu từ API...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : !dashboardData || dashboardStats.length === 0 ? (
          <Grid item xs={12}>
            <Card className="error-card">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography color="error">Không thể tải dữ liệu thống kê từ API</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          dashboardStats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card className="stat-card enhanced">
                <CardContent>
                  <Box className="stat-content">
                    <div
                      className="stat-icon enhanced"
                      style={{ background: stat.gradient }}
                    >
                      {stat.icon}
                    </div>
                    <div className="stat-info">
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{ fontWeight: "800", mb: 1 }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Chip
                        label={stat.change}
                        size="small"
                        sx={{
                          backgroundColor: stat.changeType === "increase" ? "#10B981" : "#EF4444",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "0.75rem",
                        }}
                      />
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>



      {/* Charts Section */}
      <Box className="charts-section">
        <Card className="enhanced-tabs">
          <CardContent>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              className="enhanced-tabs"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Thống Kê Người Dùng" />
            </Tabs>

            <Box className="chart-panel">
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" className="chart-title">
                  Tổng số người đang có mặt trong hệ thống
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip content={renderCustomizedTooltip} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default AdminDashboard;
