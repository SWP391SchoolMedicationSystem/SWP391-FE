// File: src/components/login/FeatureCards.jsx
import { Box, Card, Grid, Typography } from '@mui/material';
import {
  PersonOutline,
  ShieldOutlined,
  FavoriteBorder,
} from '@mui/icons-material';

const featureCards = [
  {
    icon: <PersonOutline sx={{ fontSize: 32, color: 'white' }} />,
    title: '200+ Students',
    description: 'Medical Experts',
  },
  {
    icon: <ShieldOutlined sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Secure',
    description: 'Safe Information',
  },
  {
    icon: <FavoriteBorder sx={{ fontSize: 32, color: 'white' }} />,
    title: '24/7',
    description: 'Continuous Support',
  },
];

export default function FeatureCards() {
  return (
    <Grid container spacing={2} sx={{ mt: 4 }}>
      {featureCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={card.title}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 3,
              background: 'transparent',
              border: '1px solid #73ad67',
              boxShadow: '0 4px 12px rgba(47, 81, 72, 0.15)',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 20px rgba(47, 81, 72, 0.25)',
                background: '#1e342a',
              },
            }}
          >
            <Box
              sx={{
                background:
                  index === 0
                    ? 'linear-gradient(135deg, #73ad67, #85b06d)'
                    : index === 1
                    ? 'linear-gradient(135deg, #85b06d, #a8d895)'
                    : 'linear-gradient(135deg, #a8d895, #bfefa1)',
                borderRadius: '50%',
                p: 1.5,
                display: 'inline-flex',
                mb: 2,
                transition: 'all 0.3s ease',
                boxShadow: '0 3px 15px rgba(115, 173, 103, 0.3)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(115, 173, 103, 0.4)',
                },
              }}
            >
              {card.icon}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: '#555',
                mb: 0.5,
              }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#97a19b',
                fontSize: '0.8rem',
              }}
            >
              {card.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
