import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CloudUpload,
} from '@mui/icons-material';
import { CardBase, Edition, ListingCondition, Listing } from '../../types';

interface ListingFormProps {
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
  onChange: (data: Partial<ListingFormProps['data']>) => void;
  onBack: () => void;
  onNext: () => void;
}

const conditionLabels = {
  [ListingCondition.MINT]: 'Mint (M)',
  [ListingCondition.NEAR_MINT]: 'Near Mint (NM)',
  [ListingCondition.LIGHTLY_PLAYED]: 'Lightly Played (LP)',
  [ListingCondition.MODERATELY_PLAYED]: 'Moderately Played (MP)',
  [ListingCondition.HEAVILY_PLAYED]: 'Heavily Played (HP)',
  [ListingCondition.DAMAGED]: 'Damaged (DMG)',
};

const conditionDescriptions = {
  [ListingCondition.MINT]: 'Perfecto estado, sin desgaste visible',
  [ListingCondition.NEAR_MINT]: 'Mínimo desgaste, prácticamente nuevo',
  [ListingCondition.LIGHTLY_PLAYED]: 'Ligero desgaste en los bordes',
  [ListingCondition.MODERATELY_PLAYED]: 'Desgaste moderado pero jugable',
  [ListingCondition.HEAVILY_PLAYED]: 'Desgaste considerable pero legible',
  [ListingCondition.DAMAGED]: 'Daño significativo, puede afectar jugabilidad',
};

const ListingForm: React.FC<ListingFormProps> = ({
  card,
  edition,
  data,
  onChange,
  onBack,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Función para manejar precios con precisión decimal
  const parsePrice = (value: string): number => {
    // Convertir a string, limpiar y parsear manteniendo precisión
    const cleanValue = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    if (!cleanValue) return 0;
    
    // Usar parseFloat pero redondear a 2 decimales para evitar problemas de precisión
    const parsed = parseFloat(cleanValue);
    return Math.round(parsed * 100) / 100;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (data.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (data.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (data.description && data.description.trim().length > 0 && data.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres o dejarse vacía';
    }

    if (data.description && data.description.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof typeof data, value: any) => {
    onChange({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // For now, we'll just simulate image URLs
      // In a real implementation, you'd upload to a service like Cloudinary
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      onChange({ images: [...data.images, ...imageUrls] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    onChange({ images: newImages });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h5" component="h2">
          Configurar Listing
        </Typography>
      </Box>

      {/* Card Preview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CardMedia
                component="img"
                height="200"
                image={card.imageUrl || '/placeholder-card.jpg'}
                alt={card.name}
                sx={{ objectFit: 'contain' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography variant="h6" gutterBottom>
                {card.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {card.type}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Edición: {edition.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Precio (€)"
            type="number"
            value={data.price}
            onChange={(e) => handleInputChange('price', parsePrice(e.target.value))}
            error={!!errors.price}
            helperText={errors.price || 'Precio en euros'}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Cantidad"
            type="number"
            value={data.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            error={!!errors.quantity}
            helperText={errors.quantity}
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel>Condición</InputLabel>
            <Select
              value={data.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              label="Condición"
            >
              {Object.entries(conditionLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  <Box>
                    <Typography variant="body1">{label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {conditionDescriptions[value as ListingCondition]}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={data.isFoil}
                onChange={(e) => handleInputChange('isFoil', e.target.checked)}
                disabled={!edition.hasFoil}
              />
            }
            label={`Versión Foil${!edition.hasFoil ? ' (No disponible en esta edición)' : ''}`}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Descripción (opcional)"
            multiline
            rows={4}
            value={data.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description || `${data.description.length}/500 caracteres`}
            placeholder="Describe el estado específico de tu carta, cualquier detalle adicional..."
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Imágenes de la Carta
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sube fotos de tu carta específica para mostrar su condición real
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mr: 2 }}
              >
                Subir Imágenes
              </Button>
            </label>
          </Box>

          {data.images.length > 0 && (
            <Grid container spacing={2}>
              {data.images.map((image, index) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="120"
                      image={image}
                      alt={`Imagen ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeImage(index)}
                        fullWidth
                      >
                        Eliminar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
        >
          Revisar Listing
        </Button>
      </Box>
    </Box>
  );
};

export default ListingForm;
