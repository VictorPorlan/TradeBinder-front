import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Listing, ListingCondition } from '../types';
import apiService from '../services/api';

const conditionLabels = {
  [ListingCondition.MINT]: 'Mint',
  [ListingCondition.NEAR_MINT]: 'Near Mint',
  [ListingCondition.LIGHTLY_PLAYED]: 'Lightly Played',
  [ListingCondition.MODERATELY_PLAYED]: 'Moderately Played',
  [ListingCondition.HEAVILY_PLAYED]: 'Heavily Played',
  [ListingCondition.DAMAGED]: 'Damaged',
};

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadListings();
    }
  }, [isAuthenticated, navigate]);

  const loadListings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getMyListings();
      setListings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar tus listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, listing: Listing) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleEdit = () => {
    if (selectedListing) {
      navigate(`/edit-listing/${selectedListing.id}`);
    }
    handleMenuClose();
  };

  const handleToggleStatus = async () => {
    if (!selectedListing) return;

    try {
      const updatedListing = await apiService.toggleListingStatus(selectedListing.id);
      setListings(prev => 
        prev.map(listing => 
          listing.id === selectedListing.id ? updatedListing : listing
        )
      );
      showNotification(
        updatedListing.isActive ? 'Listing activado' : 'Listing desactivado',
        'success'
      );
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || 'Error al cambiar el estado',
        'error'
      );
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedListing) return;

    console.log('Iniciando eliminación del listing:', selectedListing.id);
    setIsDeleting(true);
    try {
      await apiService.deleteListing(selectedListing.id);
      console.log('Listing eliminado exitosamente');
      setListings(prev => prev.filter(listing => listing.id !== selectedListing.id));
      showNotification('Listing eliminado exitosamente', 'success');
    } catch (err: any) {
      console.error('Error al eliminar listing:', err);
      showNotification(
        err.response?.data?.message || 'Error al eliminar el listing',
        'error'
      );
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Listings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tus cartas en venta
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadListings}
            disabled={isLoading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create-listing')}
          >
            Nuevo Listing
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" gutterBottom>
              No tienes listings creados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Crea tu primer listing para empezar a vender tus cartas
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-listing')}
            >
              Crear Primer Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listing.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: listing.isActive ? 1 : 0.7,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={listing.cardBase?.imageUrl || '/placeholder-card.jpg'}
                  alt={listing.cardBase?.name}
                  sx={{ objectFit: 'contain', p: 1 }}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {listing.cardBase?.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {listing.edition?.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip 
                      label={conditionLabels[listing.condition]} 
                      size="small" 
                      variant="outlined"
                    />
                    {listing.isFoil && (
                      <Chip label="Foil" size="small" color="secondary" />
                    )}
                    <Chip 
                      label={listing.isActive ? 'Activo' : 'Inactivo'} 
                      size="small" 
                      color={listing.isActive ? 'success' : 'default'}
                    />
                  </Box>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    {formatPrice(listing.price)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Cantidad: {listing.quantity}
                  </Typography>
                  
                  {listing.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {listing.description}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/listings/${listing.id}`)}
                  >
                    Ver Detalles
                  </Button>
                  
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, listing)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/create-listing')}
      >
        <Add />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedListing?.isActive ? (
            <>
              <VisibilityOff sx={{ mr: 1 }} />
              Desactivar
            </>
          ) : (
            <>
              <Visibility sx={{ mr: 1 }} />
              Activar
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar este listing? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : undefined}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyListings;
