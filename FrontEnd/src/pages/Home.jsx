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
      title: "Tổng số học sinh",
      number: "1,245",
      note: "+15 trong tháng này",
      icon: <People sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#4CAF50",
    },
    {
      title: "Sự kiện y tế",
      number: "24",
      note: "+2 trong tuần này",
      icon: <Info sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#FF9800",
    },
    {
      title: "Tiêm chủng",
      number: "85%",
      note: "Tỷ lệ hoàn thành",
      icon: <Vaccines sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#4CAF50",
    },
    {
      title: "Khám sức khỏe",
      number: "12",
      note: "Lịch hẹn hôm nay",
      icon: <Assignment sx={{ color: "white", fontSize: 24 }} />,
      noteColor: "#2196F3",
    },
  ];

  // Recent health events
  const recentEvents = [
    {
      title: "Học sinh bị sốt nhẹ",
      time: "Lớp 5A • Hôm nay",
      type: "fever",
    },
    {
      title: "Tiêm vắc xin",
      time: "Lớp 3B • 2 ngày trước",
      type: "vaccine",
    },
    {
      title: "Khám sức khỏe định kỳ",
      time: "Lớp 7C • 3 ngày trước",
      type: "checkup",
    },
    {
      title: "Học sinh đau bụng",
      time: "Lớp 4A • 5 ngày trước",
      type: "pain",
    },
  ];

  // Main services
  const mainServices = [
    {
      title: "Tư vấn với bác sĩ",
      description: "Kết nối với đội ngũ y tế để được tư vấn và hỗ trợ sức khỏe",
      icon: <MedicalServices sx={{ fontSize: 48, color: "#1976D2" }} />,
      bgColor: "#E3F2FD",
    },
    {
      title: "Tiêm chủng",
      description: "Quản lý và theo dõi lịch tiêm chủng cho tất cả học sinh",
      icon: <Vaccines sx={{ fontSize: 48, color: "white" }} />,
      bgColor: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
    },
    {
      title: "Chăm sóc sức khỏe",
      description: "Giám sát sức khỏe toàn diện và quản lý hồ sơ y tế",
      icon: <HealthAndSafety sx={{ fontSize: 48, color: "#2E7D32" }} />,
      bgColor: "#E8F5E8",
    },
  ];

  // Service categories
  const serviceCategories = {
    vaccination: [
      "Tiêm ngừa cúm mùa (15/9 - 15/10)",
      "Vắc xin MMR (20/9 - 12/10)",
      "Vắc xin thủy đậu (18/9 - 2/10)",
    ],
    healthCheckup: [
      "Khám sức khỏe định kỳ (08/03/2019 - Hiện tại)",
      "Kiểm tra thị lực (15/2 - Hiện tại)",
      "Kiểm tra răng miệng (20/2 - Hiện tại)",
    ],
    medicinesSupplies: [
      "Thuốc hạ sốt (7 mục)",
      "Băng gạc y tế (2 mục)",
      "Dung dịch sát khuẩn (3 mục)",
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
              Hệ thống Y tế Trường học <br />
              <span className="highlight">Toàn diện</span>
            </h1>
            <p>
              Giải pháp toàn diện để quản lý sức khỏe học sinh, lịch tiêm chủng
              và theo dõi y tế tại trường học
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
              Tìm hiểu thêm
            </Button>
          </div>
          <div className="hero-image">
            <img src={DoctorHomePageImage} alt="Nhóm bác sĩ" />
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
            Tổng quan hệ thống
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý sức khỏe học sinh hiệu quả và toàn diện
          </Typography>
        </Box>

        <Grid container spacing={8} justifyContent="center">
          {overviewStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  width: "110%",
                  height: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
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
                    gap: 10,
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
        <Grid container spacing={4} alignItems="stretch">
          {/* Student Health Statistics */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Assessment sx={{ color: "#8B5CF6", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thống kê Sức khỏe Học sinh
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Xu hướng thống kê sức khỏe học sinh theo tháng
              </Typography>

              {/* Placeholder for chart */}
              <Box
                sx={{
                  height: 300,
                  width: 700,
                  bgcolor: "#F0F9FF",
                  borderRadius: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Assessment sx={{ fontSize: 60, color: "#56D0DB", mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Thống kê Sức khỏe Học Sinh
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Health Events */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                width: "105%",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Sự kiện Sức khỏe Gần đây
                </Typography>
                <IconButton>
                  <ArrowForward />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Các hoạt động sức khỏe xảy ra trong tuần qua
              </Typography>

              <List sx={{ p: 0 }}>
                {recentEvents.map((event, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 1.5,
                      py: 1.5,
                      borderBottom:
                        index !== recentEvents.length - 1
                          ? "1px solid #ccc"
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
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
            Các <span style={{ color: "#56D0DB" }}>Dịch vụ Chính</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "text.secondary" }}
          >
            Danh mục dịch vụ
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* First row - 2 services with gap */}
          <Grid container spacing={10} sx={{ justifyContent: "center" }}>
            {mainServices.slice(0, 2).map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    width: "100%",
                    height: "350px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",
                    background: service.bgColor,
                    borderRadius: 4,
                    cursor: "pointer",
                    border: "none",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    position: "relative",
                    overflow: "hidden",
                    transition:
                      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        index === 1
                          ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
                          : "linear-gradient(135deg, rgba(86,208,219,0.05) 0%, rgba(45,119,193,0.05) 100%)",
                      zIndex: 1,
                    },
                    p: 4,
                  }}
                >
                  {/* Icon Section */}
                  <Box
                    sx={{
                      zIndex: 2,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      pt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background:
                          index === 1
                            ? "rgba(255,255,255,0.15)"
                            : index === 0
                            ? "rgba(25,118,210,0.1)"
                            : "rgba(46,125,50,0.1)",
                        backdropFilter: "blur(10px)",
                        border:
                          index === 1
                            ? "2px solid rgba(255,255,255,0.2)"
                            : index === 0
                            ? "2px solid rgba(25,118,210,0.1)"
                            : "2px solid rgba(46,125,50,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "rotate(10deg) scale(1.1)",
                          background:
                            index === 1
                              ? "rgba(255,255,255,0.25)"
                              : index === 0
                              ? "rgba(25,118,210,0.15)"
                              : "rgba(46,125,50,0.15)",
                        },
                      }}
                    >
                      {React.cloneElement(service.icon, {
                        sx: {
                          fontSize: 40,
                          color:
                            index === 1
                              ? "white"
                              : index === 0
                              ? "#1976D2"
                              : "#2E7D32",
                        },
                      })}
                    </Box>
                  </Box>

                  {/* Content Section */}
                  <Box
                    sx={{
                      zIndex: 2,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      px: 2,
                      pb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        color: index === 1 ? "white" : "#1a237e",
                        fontSize: "1.3rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          index === 1 ? "rgba(255,255,255,0.9)" : "#4a5568",
                        lineHeight: 1.5,
                        fontSize: "0.9rem",
                        textAlign: "center",
                        maxWidth: "200px",
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>

                  {/* Decorative element */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        index === 1
                          ? "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)"
                          : "linear-gradient(90deg, #56D0DB 0%, #2D77C1 100%)",
                      zIndex: 2,
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Second row - 1 service centered */}
          <Grid container sx={{ justifyContent: "center" }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  width: "100%",
                  height: "350px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "center",
                  background: mainServices[2].bgColor,
                  borderRadius: 4,
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  position: "relative",
                  overflow: "hidden",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    transform: "translateY(-12px) scale(1.02)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(86,208,219,0.05) 0%, rgba(45,119,193,0.05) 100%)",
                    zIndex: 1,
                  },
                  p: 4,
                }}
              >
                {/* Icon Section */}
                <Box
                  sx={{
                    zIndex: 2,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "rgba(46,125,50,0.1)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(46,125,50,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "rotate(10deg) scale(1.1)",
                        background: "rgba(46,125,50,0.15)",
                      },
                    }}
                  >
                    {React.cloneElement(mainServices[2].icon, {
                      sx: {
                        fontSize: 40,
                        color: "#2E7D32",
                      },
                    })}
                  </Box>
                </Box>

                {/* Content Section */}
                <Box
                  sx={{
                    zIndex: 2,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    px: 2,
                    pb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: "#1a237e",
                      fontSize: "1.3rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {mainServices[2].title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#4a5568",
                      lineHeight: 1.5,
                      fontSize: "0.9rem",
                      textAlign: "center",
                      maxWidth: "200px",
                    }}
                  >
                    {mainServices[2].description}
                  </Typography>
                </Box>

                {/* Decorative element */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #56D0DB 0%, #2D77C1 100%)",
                    zIndex: 2,
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Service Categories Detail - Fixed height and alignment */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={0} alignItems="stretch">
          {["vaccination", "healthCheckup", "medicinesSupplies"].map(
            (key, i) => {
              const titles = {
                vaccination: "Lịch Tiêm Chủng",
                healthCheckup: "Lịch Khám Sức Khỏe",
                medicinesSupplies: "Thuốc & Vật Tư Y Tế",
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
                        ? "XEM LỊCH TIÊM CHỦNG"
                        : key === "healthCheckup"
                        ? "XEM LỊCH KHÁM SỨC KHỎE"
                        : "XEM VẬT TƯ Y TẾ"}
                    </Button>
                  </Paper>
                </Grid>
              );
            }
          )}
        </Grid>
      </Container>

      {/* Our Doctors Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Text and Doctor Card */}
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ color: "#555" }}>
              Đội ngũ bác sĩ
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              <span style={{ color: "#56D0DB" }}>Bác sĩ</span> đủ chuyên môn
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Được phụ trách trực tiếp bởi bác sĩ đa khoa và các bác sĩ chuyên
              khoa giàu kinh nghiệm.
            </Typography>

            {/* Doctor Card */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                width: "100%",
                maxWidth: 350,
                background: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
                color: "white",
              }}
            >
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Chuyên khoa chỉnh hình
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                Bác sĩ James Wellington
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{ mt: 2, color: "white", textTransform: "none" }}
              >
                Xem thêm
              </Button>
            </Paper>

            {/* View All Doctors button */}
            <Button
              variant="contained"
              sx={{
                mt: 4,
                background: "linear-gradient(135deg, #56D0DB 0%, #2D77C1 100%)",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 30,
                textTransform: "none",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Xem tất cả bác sĩ
            </Button>
          </Grid>

          {/* Doctor Avatar Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 350,
                mx: "auto",
              }}
            >
              <Avatar
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Doctor"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "50%",
                  border: "8px solid white",
                  boxShadow: 3,
                }}
              />
              {/* Navigation arrows */}
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: -20,
                  transform: "translateY(-50%)",
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <ArrowForward
                  sx={{ transform: "rotate(180deg)", color: "#56D0DB" }}
                />
              </IconButton>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: -20,
                  transform: "translateY(-50%)",
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <ArrowForward sx={{ color: "#56D0DB" }} />
              </IconButton>

              {/* Dot indicators */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                {[0, 1, 2, 3].map((dot, i) => (
                  <FiberManualRecord
                    key={i}
                    sx={{
                      fontSize: 10,
                      color: i === 3 ? "#2D77C1" : "#B0BEC5",
                      mx: 0.5,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
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
            Bắt đầu với <span style={{ color: "#FFE082" }}>MedLearn</span>
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Tham gia cùng hàng nghìn trường học đã sử dụng hệ thống quản lý y tế
            toàn diện của chúng tôi. Bắt đầu quản lý hồ sơ sức khỏe học sinh,
            lịch tiêm chủng và giám sát y tế một cách dễ dàng.
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
            Bắt đầu ngay
          </Button>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
}
