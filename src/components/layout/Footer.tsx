import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
} from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        py: 3,
        mt: 'auto',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              TradeBinder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La plataforma líder para el comercio de cartas de Magic: The Gathering.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enlaces
            </Typography>
            <Box>
              <Link href="/catalog" color="inherit" underline="hover">
                Catálogo
              </Link>
              <br />
              <Link href="/announcements" color="inherit" underline="hover">
                Anuncios
              </Link>
              <br />
              <Link href="/about" color="inherit" underline="hover">
                Acerca de
              </Link>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Soporte
            </Typography>
            <Box>
              <Link href="/help" color="inherit" underline="hover">
                Ayuda
              </Link>
              <br />
              <Link href="/contact" color="inherit" underline="hover">
                Contacto
              </Link>
              <br />
              <Link href="/terms" color="inherit" underline="hover">
                Términos
              </Link>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacidad
              </Link>
              <br />
              <Link href="/cookies" color="inherit" underline="hover">
                Cookies
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 TradeBinder. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
