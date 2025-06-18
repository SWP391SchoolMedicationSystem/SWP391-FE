import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Paper,
  Grid,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Fab,
} from "@mui/material";
import {
  PersonalVideo,
  Add,
  Schedule,
  CheckCircle,
  Cancel,
  Phone,
  Email,
  LocalHospital,
  AccessTime,
  Person,
  MedicalServices,
  EventNote,
  Warning,
  Info,
  Assignment,
  Close,
} from "@mui/icons-material";

function Consultation() {
  const [showForm, setShowForm] = useState(false);

  // Mock data
  const consultationRequests = [
    {
      id: 1,
      studentName: "Nguyễn Minh Khôi",
      requestDate: "2024-03-15",
      appointmentDate: "2024-03-20",
      appointmentTime: "14:00",
      concern: "Đau bụng thường xuyên",
      description:
        "Con em thường xuyên đau bụng sau khi ăn, đặc biệt là vào buổi chiều. Muốn được bác sĩ tư vấn về chế độ ăn uống.",
      doctor: "BS. Nguyễn Thị Lan",
      status: "scheduled",
      priority: "medium",
    },
    {
      id: 2,
      studentName: "Nguyễn Minh Khôi",
      requestDate: "2024-03-10",
      appointmentDate: "2024-03-12",
      appointmentTime: "10:30",
      concern: "Kiểm tra sức khỏe tổng quát",
      description:
        "Muốn kiểm tra sức khỏe tổng quát cho con trước khi tham gia hoạt động thể thao.",
      doctor: "BS. Phạm Văn Minh",
      status: "completed",
      priority: "low",
      result: "Sức khỏe tốt, có thể tham gia hoạt động thể thao bình thường",
    },
  ];

  const [formData, setFormData] = useState({
    studentName: "Nguyễn Minh Khôi",
    concern: "",
    description: "",
    urgency: "medium",
    preferredDate: "",
    preferredTime: "",
    contactMethod: "phone",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setShowForm(false);
    // Reset form
    setFormData({
      studentName: "Nguyễn Minh Khôi",
      concern: "",
      description: "",
      urgency: "medium",
      preferredDate: "",
      preferredTime: "",
      contactMethod: "phone",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ff9800",
      scheduled: "#2196f3",
      completed: "#4caf50",
      cancelled: "#f44336",
    };
    return colors[status] || "#9e9e9e";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Schedule />,
      scheduled: <EventNote />,
      completed: <CheckCircle />,
      cancelled: <Cancel />,
    };
    return icons[status] || <Info />;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Đang chờ xử lý",
      scheduled: "Đã lên lịch",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#f44336",
      medium: "#ff9800",
      low: "#4caf50",
    };
    return colors[priority] || "#9e9e9e";
  };

  const getPriorityText = (priority) => {
    const texts = {
      high: "Khẩn cấp",
      medium: "Bình thường",
      low: "Không gấp",
    };
    return texts[priority] || priority;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: "linear-gradient(135deg, #2D77C1 0%, #56D0DB 100%)",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "white", fontWeight: "bold", mb: 1 }}
        >
          💬 Tư Vấn Y Tế
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
          Đặt lịch tư vấn riêng với bác sĩ trường
        </Typography>
      </Paper>

      {/* Quick Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "#2D77C1",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <AccessTime />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Thời gian làm việc
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thứ 2 - Thứ 6: 8:00 - 17:00
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thứ 7: 8:00 - 12:00
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "#4caf50",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Phone />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Liên hệ khẩn cấp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hotline: 1900-1234
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: yte@truong.edu.vn
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "#ff9800",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <MedicalServices />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Đội ngũ bác sĩ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 bác sĩ chuyên khoa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2 y tá điều dưỡng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Consultation Requests List */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            📋 Lịch sử yêu cầu tư vấn
          </Typography>
          <Chip
            label={`${consultationRequests.length} yêu cầu`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Stack spacing={3}>
          {consultationRequests.map((request) => (
            <Card
              key={request.id}
              elevation={2}
              sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {request.concern}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Chip
                        icon={<Person />}
                        label={request.studentName}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={getStatusIcon(request.status)}
                        label={getStatusText(request.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(request.status),
                          color: "white",
                        }}
                      />
                      <Chip
                        label={getPriorityText(request.priority)}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(request.priority),
                          color: "white",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  <strong>Mô tả:</strong> {request.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      📅 <strong>Ngày gửi:</strong> {request.requestDate}
                    </Typography>
                  </Grid>
                  {request.appointmentDate && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        🗓️ <strong>Lịch hẹn:</strong> {request.appointmentDate}{" "}
                        - {request.appointmentTime}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      👨‍⚕️ <strong>Bác sĩ:</strong> {request.doctor}
                    </Typography>
                  </Grid>
                </Grid>

                {request.result && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Kết quả tư vấn:</strong> {request.result}
                    </Typography>
                  </Alert>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    startIcon={<Assignment />}
                    size="small"
                  >
                    Xem chi tiết
                  </Button>
                  {request.status === "scheduled" && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Schedule />}
                        color="warning"
                        size="small"
                      >
                        Đổi lịch
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        color="error"
                        size="small"
                      >
                        Hủy
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(135deg, #2D77C1 0%, #56D0DB 100%)",
        }}
        onClick={() => setShowForm(true)}
      >
        <Add />
      </Fab>

      {/* New Request Dialog */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #e0e0e0", pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ➕ Gửi yêu cầu tư vấn mới
            </Typography>
            <IconButton onClick={() => setShowForm(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleFormSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên học sinh"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  disabled
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vấn đề cần tư vấn"
                  value={formData.concern}
                  onChange={(e) =>
                    setFormData({ ...formData, concern: e.target.value })
                  }
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả chi tiết"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  multiline
                  rows={4}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Mức độ ưu tiên</InputLabel>
                  <Select
                    value={formData.urgency}
                    onChange={(e) =>
                      setFormData({ ...formData, urgency: e.target.value })
                    }
                    label="Mức độ ưu tiên"
                  >
                    <MenuItem value="low">Không gấp</MenuItem>
                    <MenuItem value="medium">Bình thường</MenuItem>
                    <MenuItem value="high">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Phương thức liên hệ</InputLabel>
                  <Select
                    value={formData.contactMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactMethod: e.target.value,
                      })
                    }
                    label="Phương thức liên hệ"
                  >
                    <MenuItem value="phone">Điện thoại</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="in-person">Trực tiếp tại trường</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Ngày mong muốn"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Giờ mong muốn"
                  value={formData.preferredTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, borderTop: "1px solid #e0e0e0" }}>
            <Button onClick={() => setShowForm(false)} color="inherit">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #2D77C1 0%, #56D0DB 100%)",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Gửi yêu cầu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default Consultation;
