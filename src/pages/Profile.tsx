import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Divider } from '@mui/material';
import { Edit, LocationOn, Email, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();

  const handleLogout = () => {
    logout();
    showSuccess('Has cerrado sesión correctamente.');
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Error: Usuario no encontrado
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Perfil
      </Typography>
      
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Person sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" component="h2">
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Miembro desde {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
            </Box>
            
            {user.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  <strong>Ubicación:</strong> {user.location.name}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{ textTransform: 'none' }}
            >
              Editar Perfil
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Mis Anuncios
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="text"
          color="error"
          onClick={handleLogout}
          sx={{ textTransform: 'none' }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
