import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import DoctorHomePageImage from "../assets/images/Doctor-HomePage.png";
import "../css/HomePage.css";
import {
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  TrendingUp,
  Event,
  Assessment,
  People,
  MonitorHeart,
  Vaccines,
  LocalHospital,
  School,
  ArrowForward,
  FiberManualRecord,
  MedicalServices,
  HealthAndSafety,
  Star,
  Info,
  Assignment,
} from "@mui/icons-material";

export default function Home() {
  // Mock data for statistics với colors như trong Figma
  const overviewStats = [
    {
      title: "Total Students",
      number: "1,245",
      note: "+15 this month",
      icon: <People sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#4CAF50",
    },
    {
      title: "Health Events",
      number: "24",
      note: "+2 this week",
      icon: <Info sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#FF9800",
    },
    {
      title: "Vaccinations",
      number: "85%",
      note: "Completion rate",
      icon: <Vaccines sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#4CAF50",
    },
    {
      title: "Health Checkups",
      number: "12",
      note: "Appointments today",
      icon: <Assignment sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#2196F3",
    },
  ];

  // Recent health events
  const recentEvents = [
    {
      title: "Student with mild fever",
      time: "Class 5A • Today",
      type: "fever",
    },
    {
      title: "Vaccine administration",
      time: "Class 3B • 2 days ago",
      type: "vaccine",
    },
    {
      title: "Regular health checkup",
      time: "Class 7C • 3 days ago",
      type: "checkup",
    },
    {
      title: "Student with stomach pain",
      time: "Class 4A • 5 days ago",
      type: "pain",
    },
  ];

  // Main services
  const mainServices = [
    {
      title: "Chat with doctor",
      description:
        "Connect with our medical professionals for consultations and health advice",
      icon: <MedicalServices sx={{ fontSize: 48, color: "#1976D2" }} />,
      bgColor: "#E3F2FD",
    },
    {
      title: "Vaccination",
      description: "Manage and track vaccination schedules for all students",
      icon: <Vaccines sx={{ fontSize: 48, color: "white" }} />,
      bgColor: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
    },
    {
      title: "Healthcare",
      description:
        "Comprehensive healthcare monitoring and medical records management",
      icon: <HealthAndSafety sx={{ fontSize: 48, color: "#2E7D32" }} />,
      bgColor: "#E8F5E8",
    },
  ];

  // Service categories
  const serviceCategories = {
    vaccination: [
      "Seasonal Flu Vaccine (September 15 - October 15)",
      "MMR Vaccine (September 20 - October 12)",
      "Chickenpox Vaccination (September 18 - October 2)",
    ],
    healthCheckup: [
      "Regular Health Checkup (2019/03/08 - Today)",
      "Vision Screening (February 15 - Today)",
      "Dental Health Checking (February 20 - Today)",
    ],
    medicinesSupplies: [
      "Fever Medication (7 items)",
      "Medical Gauze (2 items)",
      "Antiseptic Solution (3 items)",
    ],
  };

  return (
    <div className="home-page">
      <Header />

      {/* Hero Section - Using CSS approach */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-text">
            <h1>
              School Medical <br />
              <span className="highlight">Management System</span>
            </h1>
            <p>
              A comprehensive solution for managing student health,
              vaccinations, and medical monitoring in schools
            </p>
            <Button
              variant="contained"
              sx={{
                borderRadius: "50px",
                px: 3,
                color: "white",
                background: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Learn More
            </Button>
          </div>
          <div className="hero-image">
            <img src={DoctorHomePageImage} alt="Medical Team" />
          </div>
        </div>
      </section>

      {/* System Overview - Updated to match Figma */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1a237e", mb: 1 }}
          >
            System Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Efficient and comprehensive student health management
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {overviewStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Header với gradient và icon */}
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {stat.icon}
                  <Typography
                    variant="body2"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {stat.title}
                  </Typography>
                </Box>

                {/* Content */}
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: "#1a237e",
                      mb: 1,
                      fontSize: "2.5rem",
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: stat.noteColor,
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    {stat.note}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Health Statistics & Recent Events */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Student Health Statistics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Assessment sx={{ color: "#8B5CF6", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Student Health Statistics
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Monthly student health statistics trends
              </Typography>

              {/* Placeholder for chart */}
              <Box
                sx={{
                  height: 200,
                  bgcolor: "#F0F9FF",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Assessment sx={{ fontSize: 48, color: "#56D0DB", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Student Health Statistics
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Health Events */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Recent Health Events
                </Typography>
                <IconButton>
                  <ArrowForward />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Recent activity occurred in the past week
              </Typography>

              <List sx={{ p: 0 }}>
                {recentEvents.map((event, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FiberManualRecord
                        sx={{
                          fontSize: 12,
                          color:
                            event.type === "fever"
                              ? "#FF6B6B"
                              : event.type === "vaccine"
                              ? "#4ECDC4"
                              : event.type === "checkup"
                              ? "#45B7D1"
                              : "#FFA07A",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={event.title}
                      secondary={event.time}
                      primaryTypographyProps={{ fontSize: "0.9rem" }}
                      secondaryTypographyProps={{ fontSize: "0.8rem" }}
                    />
                    <IconButton size="small">
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Main Services - Fixed equal height Cards with no spacing */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Our <span style={{ color: "#56D0DB" }}>Main Services</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "text.secondary" }}
          >
            Categories
          </Typography>
        </Box>

        <Grid container spacing={0} alignItems="stretch">
          {mainServices.map((service, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              key={index}
              sx={{
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <Box sx={{ width: "100%", display: "flex" }}>
                <Card
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center",
                    background: service.bgColor,
                    borderRadius: 3,
                    flexGrow: 1,
                    cursor: "pointer",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    },
                    p: 4,
                  }}
                >
                  <Box>{service.icon}</Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mt: 2,
                        mb: 1,
                        color: index === 1 ? "white" : "text.primary",
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          index === 1
                            ? "rgba(255,255,255,0.9)"
                            : "text.secondary",
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Service Categories Detail - Fixed height and alignment */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={0} alignItems="stretch">
          {["vaccination", "healthCheckup", "medicinesSupplies"].map(
            (key, i) => {
              const titles = {
                vaccination: "Vaccination Schedule",
                healthCheckup: "Health Checkup Schedule",
                medicinesSupplies: "Medicines & Supplies",
              };
              const icons = {
                vaccination: (
                  <Vaccines sx={{ color: "#56D0DB", fontSize: 28 }} />
                ),
                healthCheckup: (
                  <LocalHospital sx={{ color: "#56D0DB", fontSize: 28 }} />
                ),
                medicinesSupplies: (
                  <MedicalServices sx={{ color: "#56D0DB", fontSize: 28 }} />
                ),
              };

              return (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  key={i}
                  sx={{ display: "flex" }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flexGrow: 1,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {icons[key]}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#1a237e", ml: 1 }}
                      >
                        {titles[key]}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <List sx={{ p: 0 }}>
                        {serviceCategories[key].map((item, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {icons[key]}
                            </ListItemIcon>
                            <ListItemText
                              primary={item}
                              primaryTypographyProps={{
                                fontSize: "0.9rem",
                                color: "text.primary",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 3,
                        background:
                          "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
                        color: "white",
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      {key === "vaccination"
                        ? "SEE VACCINATION SCHEDULE"
                        : key === "healthCheckup"
                        ? "SEE CHECKUP SCHEDULE"
                        : "SEE MEDICAL SUPPLIES"}
                    </Button>
                  </Paper>
                </Grid>
              );
            }
          )}
        </Grid>
      </Container>

      {/* Get Started */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            background: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Get started with <span style={{ color: "#FFE082" }}>MedLearn</span>
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of schools already using our comprehensive medical
            management system. Start managing student health records,
            vaccination schedules, and medical monitoring with ease.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: "#2D77C1",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "#FFE082",
                color: "#2D77C1",
              },
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Container>

      <Footer />
    </div>
  );
}
