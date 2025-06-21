import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  Fab,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Visibility,
  Person,
  Email,
  Phone,
  School,
} from "@mui/icons-material";
import "../../css/Admin/ManageManagers.css";

function ManageManagers() {
  // Mock data for managers
  const [managers, setManagers] = useState([
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@school.edu.vn",
      phone: "0123456789",
      school: "Trường Mầm Non ABC",
      status: "active",
      createdDate: "2024-01-15",
      lastLogin: "2024-03-15",
    },
    {
      id: 2,
      fullName: "Trần Thị B",
      email: "tranthib@school.edu.vn",
      phone: "0987654321",
      school: "Trường Mầm Non XYZ",
      status: "active",
      createdDate: "2024-02-10",
      lastLogin: "2024-03-14",
    },
    {
      id: 3,
      fullName: "Lê Văn C",
      email: "levanc@school.edu.vn",
      phone: "0456789123",
      school: "Trường Mầm Non DEF",
      status: "inactive",
      createdDate: "2024-01-20",
      lastLogin: "2024-02-28",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("create"); // create, edit, view
  const [selectedManager, setSelectedManager] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    school: "",
    password: "",
  });

  // Handle dialog operations
  const handleCreateManager = () => {
    setDialogType("create");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      school: "",
      password: "",
    });
    setOpenDialog(true);
  };

  const handleEditManager = (manager) => {
    setDialogType("edit");
    setSelectedManager(manager);
    setFormData({
      fullName: manager.fullName,
      email: manager.email,
      phone: manager.phone,
      school: manager.school,
      password: "",
    });
    setOpenDialog(true);
  };

  const handleViewManager = (manager) => {
    setDialogType("view");
    setSelectedManager(manager);
    setOpenDialog(true);
  };

  const handleDeleteManager = (managerId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa manager này?")) {
      setManagers(managers.filter((m) => m.id !== managerId));
    }
  };

  const handleSaveManager = () => {
    if (dialogType === "create") {
      const newManager = {
        id: managers.length + 1,
        ...formData,
        status: "active",
        createdDate: new Date().toISOString().split("T")[0],
        lastLogin: "-",
      };
      setManagers([...managers, newManager]);
    } else if (dialogType === "edit") {
      setManagers(
        managers.map((m) =>
          m.id === selectedManager.id ? { ...m, ...formData } : m
        )
      );
    }
    setOpenDialog(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "error";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  return (
    <div className="manage-managers">
      <div className="page-header">
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#1f2937" }}
        >
          Quản Lý Manager
        </Typography>
        <Typography variant="body1" sx={{ color: "#6b7280", mt: 1 }}>
          Tạo, cập nhật và quản lý tài khoản Manager
        </Typography>
      </div>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card className="stat-card">
            <CardContent>
              <Box className="stat-content">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  <Person />
                </div>
                <div className="stat-info">
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {managers.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng Manager
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="stat-card">
            <CardContent>
              <Box className="stat-content">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: "#10B981" }}
                >
                  <Person />
                </div>
                <div className="stat-info">
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {managers.filter((m) => m.status === "active").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đang Hoạt Động
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="stat-card">
            <CardContent>
              <Box className="stat-content">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  <Person />
                </div>
                <div className="stat-info">
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {managers.filter((m) => m.status === "inactive").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Không Hoạt Động
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Managers Table */}
      <Card>
        <CardContent>
          <Box className="table-header">
            <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
              Danh Sách Manager
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateManager}
              sx={{ backgroundColor: "#DC2626" }}
            >
              Tạo Manager Mới
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Manager</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Điện thoại</TableCell>
                  <TableCell>Trường</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Lần đăng nhập cuối</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>
                      <Box className="manager-info">
                        <Avatar sx={{ bgcolor: "#DC2626", mr: 2 }}>
                          {manager.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            {manager.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {manager.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>{manager.phone}</TableCell>
                    <TableCell>{manager.school}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(manager.status)}
                        color={getStatusColor(manager.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{manager.lastLogin}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewManager(manager)}
                        title="Xem chi tiết"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="warning"
                        onClick={() => handleEditManager(manager)}
                        title="Chỉnh sửa"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteManager(manager.id)}
                        title="Xóa"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit/View */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "create" && "Tạo Manager Mới"}
          {dialogType === "edit" && "Chỉnh Sửa Manager"}
          {dialogType === "view" && "Chi Tiết Manager"}
        </DialogTitle>
        <DialogContent>
          {dialogType === "view" ? (
            // View Mode
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ và tên"
                  value={selectedManager?.fullName || ""}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={selectedManager?.email || ""}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Điện thoại"
                  value={selectedManager?.phone || ""}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Trường"
                  value={selectedManager?.school || ""}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ngày tạo"
                  value={selectedManager?.createdDate || ""}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Lần đăng nhập cuối"
                  value={selectedManager?.lastLogin || ""}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          ) : (
            // Create/Edit Mode
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ và tên *"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Điện thoại *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tên trường *"
                  value={formData.school}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              {dialogType === "create" && (
                <Grid item xs={12}>
                  <TextField
                    label="Mật khẩu *"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          {dialogType !== "view" && (
            <Button
              onClick={handleSaveManager}
              variant="contained"
              sx={{ backgroundColor: "#DC2626" }}
            >
              {dialogType === "create" ? "Tạo" : "Cập nhật"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageManagers;
