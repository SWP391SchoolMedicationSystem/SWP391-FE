import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Link, Typography } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
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
            <Box sx={{ position: "relative" }}>
              <img
                src={MedlearnLogo}
                alt="Medlearn Logo"
                style={{ height: 90, width: 120, objectFit: "contain" }}
              />
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
          <Button
            variant="contained"
            sx={{
              borderRadius: "50px",
              px: 3,
              color: "white",
              background: "linear-gradient(to right, #56D0DB, #2D77C1)",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
