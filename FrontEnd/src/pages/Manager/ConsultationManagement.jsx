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
  Tabs,
  Tab,
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
  CheckCircle,
  Cancel,
  Assignment,
} from "@mui/icons-material";
import { useConsultation } from "../../utils/hooks/useConsultation";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`consultation-tabpanel-${index}`}
      aria-labelledby={`consultation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ConsultationManagement = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTypeDialog, setOpenTypeDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [responseText, setResponseText] = useState("");

  const { types, requests, crud, refreshData } = useConsultation();

  // Refresh data on mount and when refreshKey changes
  useEffect(() => {
    refreshData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setResponseText(request.response || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setResponseText("");
  };

  const handleApproveRequest = async () => {
    if (selectedRequest) {
      try {
        const updatedRequest = {
          ...selectedRequest,
          status: "approved",
          response: responseText,
        };
        await crud.updateRequest(updatedRequest);
        handleRefresh();
        handleCloseDialog();
      } catch (error) {
        console.error("Error approving request:", error);
      }
    }
  };

  const handleRejectRequest = async () => {
    if (selectedRequest) {
      try {
        const updatedRequest = {
          ...selectedRequest,
          status: "rejected",
          response: responseText,
        };
        await crud.updateRequest(updatedRequest);
        handleRefresh();
        handleCloseDialog();
      } catch (error) {
        console.error("Error rejecting request:", error);
      }
    }
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

  const renderRequestsTable = (filterStatus = null) => {
    const filteredRequests = filterStatus
      ? requests.data?.filter(
          (r) => r.status?.toLowerCase() === filterStatus.toLowerCase()
        )
      : requests.data;

    return (
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
            {filteredRequests?.length > 0 ? (
              filteredRequests.map((request) => (
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
    );
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
            <Assignment sx={{ mr: 1, verticalAlign: "middle" }} />
            Quản Lý Lịch Tư Vấn
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Xem và phê duyệt các yêu cầu tư vấn từ phụ huynh
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
                Chờ phê duyệt
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
                Đã phê duyệt
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
                Đã từ chối
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ color: "#f44336" }}
              >
                {requests.data?.filter(
                  (r) => r.status?.toLowerCase() === "rejected"
                ).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="consultation tabs"
          >
            <Tab label="Tất cả yêu cầu" />
            <Tab label="Chờ phê duyệt" />
            <Tab label="Đã phê duyệt" />
            <Tab label="Loại tư vấn" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderRequestsTable()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderRequestsTable("pending")}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderRequestsTable("approved")}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Quản lý loại tư vấn
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên loại tư vấn</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {types.data?.length > 0 ? (
                  types.data.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell>{type.name || type.typeName}</TableCell>
                      <TableCell>
                        {type.description || "Không có mô tả"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="textSecondary">
                        Không có loại tư vấn nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* View/Edit Request Dialog */}
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
                  label="Nội dung yêu cầu"
                  value={
                    selectedRequest.description || selectedRequest.content || ""
                  }
                  InputProps={{ readOnly: true }}
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phản hồi của quản lý"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  multiline
                  rows={3}
                  margin="normal"
                  placeholder="Nhập phản hồi của bạn..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          {selectedRequest?.status?.toLowerCase() === "pending" && (
            <>
              <Button
                onClick={handleRejectRequest}
                color="error"
                startIcon={<Cancel />}
              >
                Từ chối
              </Button>
              <Button
                onClick={handleApproveRequest}
                color="success"
                startIcon={<CheckCircle />}
                variant="contained"
              >
                Phê duyệt
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultationManagement;
