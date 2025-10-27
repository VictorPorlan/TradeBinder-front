import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Search,
  Add,
  ShoppingCart,
  Favorite,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: 'Buscar Cartas',
      description: 'Encuentra cualquier carta de Magic: The Gathering en nuestro catálogo completo.',
      action: () => navigate('/cards'),
      buttonText: 'Buscar Cartas',
    },
    {
      icon: <Add sx={{ fontSize: 40 }} />,
      title: 'Publicar Carta',
      description: 'Vende tus cartas de forma fácil y segura con nuestra plataforma.',
      action: () => navigate(isAuthenticated ? '/create-listing' : '/register'),
      buttonText: isAuthenticated ? 'Crear Listing' : 'Comenzar a Vender',
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      title: 'Comprar Cartas',
      description: 'Encuentra las mejores ofertas de cartas de otros coleccionistas.',
      action: () => navigate('/catalog'),
      buttonText: 'Ver Cartas',
    },
    {
      icon: <Favorite sx={{ fontSize: 40 }} />,
      title: 'Favoritos',
      description: 'Guarda tus cartas favoritas y recibe notificaciones de nuevos anuncios.',
      action: () => navigate(isAuthenticated ? '/my-listings' : '/register'),
      buttonText: isAuthenticated ? 'Mis Listings' : 'Crear Cuenta',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            TradeBinder
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            La plataforma líder para el comercio de cartas de Magic: The Gathering
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Conecta con otros coleccionistas, compra y vende cartas de forma segura y fácil.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  backgroundColor: 'white', 
                  color: '#1976d2',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={() => navigate('/register')}
              >
                Registrarse Gratis
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  backgroundColor: 'white', 
                  color: '#1976d2',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={() => navigate('/profile')}
              >
                Mi Perfil
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
              onClick={() => navigate('/cards')}
            >
              Explorar Catálogo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          ¿Por qué elegir TradeBinder?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                  <Box sx={{ color: '#1976d2', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={feature.action}
                    sx={{ textTransform: 'none' }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            {isAuthenticated ? '¡Bienvenido de vuelta!' : '¿Listo para comenzar?'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {isAuthenticated 
              ? 'Explora nuestro catálogo y encuentra las cartas que necesitas.'
              : 'Únete a miles de coleccionistas que ya confían en TradeBinder para sus transacciones.'
            }
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/cards' : '/register')}
            sx={{ textTransform: 'none' }}
          >
            {isAuthenticated ? 'Explorar Catálogo' : 'Crear Cuenta Gratis'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
