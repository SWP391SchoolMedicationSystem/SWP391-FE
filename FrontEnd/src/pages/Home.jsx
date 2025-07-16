import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import DoctorHomePageImage from "../assets/images/homepage-hero-image.png";
import "../css/HomePage.css";
import { blogService } from "../services/blogService";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Close,
  Star,
  Info,
  Assignment,
  EventNote,
  Healing,
  LocalPharmacy,
  Facebook,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userInfoString = localStorage.getItem('userInfo');
    
    if (token && userInfoString) {
      try {
        const parsedUserInfo = JSON.parse(userInfoString);
        setUserInfo(parsedUserInfo);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user info:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fallback mock data for blogs
  const mockBlogs = [
    {
      blogId: 1,
      title: "Hướng dẫn chăm sóc sức khỏe học sinh mùa đông",
      content: "Mùa đông là thời điểm học sinh dễ mắc các bệnh về đường hô hấp. Để bảo vệ sức khỏe con em, phụ huynh cần lưu ý những điều sau: Giữ ấm cơ thể, uống đủ nước, ăn nhiều trái cây giàu vitamin C, và thường xuyên rửa tay sạch sẽ. Ngoài ra, nên đảm bảo trẻ ngủ đủ giấc và tập thể dục đều đặn để tăng cường sức đề kháng.",
      approvedBy: "Bác sĩ Nguyễn Thị Lan",
      image: null
    },
    {
      blogId: 2,
      title: "Tầm quan trọng của việc tiêm chủng đầy đủ",
      content: "Tiêm chủng là biện pháp phòng ngừa bệnh tật hiệu quả nhất. Trẻ em cần được tiêm chủng đầy đủ theo lịch để tránh các bệnh truyền nhiễm nguy hiểm như bại liệt, ho gà, sởi, quai bị. Phụ huynh cần theo dõi sổ tiêm chủng và đưa trẻ đi tiêm đúng lịch hẹn.",
      approvedBy: "Y tá Trần Văn Minh",
      image: null
    },
    {
      blogId: 3,
      title: "Dinh dưỡng cân bằng cho học sinh",
      content: "Chế độ dinh dưỡng cân bằng là yếu tố quan trọng giúp học sinh phát triển toàn diện. Bữa ăn cần đảm bảo đủ các nhóm thực phẩm: tinh bột, protein, chất béo, vitamin và khoáng chất. Nên hạn chế đồ ăn vặt, nước ngọt và khuyến khích uống nhiều nước lọc.",
      approvedBy: "Chuyên gia dinh dưỡng Lê Thị Hương",
      image: null
    },
    {
      blogId: 4,
      title: "Phòng chống cận thị ở học sinh",
      content: "Tỷ lệ cận thị ở học sinh ngày càng tăng do thời gian sử dụng thiết bị điện tử nhiều và ánh sáng không đủ. Để phòng ngừa, cần đảm bảo ánh sáng đủ khi học, nghỉ ngơi mắt 20 giây sau mỗi 20 phút nhìn gần, và tham gia các hoạt động ngoài trời.",
      approvedBy: "Bác sĩ nhãn khoa Phạm Đức Thành",
      image: null
    },
    {
      blogId: 5,
      title: "Xử lý các tình huống y tế khẩn cấp tại trường",
      content: "Khi xảy ra tình huống y tế khẩn cấp, việc xử lý nhanh chóng và đúng cách là rất quan trọng. Giáo viên và nhân viên y tế cần được đào tạo về sơ cứu cơ bản, biết cách liên hệ với cơ sở y tế và thông báo cho phụ huynh kịp thời.",
      approvedBy: "Y tá trưởng Nguyễn Thị Mai",
      image: null
    },
    {
      blogId: 6,
      title: "Tầm quan trọng của việc khám sức khỏe định kỳ",
      content: "Khám sức khỏe định kỳ giúp phát hiện sớm các vấn đề sức khỏe và có biện pháp can thiệp kịp thời. Học sinh nên được khám sức khỏe ít nhất 1 lần/năm học, bao gồm đo chiều cao, cân nặng, kiểm tra thị lực, nghe tim phổi và các xét nghiệm cần thiết.",
      approvedBy: "Bác sĩ Hoàng Văn Đức",
      image: null
    }
  ];

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogsLoading(true);
      setBlogsError(null);
      try {
        console.log('Fetching blogs...');
        const blogsData = await blogService.getAllBlogs();
        console.log('Blog data received:', blogsData);
        
        // Check if data is array or has data property
        if (Array.isArray(blogsData)) {
          setBlogs(blogsData);
        } else if (blogsData && Array.isArray(blogsData.data)) {
          setBlogs(blogsData.data);
        } else if (blogsData && typeof blogsData === 'object') {
          // If it's an object, try to extract array from common property names
          const blogArray = blogsData.blogs || blogsData.items || blogsData.result || [];
          setBlogs(Array.isArray(blogArray) ? blogArray : []);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogsError(error.message || 'Có lỗi xảy ra khi tải bài viết');
        // Use fallback data when API fails
        console.log('Using fallback blog data...');
        setBlogs(mockBlogs);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleGetStartedClick = () => {
    if (isLoggedIn && userInfo?.role === 'Parent') {
      navigate('/parent');
    } else {
      // If not logged in, redirect to login page
      navigate('/');
    }
  };

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    setBlogModalOpen(true);
  };

  const handleCloseBlogModal = () => {
    setBlogModalOpen(false);
    setSelectedBlog(null);
  };

  const retryFetchBlogs = async () => {
    setBlogsLoading(true);
    setBlogsError(null);
    try {
      console.log('Retrying blog fetch...');
      const blogsData = await blogService.getAllBlogs();
      console.log('Blog data received:', blogsData);
      
      // Check if data is array or has data property
      if (Array.isArray(blogsData)) {
        setBlogs(blogsData);
      } else if (blogsData && Array.isArray(blogsData.data)) {
        setBlogs(blogsData.data);
      } else if (blogsData && typeof blogsData === 'object') {
        // If it's an object, try to extract array from common property names
        const blogArray = blogsData.blogs || blogsData.items || blogsData.result || [];
        setBlogs(Array.isArray(blogArray) ? blogArray : []);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error retrying blog fetch:', error);
      setBlogsError(error.message || 'Có lỗi xảy ra khi tải bài viết');
      // Use fallback data when retry also fails
      console.log('Using fallback blog data after retry...');
      setBlogs(mockBlogs);
    } finally {
      setBlogsLoading(false);
    }
  };

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

  const mainServices = [
    {
      title: "Hồ sơ sức khỏe",
      description: "Theo dõi và quản lý hồ sơ y tế học sinh",
      icon: <MedicalServices sx={{ color: '#2f5148', fontSize: 40 }} />,
    },
    {
      title: "Tiêm chủng",
      description: "Lịch tiêm chủng và theo dõi",
      icon: <Vaccines sx={{ color: '#2f5148', fontSize: 40 }} />,
    },
    {
      title: "Khám sức khỏe",
      description: "Khám định kỳ và theo dõi sức khỏe",
      icon: <HealthAndSafety sx={{ color: '#2f5148', fontSize: 40 }} />,
    },
    {
      title: "Báo cáo",
      description: "Báo cáo tình trạng sức khỏe",
      icon: <Assessment sx={{ color: '#2f5148', fontSize: 40 }} />,
    },
  ];

  const serviceCategories = [
    {
      category: "Quản lý hồ sơ",
      services: [
        {
          title: "Hồ sơ sức khỏe học sinh",
          description: "Lưu trữ và quản lý thông tin y tế của học sinh",
          icon: <MedicalServices sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
        {
          title: "Theo dõi tình trạng sức khỏe",
          description: "Cập nhật thường xuyên về tình trạng sức khỏe",
          icon: <MonitorHeart sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
        {
          title: "Lịch sử khám bệnh",
          description: "Ghi nhận và theo dõi lịch sử khám bệnh",
          icon: <EventNote sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
      ],
    },
    {
      category: "Dịch vụ y tế",
      services: [
        {
          title: "Tiêm chủng",
          description: "Quản lý lịch tiêm chủng cho học sinh",
          icon: <Vaccines sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
        {
          title: "Khám sức khỏe định kỳ",
          description: "Tổ chức khám sức khỏe định kỳ cho học sinh",
          icon: <LocalHospital sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
        {
          title: "Xử lý y tế khẩn cấp",
          description: "Hỗ trợ y tế khẩn cấp trong trường học",
          icon: <Healing sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
      ],
    },
    {
      category: "Quản lý thuốc",
      services: [
        {
          title: "Quản lý thuốc tại trường",
          description: "Theo dõi và quản lý thuốc trong trường học",
          icon: <LocalPharmacy sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
        {
          title: "Phát thuốc cho học sinh",
          description: "Quản lý việc phát thuốc theo đơn",
          icon: <MedicalServices sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
        {
          title: "Theo dõi thuốc cá nhân",
          description: "Quản lý thuốc cá nhân của học sinh",
          icon: <Assignment sx={{ color: '#2f5148', fontSize: 32 }} />,
        },
      ],
    },
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
              onClick={handleGetStartedClick}
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

      {/* System Overview - Beautiful Enhanced Design */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
              variant="h3"
              sx={{
                fontWeight: "700",
                color: '#2f5148',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              🏥 Tổng quan hệ thống
          </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                fontWeight: '500',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Quản lý sức khỏe học sinh hiệu quả và toàn diện với công nghệ hiện đại
          </Typography>
        </Box>

          <Grid container spacing={4} justifyContent="center">
          {overviewStats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: "24px",
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  "&:hover": {
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                      transform: "translateY(-8px) scale(1.02)",
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(135deg, #2f5148 0%, #1e3a34 100%)',
                      zIndex: 1,
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        mx: 'auto',
                        background: 'linear-gradient(135deg, #2f5148 0%, #1e3a34 100%)',
                        boxShadow: '0 8px 24px rgba(47, 81, 72, 0.3)',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '100%',
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite',
                        },
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'translate(-50%, -50%) scale(1)',
                            opacity: 1,
                          },
                          '100%': {
                            transform: 'translate(-50%, -50%) scale(1.4)',
                            opacity: 0,
                          },
                        },
                  }}
                >
                  {stat.icon}
                </Box>

                  <Typography
                      variant="h2"
                    sx={{
                        fontWeight: "700",
                        color: '#2f5148',
                      mb: 1,
                        fontSize: { xs: '2.5rem', md: '3rem' },
                        lineHeight: 1.2,
                    }}
                  >
                    {stat.number}
                  </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color: "#2f5148",
                        fontWeight: "600",
                        mb: 2,
                        fontSize: '1.1rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {stat.title}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        background: 'rgba(47, 81, 72, 0.1)',
                        border: '1px solid rgba(47, 81, 72, 0.2)',
                      }}
                    >
                                              <FiberManualRecord
                          sx={{
                            fontSize: 10,
                            color: '#2f5148',
                            animation: 'blink 1.5s infinite',
                          }}
                        />
                  <Typography
                    variant="body2"
                    sx={{
                            color: '#2f5148',
                            fontSize: "0.85rem",
                            fontWeight: "600",
                    }}
                  >
                    {stat.note}
                  </Typography>
                    </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>

      {/* Health Statistics & Recent Events */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={8} justifyContent="center">
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: "24px",
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                p: 4,
                height: "480px",
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #2f5148 0%, #1e3a34 100%)',
                  zIndex: 1,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2f5148 0%, #1e3a34 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Assessment sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "600", color: "#2f5148" }}
                >
                  📊 Thống kê sức khỏe
                </Typography>
              </Box>
              
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "350px",
                  backgroundColor: "rgba(47, 81, 72, 0.05)",
                  borderRadius: "16px",
                  border: "2px dashed rgba(47, 81, 72, 0.2)",
                  position: 'relative',
                  '&::before': {
                    content: '"📊"',
                    fontSize: '4rem',
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.3,
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "#2f5148", 
                      fontWeight: '600',
                      mb: 2,
                    }}
                  >
                    Biểu đồ sẽ được tích hợp
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#64748b",
                      fontStyle: 'italic',
                    }}
                  >
                    Thống kê chi tiết về sức khỏe học sinh
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5.5 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: "24px",
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                p: 4,
                height: "480px",
                position: 'relative',
                overflow: 'hidden',
                                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #2f5148 0%, #1e3a34 100%)',
                    zIndex: 1,
                  }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2f5148 0%, #1e3a34 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Event sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "600", color: "#2f5148" }}
                >
                  ⚡ Hoạt động gần đây
                </Typography>
              </Box>
              
              <Box sx={{ maxHeight: '380px', overflowY: 'auto', pr: 1 }}>
                <List sx={{ p: 0 }}>
                  {recentEvents.map((event, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        backgroundColor: "rgba(47, 81, 72, 0.05)",
                        borderRadius: "16px",
                        mb: 2,
                        p: 3,
                        border: "1px solid rgba(47, 81, 72, 0.1)",
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: "rgba(47, 81, 72, 0.1)",
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, #2f5148 0%, #1e3a34 100%)",
                            boxShadow: '0 4px 12px rgba(47, 81, 72, 0.3)',
                          }}
                        >
                          <Event sx={{ color: "white", fontSize: 22 }} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={event.time}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontWeight: "600",
                            color: "#2f5148",
                            fontSize: "1rem",
                            mb: 0.5,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "#64748b",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Blog Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box className="section-title">
          <h2>📚 Tin tức & Bài viết</h2>
          <p>Cập nhật những thông tin hữu ích về sức khỏe học đường và chăm sóc trẻ em.</p>
          </Box>
          
          {/* Warning message when using fallback data */}
          {blogsError && blogs.length > 0 && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffecb5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography sx={{ fontSize: '1.2rem' }}>⚠️</Typography>
              <Typography variant="body2" sx={{ color: '#664d00' }}>
                Đang hiển thị dữ liệu mẫu do không thể kết nối với server. Vui lòng thử lại sau.
              </Typography>
            </Box>
          )}
          
        {blogsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: 'var(--primary-color)' }}>
              Đang tải bài viết...
            </Typography>
          </Box>
        ) : blogsError ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '3rem' }}>⚠️</Typography>
            </Box>
            <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: '600', mb: 2 }}>
              Lỗi tải bài viết
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '400px', mx: 'auto', mb: 3 }}>
              {blogsError}
            </Typography>
            <Button
              variant="outlined"
              onClick={retryFetchBlogs}
              sx={{
                borderColor: '#2f5148',
                color: '#2f5148',
                '&:hover': {
                  backgroundColor: '#2f5148',
                  color: 'white',
                },
              }}
            >
              Thử lại
            </Button>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            overflowX: 'auto', 
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                background: '#a8a8a8',
              },
            },
          }}>
            {blogs.slice(0, 6).map((blog) => (
              <Box key={blog.blogId} sx={{ minWidth: '350px', flexShrink: 0 }}>
                <Card
                  sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                    background: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e3f2fd",
                    "&:hover": {
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Blog Image */}
                  <Box
                    sx={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '16px 16px 0 0',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    {blog.image ? (
                      <>
                        <img
                          src={blog.image}
                          alt={blog.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        {/* Fallback placeholder for image error */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                            }
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: '3rem',
                              color: 'var(--primary-color)',
                              zIndex: 1,
                              position: 'relative',
                            }}
                          >
                            📄
                          </Box>
                        </Box>
                      </>
                    ) : (
                      /* Default placeholder when no image */
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                          }
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: '3rem',
                            color: 'var(--primary-color)',
                            zIndex: 1,
                            position: 'relative',
                          }}
                        >
                          📄
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: "bold",
                        color: "#1a237e",
                        mb: 2,
                        fontSize: "1.2rem",
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        lineHeight: 1.6,
                        fontSize: "0.9rem",
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                        flexGrow: 1,
                      }}
                    >
                      {blog.content}
                    </Typography>
                    
                    {blog.approvedBy && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "var(--primary-color)",
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          mb: 2,
                        }}
                      >
                        Được duyệt bởi: {blog.approvedBy}
                      </Typography>
                    )}
                    
                    {/* Read More Button */}
                    <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleReadMore(blog)}
                    sx={{
                          borderColor: 'var(--primary-color)',
                          color: 'var(--primary-color)',
                        fontWeight: 'bold',
                          textTransform: 'none',
                          borderRadius: '8px',
                          px: 3,
                          py: 1,
                        '&:hover': {
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            borderColor: 'var(--primary-color)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Đọc thêm
                  </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
        
        {blogs.length === 0 && !blogsLoading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                backgroundColor: 'rgba(47, 81, 72, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '3rem' }}>📝</Typography>
            </Box>
            <Typography variant="h5" sx={{ color: '#2f5148', fontWeight: '600', mb: 2 }}>
              Chưa có bài viết nào
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '400px', mx: 'auto' }}>
              Các bài viết y tế và tin tức sức khỏe sẽ được cập nhật sớm nhất có thể.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Main Services */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box className="section-title">
          <h2>Dịch vụ chính</h2>
          <p>Khám phá các dịch vụ y tế học đường toàn diện của chúng tôi.</p>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {mainServices.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                className="service-card"
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "16px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e3f2fd",
                  "&:hover": {
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-5px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ mb: 2 }}>{service.icon}</Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#1a237e",
                    mb: 2,
                    fontSize: "1.2rem",
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    lineHeight: 1.6,
                    fontSize: "0.9rem",
                  }}
                >
                  {service.description}
                </Typography>
              </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

      {/* Service Categories Detail */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box className="section-title">
          <h2>Danh mục dịch vụ chi tiết</h2>
          <p>Tìm hiểu chi tiết về từng danh mục dịch vụ y tế học đường.</p>
          </Box>
        
        {serviceCategories.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                mb: 3,
                textAlign: "center",
                fontSize: "1.8rem",
              }}
            >
              {category.category}
            </Typography>
          <Grid container spacing={4}>
              {category.services.map((service, serviceIndex) => (
                <Grid size={{ xs: 12, md: 4 }} key={serviceIndex}>
                  <Card
                    sx={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #e3f2fd",
                      "&:hover": {
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                        transform: "translateY(-3px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          gap: 2,
                        }}
                      >
                        {service.icon}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#1a237e",
                            fontSize: "1.1rem",
                          }}
                        >
                          {service.title}
                    </Typography>
                  </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          lineHeight: 1.6,
                          fontSize: "0.9rem",
                        }}
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
              </Grid>
            ))}
          </Grid>
          </Box>
        ))}
        </Container>

      {/* Nurses Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box className="section-title">
          <h2>Đội ngũ y tế chuyên nghiệp</h2>
          <p>Gặp gỡ các y tá học đường giàu kinh nghiệm của chúng tôi.</p>
          </Box>
        <Grid container spacing={4} justifyContent="center">
            {nurses.map((nurse, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e3f2fd",
                  "&:hover": {
                    boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-5px)",
                  },
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{ 
                      width: 80,
                      height: 80,
                      margin: "0 auto",
                      mb: 2,
                      bgcolor: "var(--primary-color)",
                      fontSize: "2rem",
                      fontWeight: "bold",
                      }}
                    >
                      {nurse.initials}
                    </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#1a237e",
                      mb: 1,
                      fontSize: "1.2rem",
                    }}
                  >
                      {nurse.name}
                    </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                      {nurse.specialty}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

      {/* About Us Section */}
      <section id="about-us" className="about-us-section">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box className="section-title">
            <h2>📖 Giới thiệu về MedLearn</h2>
            <p>Tìm hiểu về sứ mệnh và tầm nhìn của chúng tôi trong việc chăm sóc sức khỏe học đường.</p>
          </Box>
          
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e3f2fd",
                  p: 4,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#1a237e",
                    mb: 3,
                    fontSize: "2rem",
                  }}
                >
                  Sứ mệnh của chúng tôi
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                    mb: 3,
                  }}
                >
                  MedLearn được tạo ra với mục tiêu mang đến một hệ thống quản lý y tế học đường toàn diện, 
                  hiện đại và dễ sử dụng. Chúng tôi cam kết tạo ra một môi trường học tập an toàn và khỏe mạnh 
                  cho tất cả các em học sinh.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                  }}
                >
                  Với đội ngũ chuyên gia y tế và công nghệ giàu kinh nghiệm, chúng tôi không ngừng phát triển 
                  và cải tiến sản phẩm để đáp ứng nhu cầu ngày càng cao của nhà trường và phụ huynh.
                </Typography>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#1a237e",
                    mb: 3,
                    fontSize: "2rem",
                  }}
                >
                  Giá trị cốt lõi
                </Typography>
                
                <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      sx={{
                        p: 4,
                        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        borderRadius: "12px",
                        textAlign: "center",
                        border: "none",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                        }
                      }}
                    >
                      <Box sx={{ fontSize: "4rem", mb: 3 }}>🏥</Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#1565c0", mb: 2 }}
                      >
                        Chuyên nghiệp
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#424242", lineHeight: 1.6 }}>
                        Đội ngũ y tế chuyên nghiệp với nhiều năm kinh nghiệm
                      </Typography>
                    </Paper>
                </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      sx={{
                        p: 4,
                        background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                        borderRadius: "12px",
                        textAlign: "center",
                        border: "none",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                        }
                      }}
                    >
                      <Box sx={{ fontSize: "4rem", mb: 3 }}>🔒</Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#2e7d32", mb: 2 }}
                      >
                        Bảo mật
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#424242", lineHeight: 1.6 }}>
                        Dữ liệu được bảo mật tuyệt đối theo tiêu chuẩn quốc tế
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      sx={{
                        p: 4,
                        background: "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
                        borderRadius: "12px",
                        textAlign: "center",
                        border: "none",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                        }
                      }}
                    >
                      <Box sx={{ fontSize: "4rem", mb: 3 }}>⚡</Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#f57c00", mb: 2 }}
                      >
                        Hiệu quả
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#424242", lineHeight: 1.6 }}>
                        Xử lý nhanh chóng, chính xác và đáng tin cậy
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      sx={{
                        p: 4,
                        background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)",
                        borderRadius: "12px",
                        textAlign: "center",
                        border: "none",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                        }
                      }}
                    >
                      <Box sx={{ fontSize: "4rem", mb: 3 }}>❤️</Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#c2185b", mb: 2 }}
                      >
                        Tận tâm
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#424242", lineHeight: 1.6 }}>
                        Luôn đặt sức khỏe học sinh lên hàng đầu
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Blog Modal */}
      <Dialog
        open={blogModalOpen}
        onClose={handleCloseBlogModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            pb: 2,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            {selectedBlog?.title}
              </Typography>
          <IconButton
            onClick={handleCloseBlogModal}
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 3 }}>
          {selectedBlog?.image && (
            <Box sx={{ mb: 3 }}>
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
          
          <Typography
            variant="body1"
            sx={{
              color: '#424242',
              lineHeight: 1.8,
              fontSize: '1rem',
              whiteSpace: 'pre-wrap',
            }}
          >
            {selectedBlog?.content}
          </Typography>
          
          {selectedBlog?.approvedBy && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                }}
              >
                Được duyệt bởi: {selectedBlog.approvedBy}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
            onClick={handleCloseBlogModal}
                variant="contained"
                sx={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
                  fontWeight: 'bold',
              textTransform: 'none',
                  '&:hover': {
                backgroundColor: '#0d9488',
                  },
                }}
              >
            Đóng
              </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}
