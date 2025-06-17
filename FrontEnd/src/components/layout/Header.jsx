import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Link, Typography } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h4"
                  component="span"
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Medlearn
                </Typography>
                <AddCircleOutline
                  sx={{
                    color: "info.main",
                    fontSize: "1.2rem",
                    ml: 0.5,
                    mb: 2,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  mt: -1.5,
                  color: "text.secondary",
                }}
              >
                Medical Education
              </Typography>
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
