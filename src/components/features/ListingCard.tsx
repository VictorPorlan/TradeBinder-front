import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Euro,
  Visibility,
} from '@mui/icons-material';
import { Listing, ListingCondition } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
  onAddToFavorites?: (listingId: number) => void;
  onRemoveFromFavorites?: (listingId: number) => void;
  isFavorite?: boolean;
  showBuyButton?: boolean;
  onBuy?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onViewDetails,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite = false,
  showBuyButton = true,
  onBuy,
}) => {
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
    return `${numericPrice.toFixed(2)}`;
  };

  const handleFavoriteClick = () => {
    if (isFavorite && onRemoveFromFavorites) {
      onRemoveFromFavorites(listing.id);
    } else if (!isFavorite && onAddToFavorites) {
      onAddToFavorites(listing.id);
    }
  };

  const handleBuyClick = () => {
    if (onBuy) {
      onBuy(listing);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Card Image */}
      <CardMedia
        component="img"
        height="200"
        image={getImageUrl(listing.cardBase?.imageUrl)}
        alt={listing.cardBase?.name || 'Card'}
        sx={{
          objectFit: 'contain',
          p: 1,
          backgroundColor: '#f5f5f5',
        }}
      />

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Card Name */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: '1.1rem',
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {listing.cardBase?.name}
        </Typography>

        {/* Edition */}
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontWeight: 'medium' }}
        >
          {listing.edition?.name}
        </Typography>

        {/* Condition and Foil */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={getConditionLabel(listing.condition)}
            color={getConditionColor(listing.condition)}
            size="small"
            variant="outlined"
          />
          {listing.isFoil && (
            <Chip
              label="Foil"
              color="secondary"
              size="small"
              variant="filled"
            />
          )}
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Euro sx={{ fontSize: '1.2rem', mr: 0.5, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '1.3rem',
            }}
          >
            {formatPrice(listing.price)}
          </Typography>
        </Box>

        {/* Quantity */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Cantidad: {listing.quantity}
        </Typography>

        {/* Seller Location */}
        {listing.user?.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {listing.user.location.name}
            </Typography>
          </Box>
        )}

        {/* Seller */}
        <Typography variant="body2" color="text.secondary">
          Vendedor: {listing.user?.username}
        </Typography>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          {/* Favorite Button */}
          <Tooltip title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
            <IconButton
              onClick={handleFavoriteClick}
              color={isFavorite ? 'error' : 'default'}
              size="small"
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>

          {/* View Details Button */}
          <Button
            variant="outlined"
            onClick={() => onViewDetails(listing)}
            sx={{ flexGrow: 1 }}
          >
            Ver Detalles
          </Button>

          {/* Buy Button */}
          {showBuyButton && (
            <Button
              variant="contained"
              onClick={handleBuyClick}
              sx={{ minWidth: '100px' }}
            >
              Comprar
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ListingCard;
