import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SimpleHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    console.log('SimpleHeader: Navigating to home');
    try {
      navigate('/');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback usando window.location
      window.location.href = '/';
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={handleNavigateHome}
        >
          TradeBinder
        </Typography>

        {/* Botón de inicio */}
        <Button 
          color="inherit" 
          onClick={handleNavigateHome}
          sx={{ textTransform: 'none' }}
        >
          Volver al Inicio
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleHeader;
