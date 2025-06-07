// File: src/components/login/FeatureCards.jsx
import { Box, Card, Grid, Typography } from "@mui/material";
import { PersonOutline, ShieldOutlined, FavoriteBorder } from "@mui/icons-material";

const featureCards = [
  {
    icon: <PersonOutline sx={{ fontSize: 32, color: "info.main" }} />,
    title: "200+ Doctors",
    description: "Medical Experts",
  },
  {
    icon: <ShieldOutlined sx={{ fontSize: 32, color: "info.main" }} />,
    title: "Secure",
    description: "Safe Information",
  },
  {
    icon: <FavoriteBorder sx={{ fontSize: 32, color: "info.main" }} />,
    title: "24/7",
    description: "Continuous Support",
  },
];

export default function FeatureCards() {
  return (
    <Grid container spacing={2} sx={{ mt: 4 }}>
      {featureCards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.title}>
          <Card
            sx={{
              textAlign: "center",
              p: 2,
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.3s ease",
              ":hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box
              sx={{
                bgcolor: "info.light",
                borderRadius: "50%",
                p: 1.5,
                display: "inline-flex",
                mb: 1,
                transition: "background-color 0.3s ease",
              }}
            >
              {card.icon}
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {card.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {card.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
