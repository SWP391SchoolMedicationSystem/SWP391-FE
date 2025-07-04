import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Grid,
  Container,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { adminEmailService } from "../../services/adminService";

function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await adminEmailService.getEmailTemplates();
      setTemplates(response || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      showAlert("Lỗi khi tải danh sách template", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "info" }),
      3000
    );
  };

  const handleOpenDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        to: template.to || "",
        subject: template.subject || "",
        body: template.body || "",
      });
    } else {
      setEditingTemplate(null);
      setFormData({ to: "", subject: "", body: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTemplate(null);
    setFormData({ to: "", subject: "", body: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTemplate = async () => {
    try {
      if (!formData.subject || !formData.body) {
        showAlert("Vui lòng điền đầy đủ thông tin", "warning");
        return;
      }

      if (editingTemplate) {
        // Update existing template
        const updateData = {
          id: editingTemplate.id,
          email: formData,
        };
        await adminEmailService.updateEmailTemplate(updateData);
        showAlert("Cập nhật template thành công", "success");
      } else {
        // Create new template
        await adminEmailService.createEmailTemplate(formData);
        showAlert("Tạo template thành công", "success");
      }

      handleCloseDialog();
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      showAlert("Lỗi khi lưu template", "error");
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa template này?")) {
      try {
        // Note: Backend chưa có DELETE endpoint, sẽ implement khi có API
        showAlert("Chức năng xóa sẽ được implement khi backend có API", "info");
      } catch (error) {
        console.error("Error deleting template:", error);
        showAlert("Lỗi khi xóa template", "error");
      }
    }
  };

  const handlePreview = (template) => {
    setEditingTemplate(template);
    setPreviewDialog(true);
  };

  const handleSendTest = async (template) => {
    try {
      const emailData = {
        to: "admin@school.com", // Test email
        subject: `[TEST] ${template.subject}`,
        body: template.body,
      };

      await adminEmailService.sendEmail(emailData);
      showAlert("Gửi email test thành công", "success");
    } catch (error) {
      console.error("Error sending test email:", error);
      showAlert("Lỗi khi gửi email test", "error");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          📧 Email Templates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý các mẫu email hệ thống
        </Typography>
      </Box>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <EmailIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {templates.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng Templates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <SendIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emails Sent Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Templates Table */}
      <Card elevation={2}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Danh sách Email Templates
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)",
              }}
            >
              Tạo Template Mới
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>To</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 3 }}>
                      <Typography>Đang tải...</Typography>
                    </TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 3 }}>
                      <Typography color="text.secondary">
                        Chưa có template nào. Tạo template đầu tiên!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((template, index) => (
                    <TableRow key={template.id || index} hover>
                      <TableCell>{template.id || index + 1}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {template.subject}
                        </Typography>
                      </TableCell>
                      <TableCell>{template.to || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {template.createdAt || "2024-03-15"}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Preview">
                            <IconButton
                              size="small"
                              onClick={() => handlePreview(template)}
                              color="info"
                            >
                              <PreviewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(template)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Test">
                            <IconButton
                              size="small"
                              onClick={() => handleSendTest(template)}
                              color="success"
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTemplate(template.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Template Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {editingTemplate ? "Chỉnh sửa Template" : "Tạo Template Mới"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To (Email nhận - optional)"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="admin@school.com"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject *"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Tiêu đề email"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Body *"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                placeholder="Nội dung email..."
                variant="outlined"
                multiline
                rows={8}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveTemplate}
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)",
            }}
          >
            {editingTemplate ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", borderBottom: 1, borderColor: "divider" }}
        >
          📧 Preview Email Template
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {editingTemplate && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                To: {editingTemplate.to || "Recipient Email"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Subject: {editingTemplate.subject}
              </Typography>
              <Box
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  minHeight: 200,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                >
                  {editingTemplate.body}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add template"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)",
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default EmailTemplates;
