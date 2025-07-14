import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Link, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a1a',
        color: 'white',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              MedLearn
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#cccccc' }}>
              25 Nguyen Trai Street
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#cccccc' }}>
              District 1, Ho Chi Minh City
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#cccccc' }}>
              (+84) 28-3925-1436
            </Typography>
            
            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ color: '#cccccc', '&:hover': { color: '#10B981' } }}
                size="small"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                sx={{ color: '#cccccc', '&:hover': { color: '#10B981' } }}
                size="small"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                sx={{ color: '#cccccc', '&:hover': { color: '#10B981' } }}
                size="small"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                sx={{ color: '#cccccc', '&:hover': { color: '#10B981' } }}
                size="small"
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton 
                sx={{ color: '#cccccc', '&:hover': { color: '#10B981' } }}
                size="small"
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Mission and Values */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Sứ Mệnh & Giá Trị
            </Typography>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Về Chúng Tôi
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Tầm Nhìn
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Chính Sách Bảo Mật
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Khả Năng Tiếp Cận
            </Link>
          </Grid>

          {/* Services */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Dịch Vụ
            </Typography>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Quản Lý Sức Khỏe
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Tiêm Chủng
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Tư Vấn Y Tế
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Blog Y Tế
            </Link>
          </Grid>

          {/* Support */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Hỗ Trợ
            </Typography>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Liên Hệ
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Trợ Giúp
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Điều Khoản Sử Dụng
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                display: 'block',
                mb: 1,
                '&:hover': { color: '#10B981' } 
              }}
            >
              Đối Tác
            </Link>
          </Grid>
        </Grid>

        {/* Bottom Copyright Bar */}
        <Box
          sx={{
            borderTop: '1px solid #333',
            mt: 4,
            pt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            © 2025 MedLearn. Tất cả các quyền được bảo lưu.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: { xs: 2, md: 0 } }}>
            <Link
              href="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none',
                '&:hover': { color: '#10B981' } 
              }}
            >
              Quyền Riêng Tư
            </Link>
            <Link
              href="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none',
                '&:hover': { color: '#10B981' } 
              }}
            >
              Khả Năng Tiếp Cận
            </Link>
            <Link
              href="#"
              variant="body2"
              sx={{ 
                color: '#cccccc', 
                textDecoration: 'none',
                '&:hover': { color: '#10B981' } 
              }}
            >
              Báo Cáo Vấn Đề
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
