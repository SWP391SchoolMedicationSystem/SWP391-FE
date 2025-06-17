import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh,
  FilterList,
  Download,
  Search,
  Info,
  Warning,
  Error,
  CheckCircle,
} from "@mui/icons-material";
import "../../css/Admin/SystemLogs.css";

function SystemLogs() {
  // Mock data for system logs
  const [logs] = useState([
    {
      id: 1,
      timestamp: "2024-03-15 14:30:25",
      level: "info",
      action: "User Login",
      user: "manager@school.edu.vn",
      ipAddress: "192.168.1.100",
      details: "Manager logged in successfully",
      module: "Authentication",
    },
    {
      id: 2,
      timestamp: "2024-03-15 14:28:15",
      level: "warning",
      action: "Failed Login Attempt",
      user: "unknown@test.com",
      ipAddress: "192.168.1.250",
      details: "Invalid password attempt",
      module: "Authentication",
    },
    {
      id: 3,
      timestamp: "2024-03-15 14:25:10",
      level: "info",
      action: "Student Data Import",
      user: "manager@school.edu.vn",
      ipAddress: "192.168.1.100",
      details: "Imported 50 student records",
      module: "Data Management",
    },
    {
      id: 4,
      timestamp: "2024-03-15 14:20:05",
      level: "error",
      action: "Database Connection",
      user: "system",
      ipAddress: "localhost",
      details: "Database connection timeout",
      module: "System",
    },
    {
      id: 5,
      timestamp: "2024-03-15 14:15:30",
      level: "info",
      action: "Manager Account Created",
      user: "admin@system.com",
      ipAddress: "192.168.1.50",
      details: "New manager account created: newmanager@school.edu.vn",
      module: "User Management",
    },
    {
      id: 6,
      timestamp: "2024-03-15 14:10:20",
      level: "success",
      action: "Backup Completed",
      user: "system",
      ipAddress: "localhost",
      details: "Daily backup completed successfully",
      module: "System",
    },
    {
      id: 7,
      timestamp: "2024-03-15 14:05:15",
      level: "warning",
      action: "High Memory Usage",
      user: "system",
      ipAddress: "localhost",
      details: "Memory usage at 85%",
      module: "System Monitor",
    },
    {
      id: 8,
      timestamp: "2024-03-15 14:00:10",
      level: "info",
      action: "File Upload",
      user: "nurse@school.edu.vn",
      ipAddress: "192.168.1.120",
      details: "Uploaded medication schedule document",
      module: "File Management",
    },
  ]);

  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [filterLevel, setFilterLevel] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const logLevels = ["info", "warning", "error", "success"];
  const modules = [...new Set(logs.map((log) => log.module))];

  // Filter logs based on search and filters
  React.useEffect(() => {
    let filtered = logs.filter((log) => {
      const matchesLevel = filterLevel === "" || log.level === filterLevel;
      const matchesModule = filterModule === "" || log.module === filterModule;
      const matchesSearch =
        searchTerm === "" ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesLevel && matchesModule && matchesSearch;
    });

    setFilteredLogs(filtered);
  }, [filterLevel, filterModule, searchTerm, logs]);

  const getLevelIcon = (level) => {
    switch (level) {
      case "info":
        return <Info />;
      case "warning":
        return <Warning />;
      case "error":
        return <Error />;
      case "success":
        return <CheckCircle />;
      default:
        return <Info />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "info":
        return "info";
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "success":
        return "success";
      default:
        return "default";
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case "info":
        return "Thông tin";
      case "warning":
        return "Cảnh báo";
      case "error":
        return "Lỗi";
      case "success":
        return "Thành công";
      default:
        return level;
    }
  };

  const handleExport = () => {
    // Export logs functionality
    console.log("Exporting logs...");
    alert("Tính năng xuất logs sẽ được triển khai!");
  };

  const handleRefresh = () => {
    // Refresh logs functionality
    console.log("Refreshing logs...");
    alert("Đã làm mới logs!");
  };

  return (
    <div className="system-logs">
      <div className="page-header">
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#1f2937" }}
        >
          System Logs
        </Typography>
        <Typography variant="body1" sx={{ color: "#6b7280", mt: 1 }}>
          Theo dõi và phân tích hoạt động hệ thống
        </Typography>
      </div>

      {/* Statistics */}
      <Box className="logs-stats" sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Box className="stats-grid">
              <div className="stat-item">
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#3B82F6" }}
                >
                  {logs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng logs
                </Typography>
              </div>
              <div className="stat-item">
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#EF4444" }}
                >
                  {logs.filter((log) => log.level === "error").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lỗi
                </Typography>
              </div>
              <div className="stat-item">
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#F59E0B" }}
                >
                  {logs.filter((log) => log.level === "warning").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cảnh báo
                </Typography>
              </div>
              <div className="stat-item">
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#10B981" }}
                >
                  {logs.filter((log) => log.level === "success").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thành công
                </Typography>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box className="logs-controls">
            <Box className="search-filters">
              <TextField
                placeholder="Tìm kiếm logs..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "#9CA3AF" }} />,
                }}
                sx={{ minWidth: 250 }}
              />

              <TextField
                select
                label="Mức độ"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {logLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {getLevelText(level)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Module"
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {modules.map((module) => (
                  <MenuItem key={module} value={module}>
                    {module}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box className="action-buttons">
              <Tooltip title="Làm mới">
                <IconButton onClick={handleRefresh}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Button
                startIcon={<Download />}
                variant="outlined"
                onClick={handleExport}
              >
                Xuất logs
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Mức độ</TableCell>
                  <TableCell>Hành động</TableCell>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Chi tiết</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {log.timestamp}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getLevelIcon(log.level)}
                        label={getLevelText(log.level)}
                        color={getLevelColor(log.level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        {log.action}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.user}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {log.ipAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.module}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {log.details}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredLogs.length === 0 && (
            <Box className="no-logs">
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ py: 4 }}
              >
                Không tìm thấy logs phù hợp với bộ lọc
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SystemLogs;
