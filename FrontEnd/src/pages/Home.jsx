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
  CircularProgress,
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
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  
  // Thêm state cho thống kê từ API
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    vaccinationEvents: 0,
    scheduleDetails: 0,
    personalMedicines: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Thêm state cho staff từ API
  const [staffData, setStaffData] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  
  // Thêm state cho chart data
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

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


  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogsLoading(true);
      setBlogsError(null);
      try {
        console.log('Fetching published blogs...');
        const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/Blog/GetPublishedBlogs');
        const blogsData = await response.json();
        console.log('Published blog data received:', blogsData);
        
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
        console.error('Error fetching published blogs:', error);
        setBlogsError(error.message || 'Có lỗi xảy ra khi tải bài viết');
        // Set empty array when API fails
        setBlogs([]);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Fetch statistics from APIs
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        console.log('Fetching statistics from APIs...');
        
        // Gọi 4 API để lấy dữ liệu thống kê
        const [studentsRes, vaccinationRes, formsRes, medicineRes] = await Promise.all([
          fetch('https://api-schoolhealth.purintech.id.vn/api/Student/GetAllStudents'),
          fetch('https://api-schoolhealth.purintech.id.vn/api/VaccinationEvent?includeFiles=false'),
          fetch('https://api-schoolhealth.purintech.id.vn/api/Form'),
          fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicines')
        ]);

        // Xử lý response từ từng API
        const studentsData = await studentsRes.json();
        const vaccinationData = await vaccinationRes.json();
        const formsData = await formsRes.json();
        const medicineData = await medicineRes.json();

        // Đếm số lượng từ mỗi API
        const totalStudents = Array.isArray(studentsData) ? studentsData.length : 
                            (studentsData?.data && Array.isArray(studentsData.data)) ? studentsData.data.length : 0;
        
        // Xử lý dữ liệu học sinh để tạo chart data
        const studentsArray = Array.isArray(studentsData) ? studentsData : 
                            (studentsData?.data && Array.isArray(studentsData.data)) ? studentsData.data : [];
        
        console.log('Raw students data:', studentsArray.slice(0, 3)); // Log 3 học sinh đầu tiên
        
        // Tạo chart data theo lớp
        const chartDataByClass = {};
        studentsArray.forEach(student => {
          console.log('Student:', student.fullname, 'classname:', student.classname, 'class:', student.class, 'grade:', student.grade);
          const className = student.classname || 'Lớp khác';
          if (!chartDataByClass[className]) {
            chartDataByClass[className] = 0;
          }
          chartDataByClass[className]++;
        });
        
        // Chuyển đổi thành format cho chart
        const processedChartData = Object.keys(chartDataByClass).map(className => ({
          name: className,
          students: chartDataByClass[className]
        }));
        
        console.log('Chart data processed:', processedChartData);
        setChartData(processedChartData);
        
        const vaccinationEvents = Array.isArray(vaccinationData) ? vaccinationData.length : 
                                (vaccinationData?.data && Array.isArray(vaccinationData.data)) ? vaccinationData.data.length : 0;
        
        const totalForms = Array.isArray(formsData) ? 
          formsData.filter(form => !form.isDeleted).length : 
          (formsData?.data && Array.isArray(formsData.data)) ? 
          formsData.data.filter(form => !form.isDeleted).length : 0;
        
        const personalMedicines = Array.isArray(medicineData) ? medicineData.length : 
                                (medicineData?.data && Array.isArray(medicineData.data)) ? medicineData.data.length : 0;

        console.log('Statistics loaded:', {
          totalStudents,
          vaccinationEvents,
          totalForms,
          personalMedicines
        });

        setStatsData({
          totalStudents: totalStudents || 0,
          vaccinationEvents: vaccinationEvents || 0,
          scheduleDetails: totalForms || 0,
          personalMedicines: personalMedicines || 0
        });

      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Set default values to 0 if API fails
        setStatsData({
          totalStudents: 0,
          vaccinationEvents: 0,
          scheduleDetails: 0,
          personalMedicines: 0
        });
      } finally {
        setStatsLoading(false);
        setChartLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch staff data from API
  useEffect(() => {
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/Staff/nurses');
        const data = await response.json();
        
        let nursesArray = [];
        if (Array.isArray(data)) {
          nursesArray = data;
        } else if (data && Array.isArray(data.data)) {
          nursesArray = data.data;
        }
        
        // Xử lý dữ liệu nurses để tạo initials và format tên
        const processedNurses = nursesArray.map(nurse => {
          // Lấy tên từ fullname
          const fullName = nurse.fullname || 'Unknown';
          
          // Tạo initials từ tên
          const words = fullName.trim().split(' ').filter(word => word.length > 0);
          let initials = 'NA';
          
          if (words.length >= 2) {
            // Lấy chữ cái đầu của từ đầu và từ cuối
            initials = (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
          } else if (fullName.length >= 2) {
            // Nếu chỉ có 1 từ, lấy 2 chữ cái đầu
            initials = fullName.substring(0, 2).toUpperCase();
          } else if (fullName.length === 1) {
            // Nếu chỉ có 1 ký tự
            initials = fullName.toUpperCase();
          }
          
          const specialty = nurse.role || nurse.specialty || nurse.position || 'Y tá học đường';
          
          const processedItem = {
            name: fullName,
            specialty: specialty,
            initials: initials
          };
          
          return processedItem;
        });
        
        setStaffData(processedNurses);
      } catch (error) {
        console.error('Error fetching nurses data:', error);
        setStaffData([]);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaff();
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
      console.log('Retrying published blog fetch...');
      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/Blog/GetPublishedBlogs');
      const blogsData = await response.json();
      console.log('Published blog data received:', blogsData);
      
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
      console.error('Error retrying published blog fetch:', error);
      setBlogsError(error.message || 'Có lỗi xảy ra khi tải bài viết');
      // Set empty array when retry also fails
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  };

  // Statistics data from APIs
  const overviewStats = [
    {
      title: "Tổng số học sinh",
      number: statsLoading ? "..." : statsData.totalStudents.toLocaleString(),
      note: `+${Math.floor(statsData.totalStudents * 0.15)} trong tháng này`,
      icon: <People sx={{ fontSize: 24 }} />,
      noteColor: "#4CAF50",
    },
    {
      title: "Sự kiện tiêm chủng",
      number: statsLoading ? "..." : statsData.vaccinationEvents.toString(),
      note: `+${Math.floor(statsData.vaccinationEvents * 0.2)} trong tuần này`,
      icon: <Info sx={{ fontSize: 24 }} />,
      noteColor: "#FF9800",
    },
    {
      title: "Yêu cầu hỗ trợ",
      number: statsLoading ? "..." : statsData.scheduleDetails.toString(),
      note: "Tổng số yêu cầu",
      icon: <Assignment sx={{ fontSize: 24 }} />,
      noteColor: "#4CAF50",
    },
    {
      title: "Thuốc cá nhân",
      number: statsLoading ? "..." : statsData.personalMedicines.toString(),
      note: "Lịch hẹn hôm nay",
      icon: <LocalPharmacy sx={{ fontSize: 24 }} />,
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
                        background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
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
                  {React.cloneElement(stat.icon, { sx: { color: 'white', fontSize: 32 } })}
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
          <Grid size={{ xs: 12, md: 12 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: "24px",
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                p: 4,
                height: "600px",
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
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
                  📊 Thống kê học sinh
                </Typography>
              </Box>
              
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "490px",
                  backgroundColor: "rgba(47, 81, 72, 0.05)",
                  borderRadius: "16px",
                  border: "2px dashed rgba(47, 81, 72, 0.2)",
                  position: 'relative',
                }}
              >
                {chartLoading ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress sx={{ color: '#2f5148', mb: 2 }} />
                    <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Đang tải dữ liệu thống kê...
                    </Typography>
                  </Box>
                ) : (
                <ResponsiveContainer width="95%" height={520}>
                  <BarChart
                    data={chartLoading ? [] : chartData}
                    margin={{ top: 16, right: 32, left: 32, bottom: 8 }}
                    barCategoryGap={"20%"}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontWeight: 600, fill: '#2f5148' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontWeight: 500, fill: '#64748b', fontSize: 13 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontWeight: 500 }} />
                    {/* Hide legend for cleaner look */}
                    <Bar
                      dataKey="students"
                      radius={[12, 12, 8, 8]}
                      minPointSize={6}
                      maxBarSize={28}
                      fill="url(#studentBarGradient)"
                      label={{ position: 'top', fill: '#2f5148', fontWeight: 700, fontSize: 14 }}
                    />
                    <defs>
                      <linearGradient id="studentBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#73ad67" />
                        <stop offset="100%" stopColor="#2f5148" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
                )}
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
                fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {category.category}
            </Typography>
          <Grid container spacing={4} justifyContent="center">
              {category.services.map((service, serviceIndex) => (
                <Grid size={{ xs: 12, md: 6 }} key={serviceIndex}>
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
                          justifyContent: "center",
                        }}
                      >
                        <Box sx={{
                          background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                          borderRadius: '10px',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {React.cloneElement(service.icon, { sx: { color: 'white', fontSize: 24 } })}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#1a237e",
                            fontSize: "1.1rem",
                            fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                            textAlign: "center",
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
                            textAlign: "center",
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
            {staffData.map((staff, index) => (
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
                        background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                        color: 'white',
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {staff.initials}
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
                      {staff.name}
                    </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                      {staff.specialty}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        
        {staffLoading && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#2f5148' }}>
                Đang tải thông tin đội ngũ y tế...
              </Typography>
            </Box>
          </Grid>
        )}
        
        {!staffLoading && staffData.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#2f5148' }}>
                Chưa có thông tin đội ngũ y tế
              </Typography>
            </Box>
          </Grid>
        )}
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
