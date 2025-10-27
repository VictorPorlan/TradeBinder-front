import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Publish,
} from '@mui/icons-material';
import { CardBase, Edition, ListingCondition } from '../../types';

interface ListingPreviewProps {
  card: CardBase;
  edition: Edition;
  data: {
    condition: ListingCondition;
    isFoil: boolean;
    price: number;
    quantity: number;
    description: string;
    images: string[];
  };
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitText?: string;
}

const conditionLabels = {
  [ListingCondition.MINT]: 'Mint (M)',
  [ListingCondition.NEAR_MINT]: 'Near Mint (NM)',
  [ListingCondition.LIGHTLY_PLAYED]: 'Lightly Played (LP)',
  [ListingCondition.MODERATELY_PLAYED]: 'Moderately Played (MP)',
  [ListingCondition.HEAVILY_PLAYED]: 'Heavily Played (HP)',
  [ListingCondition.DAMAGED]: 'Damaged (DMG)',
};

const ListingPreview: React.FC<ListingPreviewProps> = ({
  card,
  edition,
  data,
  onBack,
  onSubmit,
  isLoading,
  submitText = 'Publicar Listing',
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mr: 2 }}
          disabled={isLoading}
        >
          Volver
        </Button>
        <Typography variant="h5" component="h2">
          Revisar Listing
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Revisa todos los detalles antes de publicar tu listing. Una vez publicado, 
        otros usuarios podrán verlo y contactarte para comprarlo.
      </Alert>

      <Grid container spacing={3}>
        {/* Card Preview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vista Previa del Listing
              </Typography>
              
              <CardMedia
                component="img"
                height="300"
                image={card.imageUrl || '/placeholder-card.jpg'}
                alt={card.name}
                sx={{ objectFit: 'contain', mb: 2 }}
              />
              
              <Typography variant="h5" gutterBottom>
                {card.name}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {card.type}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                Edición: {edition.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {card.manaCost && (
                  <Chip label={card.manaCost} size="small" variant="outlined" />
                )}
                {card.rarity && (
                  <Chip 
                    label={card.rarity} 
                    size="small" 
                    color={card.rarity === 'rare' ? 'primary' : 'default'}
                  />
                )}
                {data.isFoil && (
                  <Chip label="Foil" size="small" color="secondary" />
                )}
                <Chip 
                  label={conditionLabels[data.condition]} 
                  size="small" 
                  color="default"
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h4" color="primary" gutterBottom>
                {formatPrice(data.price)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Cantidad disponible: {data.quantity}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalles del Listing
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Precio
                  </Typography>
                  <Typography variant="body1">
                    {formatPrice(data.price)}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cantidad
                  </Typography>
                  <Typography variant="body1">
                    {data.quantity}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Condición
                  </Typography>
                  <Typography variant="body1">
                    {conditionLabels[data.condition]}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tipo
                  </Typography>
                  <Typography variant="body1">
                    {data.isFoil ? 'Foil' : 'Normal'}
                  </Typography>
                </Grid>
              </Grid>
              
              {data.description && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Descripción
                  </Typography>
                  <Typography variant="body1">
                    {data.description}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>

          {/* Images Preview */}
          {data.images.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Imágenes Subidas ({data.images.length})
                </Typography>
                
                <Grid container spacing={1}>
                  {data.images.map((image, index) => (
                    <Grid size={{ xs: 4 }} key={index}>
                      <CardMedia
                        component="img"
                        height="80"
                        image={image}
                        alt={`Imagen ${index + 1}`}
                        sx={{ objectFit: 'cover', borderRadius: 1 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          disabled={isLoading}
        >
          Volver a Editar
        </Button>
        
        <Button
          variant="contained"
          size="large"
          startIcon={isLoading ? <CircularProgress size={20} /> : <Publish />}
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : submitText}
        </Button>
      </Box>
    </Box>
  );
};

export default ListingPreview;
