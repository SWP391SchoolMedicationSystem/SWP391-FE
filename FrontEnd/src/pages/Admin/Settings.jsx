import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  Chip,
} from "@mui/material";
import {
  Security,
  Notifications,
  Storage,
  Backup,
  Update,
  AdminPanelSettings,
  Save,
} from "@mui/icons-material";

function AdminSettings() {
  const [settings, setSettings] = useState({
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: true,
    loginAttempts: 5,

    // System Settings
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    systemLogging: true,

    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    userActivityAlerts: false,

    // Database Settings
    maxConnections: 100,
    queryTimeout: 30,
    autoOptimize: true,
  });

  const [saveStatus, setSaveStatus] = useState("");

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to backend
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Bạn có chắc chắn muốn reset về cài đặt mặc định?")) {
      setSettings({
        twoFactorAuth: true,
        sessionTimeout: 30,
        passwordPolicy: true,
        loginAttempts: 5,
        autoBackup: true,
        backupFrequency: "daily",
        maintenanceMode: false,
        systemLogging: true,
        emailNotifications: true,
        systemAlerts: true,
        userActivityAlerts: false,
        maxConnections: 100,
        queryTimeout: 30,
        autoOptimize: true,
      });
    }
  };

  const getStatusChip = () => {
    if (saveStatus === "saving") {
      return <Chip label="Đang lưu..." color="warning" size="small" />;
    } else if (saveStatus === "success") {
      return <Chip label="Đã lưu thành công" color="success" size="small" />;
    }
    return null;
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#1f2937" }}
        >
          Cài Đặt Hệ Thống
        </Typography>
        <Typography variant="body1" sx={{ color: "#6b7280", mt: 1 }}>
          Quản lý cấu hình và thiết lập hệ thống
        </Typography>
      </div>

      {/* Status Alert */}
      {saveStatus && (
        <Alert
          severity={saveStatus === "success" ? "success" : "info"}
          sx={{ mb: 3 }}
        >
          {saveStatus === "success"
            ? "Cài đặt đã được lưu thành công!"
            : "Đang lưu cài đặt..."}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Security sx={{ mr: 1, color: "#DC2626" }} />
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  Bảo Mật
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleSettingChange("twoFactorAuth", e.target.checked)
                    }
                    color="error"
                  />
                }
                label="Xác thực 2 yếu tố"
                sx={{ mb: 2, display: "block" }}
              />

              <TextField
                label="Thời gian hết phiên (phút)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  handleSettingChange(
                    "sessionTimeout",
                    parseInt(e.target.value)
                  )
                }
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.passwordPolicy}
                    onChange={(e) =>
                      handleSettingChange("passwordPolicy", e.target.checked)
                    }
                    color="error"
                  />
                }
                label="Chính sách mật khẩu mạnh"
                sx={{ mb: 2, display: "block" }}
              />

              <TextField
                label="Số lần đăng nhập sai tối đa"
                type="number"
                value={settings.loginAttempts}
                onChange={(e) =>
                  handleSettingChange("loginAttempts", parseInt(e.target.value))
                }
                fullWidth
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AdminPanelSettings sx={{ mr: 1, color: "#DC2626" }} />
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  Hệ Thống
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoBackup}
                    onChange={(e) =>
                      handleSettingChange("autoBackup", e.target.checked)
                    }
                    color="error"
                  />
                }
                label="Tự động sao lưu"
                sx={{ mb: 2, display: "block" }}
              />

              <TextField
                select
                label="Tần suất sao lưu"
                value={settings.backupFrequency}
                onChange={(e) =>
                  handleSettingChange("backupFrequency", e.target.value)
                }
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="hourly">Mỗi giờ</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      handleSettingChange("maintenanceMode", e.target.checked)
                    }
                    color="warning"
                  />
                }
                label="Chế độ bảo trì"
                sx={{ mb: 2, display: "block" }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.systemLogging}
                    onChange={(e) =>
                      handleSettingChange("systemLogging", e.target.checked)
                    }
                    color="error"
                  />
                }
                label="Ghi log hệ thống"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Notifications sx={{ mr: 1, color: "#DC2626" }} />
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  Thông Báo
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "emailNotifications",
                        e.target.checked
                      )
                    }
                    color="error"
                  />
                }
                label="Thông báo qua email"
                sx={{ mb: 2, display: "block" }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.systemAlerts}
                    onChange={(e) =>
                      handleSettingChange("systemAlerts", e.target.checked)
                    }
                    color="error"
                  />
                }
                label="Cảnh báo hệ thống"
                sx={{ mb: 2, display: "block" }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.userActivityAlerts}
                    onChange={(e) =>
                      handleSettingChange(
                        "userActivityAlerts",
                        e.target.checked
                      )
                    }
                    color="error"
                  />
                }
                label="Cảnh báo hoạt động người dùng"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Database Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Storage sx={{ mr: 1, color: "#DC2626" }} />
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  Cơ Sở Dữ Liệu
                </Typography>
              </Box>

              <TextField
                label="Số kết nối tối đa"
                type="number"
                value={settings.maxConnections}
                onChange={(e) =>
                  handleSettingChange(
                    "maxConnections",
                    parseInt(e.target.value)
                  )
                }
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Timeout truy vấn (giây)"
                type="number"
                value={settings.queryTimeout}
                onChange={(e) =>
                  handleSettingChange("queryTimeout", parseInt(e.target.value))
                }
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoOptimize}
                    onChange={(e) =>
                      handleSettingChange("autoOptimize", e.target.checked)
                    }
                    color="error"
                  />
                }
                label="Tự động tối ưu hóa"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                sx={{ backgroundColor: "#DC2626" }}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saving" ? "Đang lưu..." : "Lưu Cài Đặt"}
              </Button>

              <Button
                variant="outlined"
                onClick={handleResetToDefaults}
                disabled={saveStatus === "saving"}
              >
                Reset Mặc Định
              </Button>

              {getStatusChip()}
            </Box>

            <Typography variant="caption" color="text.secondary">
              Cài đặt sẽ được áp dụng ngay lập tức
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminSettings;
