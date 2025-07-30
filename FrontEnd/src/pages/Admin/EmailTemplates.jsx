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
      
      // Lọc ra templates chưa bị xóa (isDeleted = false hoặc không có isDeleted)
      const activeTemplates = (response || []).filter(template => {
        const isDeleted = template.isDeleted === true;
        return !isDeleted;
      });
      
      setTemplates(activeTemplates);
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
        to: template.to || template.email?.to || "", // Lấy email từ template cũ
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
    setFormData({ subject: "", body: "" });
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
        // Update existing template - chỉ gửi id, subject và body
        const updateData = {
          id: editingTemplate.emailTemplateId || editingTemplate.id,
          subject: formData.subject,
          body: formData.body,
        };
        
        await adminEmailService.updateEmailTemplate(updateData);
        showAlert("Cập nhật template thành công", "success");
      } else {
        // Create new template - chỉ gửi subject và body
        const createData = {
          subject: formData.subject,
          body: formData.body,
        };
        
        await adminEmailService.createEmailTemplate(createData);
        showAlert("Tạo template thành công", "success");
      }

      handleCloseDialog();
      fetchTemplates();
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error response headers:", error.response?.headers);
      console.error("Error message:", error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          "Lỗi không xác định";
      
      showAlert(`Lỗi khi lưu template: ${errorMessage}`, "error");
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa template này?")) {
      try {
        // Tìm chính xác template cần xóa
        const templateToDelete = templates.find(t => 
          t.id === templateId || 
          t.emailTemplateId === templateId ||
          t.emailTemplateId === parseInt(templateId)
        );
        
        if (!templateToDelete) {
          showAlert("Không tìm thấy template để xóa", "error");
          return;
        }
        
        // Sử dụng emailTemplateId nếu có, không thì dùng id
        const deleteId = templateToDelete.emailTemplateId || templateToDelete.id;
        
        await adminEmailService.deleteEmailTemplate(deleteId);
        showAlert("Xóa template thành công", "success");
        await fetchTemplates(); // Refresh danh sách
      } catch (error) {
        console.error("Error deleting template:", error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data || 
                            error.message || 
                            "Lỗi không xác định";
        showAlert(`Lỗi khi xóa template: ${errorMessage}`, "error");
      }
    }
  };

  const handlePreview = (template) => {
    setEditingTemplate(template);
    setPreviewDialog(true);
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
              <EmailIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
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
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                      <Typography>Đang tải...</Typography>
                    </TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                      <Typography color="text.secondary">
                        Chưa có template nào. Tạo template đầu tiên!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((template, index) => (
                    <TableRow key={template.emailTemplateId || template.id || index} hover>
                      <TableCell>{template.emailTemplateId || template.id || index + 1}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {template.subject}
                        </Typography>
                      </TableCell>
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
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTemplate(template.emailTemplateId || template.id)}
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
