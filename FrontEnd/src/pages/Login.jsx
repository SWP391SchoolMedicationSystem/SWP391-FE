// File: src/pages/Login.jsx
import { Box, Container, Grid, Typography } from "@mui/material";
import Header from "../components/layout/Header";
import FeatureCards from "../components/login/FeatureCards";
import LoginForm from "../components/login/LoginForm";

export default function MedlearnLoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f2f6f3",
      }}
    >
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ fontWeight: "bold", color: "#2f5148" }}
            >
              Chào mừng đến 
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{ fontWeight: "800", color: "#2f5148" }}
            >
              Medlearn
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: 2, lineHeight: 1.6, color: "#97a19b" }}
            >
              Đăng nhập để truy cập các dịch vụ y tế học đường tốt nhất. 
              Kết nối với y tá, đặt lịch chăm sóc và theo dõi tình trạng sức khỏe học sinh một cách dễ dàng.
            </Typography>
            <FeatureCards />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LoginForm />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
