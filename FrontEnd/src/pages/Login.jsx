// File: src/pages/Login.jsx
import { Box, Container, Grid, Typography } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FeatureCards from "../components/login/FeatureCards";
import LoginForm from "../components/login/LoginForm";

export default function MedlearnLoginPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#F0F9FF" }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, alignItems: "flex-start", gap: 6 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", color: "text.primary" }}>
              Welcome back to <br />
              <Box component="span" sx={{ color: "#56D0DB" }}>
                Medlearn
              </Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
              Log in to access the best healthcare services. Connect with doctors, book appointments, and manage your
              health with ease.
            </Typography>
            <FeatureCards />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LoginForm />
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
