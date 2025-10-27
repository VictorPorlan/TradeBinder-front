import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite,
  FavoriteBorder,
  Share as ShareIcon,
  ShoppingCart,
  LocationOn,
  Euro,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { Listing, ListingCondition } from '../types';
import apiService from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import BuyModal from '../components/common/BuyModal';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadListing(parseInt(id));
    }
  }, [id]);

  const loadListing = async (listingId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const listingData = await apiService.getListingById(listingId);
      setListing(listingData);
    } catch (err) {
      setError('Error al cargar el anuncio. Por favor, inténtalo de nuevo.');
      console.error('Error loading listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    // TODO: Implement add to favorites
    setIsFavorite(true);
    console.log('Add to favorites:', listing?.id);
  };

  const handleRemoveFromFavorites = () => {
    // TODO: Implement remove from favorites
    setIsFavorite(false);
    console.log('Remove from favorites:', listing?.id);
  };

  const handleShare = async () => {
    if (navigator.share && listing) {
      try {
        await navigator.share({
          title: `${listing.cardBase?.name} - ${listing.edition?.name}`,
          text: `Mira esta carta en venta: ${listing.cardBase?.name} por €${listing.price}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBuyClick = () => {
    setBuyDialogOpen(true);
  };

  const handleBuyConfirm = async (transactionId: number) => {
    try {
      // TODO: Show success message
      console.log('Transaction created successfully:', transactionId);
      
      setBuyDialogOpen(false);
      // Navigate to transactions page
      navigate('/transactions');
    } catch (err) {
      console.error('Error handling transaction confirmation:', err);
    }
  };

  const getConditionLabel = (condition: ListingCondition): string => {
    const conditionLabels = {
      [ListingCondition.MINT]: 'Mint',
      [ListingCondition.NEAR_MINT]: 'Near Mint',
      [ListingCondition.LIGHTLY_PLAYED]: 'Lightly Played',
      [ListingCondition.MODERATELY_PLAYED]: 'Moderately Played',
      [ListingCondition.HEAVILY_PLAYED]: 'Heavily Played',
      [ListingCondition.DAMAGED]: 'Damaged',
    };
    return conditionLabels[condition] || condition;
  };

  const getConditionColor = (condition: ListingCondition): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const colorMap = {
      [ListingCondition.MINT]: 'success',
      [ListingCondition.NEAR_MINT]: 'primary',
      [ListingCondition.LIGHTLY_PLAYED]: 'info',
      [ListingCondition.MODERATELY_PLAYED]: 'warning',
      [ListingCondition.HEAVILY_PLAYED]: 'error',
      [ListingCondition.DAMAGED]: 'error',
    };
    return colorMap[condition] as any;
  };

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numericPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Anuncio no encontrado'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/catalog')}
        >
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/catalog')}
          sx={{ mb: 2 }}
        >
          Volver al catálogo
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {listing.cardBase?.name}
            </Typography>
            
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {listing.edition?.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={getConditionLabel(listing.condition)}
                color={getConditionColor(listing.condition)}
                size="medium"
              />
              {listing.isFoil && (
                <Chip
                  label="Foil"
                  color="secondary"
                  size="medium"
                  variant="filled"
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}>
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={handleBuyClick}
              size="large"
              disabled={!listing.isActive || listing.quantity === 0}
            >
              Comprar Ahora
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Card Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box
                component="img"
                src={getImageUrl(listing.cardBase?.imageUrl)}
                alt={listing.cardBase?.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  backgroundColor: 'grey.100',
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Listing Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatPrice(listing.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  por unidad
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Quantity Available */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Cantidad Disponible
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {listing.quantity} unidades
                </Typography>
              </Box>

              {/* Seller Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Vendedor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  <Typography variant="body1">
                    {listing.user?.username}
                  </Typography>
                </Box>
                {listing.user?.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <LocationOn sx={{ fontSize: '1rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {listing.user.location.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Description */}
              {listing.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Descripción
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-line',
                      lineHeight: 1.6,
                      backgroundColor: 'grey.50',
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {listing.description}
                  </Typography>
                </Box>
              )}

              {/* Listing Date */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Fecha de Publicación
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(listing.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Images */}
      {listing.images && listing.images.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Imágenes Adicionales
          </Typography>
          <Grid container spacing={2}>
            {listing.images.map((image, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card>
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      component="img"
                      src={getImageUrl(image)}
                      alt={`Imagen ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Buy Modal */}
      <BuyModal
        open={buyDialogOpen}
        onClose={() => setBuyDialogOpen(false)}
        listing={listing}
        onConfirm={handleBuyConfirm}
      />
    </Container>
  );
};

export default ListingDetail;
