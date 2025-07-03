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
  EventNote,
  Healing,
  LocalPharmacy,
  FormatQuote,
  Facebook,
  Twitter,
  LinkedIn,
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
      title: "Tư vấn sức khỏe",
      description: "Kết nối với đội ngũ y tế để được tư vấn và hỗ trợ chuyên nghiệp.",
      icon: <Healing />,
      gradient: "linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)", // Blue
    },
    {
      title: "Quản lý tiêm chủng",
      description: "Theo dõi và quản lý lịch tiêm chủng cho học sinh một cách hiệu quả.",
      icon: <Vaccines />,
      gradient: "linear-gradient(135deg, #7986CB 0%, #5C6BC0 100%)", // Indigo
    },
    {
      title: "Quản lý thuốc",
      description: "Giám sát việc cấp phát và sử dụng thuốc tại trường học.",
      icon: <LocalPharmacy />,
      gradient: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)", // Green
    },
  ];

  // Service categories
  const serviceCategories = [
    {
      title: "Lịch tiêm chủng",
      icon: <Vaccines />,
      color: "#42A5F5", // Blue
      items: [
        "Tiêm ngừa cúm mùa (15/9 - 15/10)",
        "Vắc xin MMR (20/9 - 12/10)",
        "Vắc xin thủy đậu (18/9 - 2/10)",
      ],
    },
    {
      title: "Lịch khám sức khỏe",
      icon: <EventNote />,
      color: "#66BB6A", // Green
      items: [
        "Khám sức khỏe định kỳ (08/03 - 20/03)",
        "Kiểm tra thị lực (15/2 - 28/2)",
        "Kiểm tra răng miệng (20/2 - 05/03)",
      ],
    },
    {
      title: "Vật tư y tế",
      icon: <LocalPharmacy />,
      color: "#FFA726", // Orange
      items: [
        "Thuốc hạ sốt (còn 7 hộp)",
        "Băng gạc y tế (còn 2 cuộn)",
        "Dung dịch sát khuẩn (còn 3 chai)",
      ],
    },
  ];

  const testimonials = [
    {
      quote: "Hệ thống đã giúp chúng tôi quản lý sức khỏe của con em mình một cách dễ dàng và hiệu quả hơn rất nhiều. Giao diện thân thiện và thông tin luôn được cập nhật kịp thời.",
      author: "Chị Lan Anh",
      role: "Phụ huynh học sinh",
      avatar: "LA"
    },
    {
      quote: "Là một y tá trường học, tôi thực sự đánh giá cao công cụ này. Nó giúp tôi tiết kiệm thời gian và giảm thiểu sai sót trong việc theo dõi hồ sơ sức khỏe của học sinh.",
      author: "Cô Mai",
      role: "Y tá trường THCS ABC",
      avatar: "M"
    }
  ];

  const nurses = [
    {
      name: "Y tá Trần Lan Anh",
      specialty: "Y tá học đường",
      initials: "LA",
    },
    {
      name: "Y tá Lê Minh Khôi",
      specialty: "Y tá chuyên khoa",
      initials: "MK",
    },
    {
      name: "Y tá Phạm Thanh Thảo",
      specialty: "Y tá nhi khoa",
      initials: "TT",
    },
    {
        name: "Y tá Hoàng Đức Huy",
        specialty: "Y tá cấp cứu",
        initials: "HH",
    }
  ];

  return (
    <div className="home-page">
      <Header />
      {/* Hero Section - Using CSS approach */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-text">
            <h1>
              Chăm sóc <span className="highlight">sức khỏe học đường</span> chưa bao giờ dễ dàng hơn
            </h1>
            <p>
              Nền tảng quản lý y tế toàn diện, kết nối nhà trường, phụ huynh và nhân viên y tế để đảm bảo môi trường học tập an toàn và khỏe mạnh.
            </p>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: "50px",
                px: 5,
                py: 1.5,
                color: "white",
                fontWeight: "bold",
                background: "var(--gradient-primary)",
                boxShadow: "0 4px 12px rgba(80, 227, 194, 0.4)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(80, 227, 194, 0.5)",
                },
              }}
            >
              Bắt đầu ngay
            </Button>
          </div>
          <div className="hero-image">
            <img src={DoctorHomePageImage} alt="Đội ngũ y tế" />
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
                      "linear-gradient(135deg, #73ad67 0%, #2f5148 100%)",
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
                <Assessment sx={{ fontSize: 60, color: "#73ad67", mb: 2 }} />
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
      {/* Services Section */}
      <section className="services-section">
        <Container maxWidth="lg">
          <Box className="section-title">
            <h2>
              Các <span style={{ color: 'var(--secondary-color)' }}>dịch vụ chính</span>
            </h2>
            <p>Chúng tôi cung cấp các giải pháp toàn diện để quản lý sức khỏe học đường một cách hiệu quả nhất.</p>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {mainServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  borderRadius: 'var(--card-border-radius)', 
                  boxShadow: 'var(--card-hover-box-shadow)', 
                  p: 4, 
                  textAlign: 'center', 
                  height: '100%',
                  background: service.gradient,
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}>
                  <Box>
                    <Avatar sx={{ 
                      width: 80, 
                      height: 80, 
                      margin: '0 auto 24px', 
                      bgcolor: 'rgba(255, 255, 255, 0.2)' 
                    }}>
                      {React.cloneElement(service.icon, { sx: { fontSize: 48, color: 'white' } })}
                    </Avatar>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {service.title}
                    </Typography>
                    <Typography sx={{ opacity: 0.9 }}>
                      {service.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                        mt: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--text-dark-color)',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        '&:hover': {
                            bgcolor: 'white',
                        }
                    }}
                  >
                    Tìm hiểu thêm
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Schedule Section */}
      <section className="schedule-section">
        <Container maxWidth="lg">
          <Box className="section-title">
            <h2>
              Lịch trình &amp; <span style={{ color: "var(--primary-color)" }}>Kế hoạch</span>
            </h2>
            <p>
              Luôn cập nhật các hoạt động y tế và lịch trình chăm sóc sức khỏe sắp tới tại trường.
            </p>
          </Box>
          <Grid container spacing={4}>
            {serviceCategories.map((category, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper className="schedule-card" elevation={0} sx={{ borderLeftColor: category.color }}>
                  <Box className="schedule-card-header">
                    {React.cloneElement(category.icon, { className: 'icon', sx: { color: category.color } })}
                    <Typography variant="h5" component="h3">
                      {category.title}
                    </Typography>
                  </Box>
                  <List className="schedule-list">
                    {category.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <ListItemIcon>
                          <FiberManualRecord sx={{ fontSize: 10 }} />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Our Nurses Section - NEW GRID LAYOUT */}
      <section className="nurses-section-grid">
        <Container maxWidth="lg">
          <Box className="section-title" sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Gặp gỡ <span className="highlight">Đội ngũ Y tá</span> của chúng tôi
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', color: 'text.secondary' }}>
              Những chuyên gia tận tâm, luôn sẵn sàng chăm sóc sức khỏe cho học sinh với sự chuyên nghiệp và lòng nhân ái.
            </Typography>
          </Box>
          <Grid container spacing={5} sx={{ mt: 10 }}>
            {nurses.map((nurse, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="nurse-card">
                  <Box className="nurse-image-container">
                    <Avatar
                      alt={nurse.name}
                      sx={{ 
                        width: '100%', 
                        height: '100%',
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      }}
                    >
                      {nurse.initials}
                    </Avatar>
                  </Box>
                  <CardContent className="nurse-card-content">
                    <Box className="avatar-spacer" />
                    <Typography variant="h5" component="h3" className="nurse-name">
                      {nurse.name}
                    </Typography>
                    <Typography className="nurse-specialty">
                      {nurse.specialty}
                    </Typography>
                    <Box className="social-links">
                      <IconButton size="small"><Facebook fontSize="small" /></IconButton>
                      <IconButton size="small"><Twitter fontSize="small" /></IconButton>
                      <IconButton size="small"><LinkedIn fontSize="small" /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container maxWidth="lg">
          <Box className="section-title">
            <h2>Phụ huynh & nhân viên y tế nói gì?</h2>
            <p>Lắng nghe những chia sẻ thực tế từ người dùng của chúng tôi.</p>
          </Box>
          <Grid container spacing={5} justifyContent="center">
            {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={5} key={index}>
                    <Paper className="testimonial-card" elevation={0}>
                        <Box className="quote-icon">
                            <FormatQuote fontSize="inherit" />
                        </Box>
                        <Typography className="quote-text">"{testimonial.quote}"</Typography>
                        <Box className="testimonial-author">
                            <Avatar sx={{ bgcolor: 'var(--primary-color)', mb: 2, mx: 'auto' }}>{testimonial.avatar}</Avatar>
                            <Box className="author-info">
                                <Typography variant="h6" component="div" sx={{fontWeight: 'bold'}}>{testimonial.author}</Typography>
                                <Typography variant="body2" sx={{opacity: 0.8}}>{testimonial.role}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Get Started - New CTA Design */}
      <section className="cta-section">
        <Container maxWidth="lg">
          <Paper elevation={0}>
            <Box className="cta-content">
              <Typography variant="h3" component="h2">
                Bắt đầu với MedLearn ngay hôm nay
              </Typography>
              <Typography variant="body1">
                Tham gia cùng hàng nghìn trường học để nâng cao chất lượng chăm sóc sức khỏe học đường.
              </Typography>
            </Box>
            <Box className="cta-button-container">
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'var(--primary-color)',
                  px: { xs: 3, sm: 5 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                Đăng ký miễn phí
              </Button>
            </Box>
          </Paper>
        </Container>
      </section>
      <Footer />
    </div>
  );
}
