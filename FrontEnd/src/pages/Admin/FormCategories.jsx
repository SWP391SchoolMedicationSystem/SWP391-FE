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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Category,
  Description,
  DateRange,
} from "@mui/icons-material";
import "../../css/Admin/FormCategories.css";

function FormCategories() {
  // Mock data for form categories
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Sức khỏe học sinh",
      description: "Các biểu mẫu liên quan đến sức khỏe và y tế học sinh",
      formCount: 15,
      createdDate: "2024-01-15",
      lastUpdated: "2024-03-10",
      status: "active",
    },
    {
      id: 2,
      name: "Tiêm chủng",
      description: "Biểu mẫu theo dõi lịch tiêm chủng và vaccine",
      formCount: 8,
      createdDate: "2024-01-20",
      lastUpdated: "2024-03-05",
      status: "active",
    },
    {
      id: 3,
      name: "Thông tin phụ huynh",
      description: "Các form thu thập thông tin liên hệ và gia đình",
      formCount: 12,
      createdDate: "2024-02-01",
      lastUpdated: "2024-02-28",
      status: "active",
    },
    {
      id: 4,
      name: "Khám sức khỏe định kỳ",
      description: "Biểu mẫu ghi nhận kết quả khám sức khỏe",
      formCount: 6,
      createdDate: "2024-02-10",
      lastUpdated: "2024-03-01",
      status: "active",
    },
    {
      id: 5,
      name: "Thuốc và dị ứng",
      description: "Form quản lý thông tin thuốc và tình trạng dị ứng",
      formCount: 10,
      createdDate: "2024-02-15",
      lastUpdated: "2024-03-08",
      status: "active",
    },
    {
      id: 6,
      name: "Báo cáo sự cố",
      description: "Biểu mẫu báo cáo các sự cố y tế tại trường",
      formCount: 4,
      createdDate: "2024-03-01",
      lastUpdated: "2024-03-12",
      status: "inactive",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("create"); // create, edit, view
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Handle dialog operations
  const handleCreateCategory = () => {
    setDialogType("create");
    setFormData({
      name: "",
      description: "",
    });
    setOpenDialog(true);
  };

  const handleEditCategory = (category) => {
    setDialogType("edit");
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setOpenDialog(true);
  };

  const handleViewCategory = (category) => {
    setDialogType("view");
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories.filter((c) => c.id !== categoryId));
    }
  };

  const handleSaveCategory = () => {
    if (dialogType === "create") {
      const newCategory = {
        id: categories.length + 1,
        ...formData,
        formCount: 0,
        createdDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setCategories([...categories, newCategory]);
    } else if (dialogType === "edit") {
      setCategories(
        categories.map((c) =>
          c.id === selectedCategory.id
            ? {
                ...c,
                ...formData,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : c
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

  const getCategoryColor = (index) => {
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="form-categories">
      <div className="page-header">
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#1f2937" }}
        >
          Danh Mục Biểu Mẫu
        </Typography>
        <Typography variant="body1" sx={{ color: "#6b7280", mt: 1 }}>
          Quản lý các danh mục và loại biểu mẫu trong hệ thống
        </Typography>
      </div>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card className="stat-card">
            <CardContent>
              <Box className="stat-content">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  <Category />
                </div>
                <div className="stat-info">
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {categories.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng Danh Mục
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card className="stat-card">
            <CardContent>
              <Box className="stat-content">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: "#10B981" }}
                >
                  <Description />
                </div>
                <div className="stat-info">
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {categories.reduce((sum, cat) => sum + cat.formCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng Biểu Mẫu
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card className="stat-card">
            <CardContent>
              <Box className="stat-content">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: "#F59E0B" }}
                >
                  <Category />
                </div>
                <div className="stat-info">
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {categories.filter((c) => c.status === "active").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đang Sử Dụng
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card className="stat-card">
            <CardContent>
              <Box className="stat-content">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  <DateRange />
                </div>
                <div className="stat-info">
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {new Date().getMonth() + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tháng Hiện Tại
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Categories Table */}
      <Card>
        <CardContent>
          <Box className="table-header">
            <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
              Danh Sách Danh Mục
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateCategory}
              sx={{ backgroundColor: "#DC2626" }}
            >
              Tạo Danh Mục Mới
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="center">Số biểu mẫu</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Cập nhật cuối</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Box className="category-info">
                        <Avatar
                          sx={{
                            bgcolor: getCategoryColor(index),
                            mr: 2,
                            width: 40,
                            height: 40,
                          }}
                        >
                          <Category />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            {category.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {category.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {category.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={category.formCount}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{category.createdDate}</TableCell>
                    <TableCell>{category.lastUpdated}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(category.status)}
                        color={getStatusColor(category.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewCategory(category)}
                        title="Xem chi tiết"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="warning"
                        onClick={() => handleEditCategory(category)}
                        title="Chỉnh sửa"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCategory(category.id)}
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
          {dialogType === "create" && "Tạo Danh Mục Mới"}
          {dialogType === "edit" && "Chỉnh Sửa Danh Mục"}
          {dialogType === "view" && "Chi Tiết Danh Mục"}
        </DialogTitle>
        <DialogContent>
          {dialogType === "view" ? (
            // View Mode
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Tên danh mục"
                  value={selectedCategory?.name || ""}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả"
                  value={selectedCategory?.description || ""}
                  fullWidth
                  multiline
                  rows={3}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số biểu mẫu"
                  value={selectedCategory?.formCount || 0}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Trạng thái"
                  value={getStatusText(selectedCategory?.status || "")}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ngày tạo"
                  value={selectedCategory?.createdDate || ""}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cập nhật cuối"
                  value={selectedCategory?.lastUpdated || ""}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          ) : (
            // Create/Edit Mode
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Tên danh mục *"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả *"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          {dialogType !== "view" && (
            <Button
              onClick={handleSaveCategory}
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

export default FormCategories;
