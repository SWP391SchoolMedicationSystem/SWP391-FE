import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Link, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 3, mt: 6, borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; 2025 Medlearn. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: { xs: 2, md: 0 } }}>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'info.main' } }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'info.main' } }}
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'info.main' } }}
            >
              Contact
            </Link>
            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'info.main' } }}
            >
              Help
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
