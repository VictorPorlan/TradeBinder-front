import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AccountCircle,
  ShoppingCart,
  ShoppingBag,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess } = useNotification();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    showSuccess('Has cerrado sesión correctamente.');
    handleClose();
    navigate('/');
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
          onClick={() => navigate('/')}
        >
          TradeBinder
        </Typography>


        {/* Botones de usuario */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit"
                onClick={() => navigate('/my-purchases')}
                title="Mis Compras"
              >
                <ShoppingBag />
              </IconButton>
              <IconButton color="inherit">
                <ShoppingCart />
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={() => { navigate('/my-listings'); handleClose(); }}>
                  Mis Listings
                </MenuItem>
                <MenuItem onClick={() => { navigate('/transactions'); handleClose(); }}>
                  Mis Transacciones
                </MenuItem>
                <MenuItem onClick={() => { navigate('/create-listing'); handleClose(); }}>
                  Crear Listing
                </MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/')}
                sx={{ textTransform: 'none' }}
              >
                Inicio
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Iniciar Sesión
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/register')}
                sx={{ textTransform: 'none' }}
              >
                Registrarse
              </Button>
            </>
          )}
        </Box>

        {/* Menú móvil */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
