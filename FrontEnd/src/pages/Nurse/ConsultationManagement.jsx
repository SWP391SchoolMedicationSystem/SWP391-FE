import React, { useState, useEffect } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Add,
  Refresh,
  EventNote,
  Person,
  School,
} from "@mui/icons-material";
import { useConsultation } from "../../utils/hooks/useConsultation";

const ConsultationManagement = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { types, requests, crud, refreshData } = useConsultation();

  // Refresh data on mount and when refreshKey changes
  useEffect(() => {
    refreshData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleCreateRequest = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "đang chờ":
        return "warning";
      case "approved":
      case "đã duyệt":
        return "success";
      case "rejected":
      case "từ chối":
        return "error";
      case "completed":
      case "hoàn thành":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Đang chờ";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      case "completed":
        return "Hoàn thành";
      default:
        return status || "Chưa xác định";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  if (requests.loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (requests.error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Lỗi khi tải dữ liệu: {requests.error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "#2D77C1" }}
          >
            <EventNote sx={{ mr: 1, verticalAlign: "middle" }} />
            Quản Lý Lịch Tư Vấn
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Xem và quản lý các yêu cầu tư vấn từ phụ huynh
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ mr: 2 }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateRequest}
            sx={{
              bgcolor: "#2D77C1",
              "&:hover": { bgcolor: "#1a5490" },
            }}
          >
            Tạo lịch tư vấn
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng yêu cầu
              </Typography>
              <Typography variant="h4" component="div">
                {requests.data?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Đang chờ
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ color: "#ff9800" }}
              >
                {requests.data?.filter(
                  (r) => r.status?.toLowerCase() === "pending"
                ).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Đã duyệt
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ color: "#4caf50" }}
              >
                {requests.data?.filter(
                  (r) => r.status?.toLowerCase() === "approved"
                ).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Hoàn thành
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ color: "#2196f3" }}
              >
                {requests.data?.filter(
                  (r) => r.status?.toLowerCase() === "completed"
                ).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Consultation Requests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Danh sách yêu cầu tư vấn
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Học sinh</TableCell>
                  <TableCell>Phụ huynh</TableCell>
                  <TableCell>Loại tư vấn</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.data?.length > 0 ? (
                  requests.data.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <School sx={{ mr: 1, fontSize: 16 }} />
                          {request.studentName ||
                            request.student?.name ||
                            "Chưa xác định"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Person sx={{ mr: 1, fontSize: 16 }} />
                          {request.parentName ||
                            request.parent?.name ||
                            "Chưa xác định"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {request.consultationType || "Chưa xác định"}
                      </TableCell>
                      <TableCell>
                        {formatDate(request.createdDate || request.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(request.status)}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            onClick={() => handleViewRequest(request)}
                            size="small"
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary">
                        Không có yêu cầu tư vấn nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Request Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết yêu cầu tư vấn</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID"
                  value={selectedRequest.id || ""}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Trạng thái"
                  value={getStatusText(selectedRequest.status)}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Học sinh"
                  value={
                    selectedRequest.studentName ||
                    selectedRequest.student?.name ||
                    ""
                  }
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phụ huynh"
                  value={
                    selectedRequest.parentName ||
                    selectedRequest.parent?.name ||
                    ""
                  }
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Loại tư vấn"
                  value={selectedRequest.consultationType || ""}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày tạo"
                  value={formatDate(
                    selectedRequest.createdDate || selectedRequest.createdAt
                  )}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nội dung"
                  value={
                    selectedRequest.description || selectedRequest.content || ""
                  }
                  InputProps={{ readOnly: true }}
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
              {selectedRequest.response && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phản hồi"
                    value={selectedRequest.response}
                    InputProps={{ readOnly: true }}
                    multiline
                    rows={3}
                    margin="normal"
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Create Request Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Tạo lịch tư vấn mới</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Chức năng tạo lịch tư vấn sẽ được hoàn thiện trong phiên bản tiếp
            theo
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultationManagement;
