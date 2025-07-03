import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Link, Typography } from "@mui/material";
import MedlearnLogo from "../../assets/images/medlearn-logo.png";

export default function Header() {
  return (
    <Box component="header" sx={{ py: 2, fontFamily: "Poppins, sans-serif" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            component={RouterLink}
            to="#"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box sx={{ width: "50px", height: "50px" }}>
                <img
                  src={MedlearnLogo}
                  alt="Medlearn Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#73ad67",
                    lineHeight: 1,
                  }}
                >
                  MEDLEARN
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#666",
                    lineHeight: 1,
                  }}
                >
                  Medical Education
                </Typography>
              </Box>
            </Box>
          </Link>
          <Box
            component="nav"
            sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}
          >
            <Link
              component={RouterLink}
              to="/Home"
              color="text.secondary"
              sx={{ textDecoration: "none", "&:hover": { color: "info.main" } }}
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="#"
              color="text.secondary"
              sx={{ textDecoration: "none", "&:hover": { color: "info.main" } }}
            >
              Services
            </Link>
            <Link
              component={RouterLink}
              to="#"
              color="text.secondary"
              sx={{ textDecoration: "none", "&:hover": { color: "info.main" } }}
            >
              Product
            </Link>
            <Link
              component={RouterLink}
              to="#"
              color="text.secondary"
              sx={{ textDecoration: "none", "&:hover": { color: "info.main" } }}
            >
              About Us
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
