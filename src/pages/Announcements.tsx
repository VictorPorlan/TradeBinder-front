import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Announcements: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Anuncios
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Descubre las mejores ofertas de cartas de Magic: The Gathering
      </Typography>
      {/* TODO: Implementar listado de anuncios */}
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Listado de anuncios en desarrollo...
      </Typography>
    </Container>
  );
};

export default Announcements;
