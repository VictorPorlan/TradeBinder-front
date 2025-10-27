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
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { CardBase } from '../types';
import apiService from '../services/api';

const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCard(parseInt(id));
    }
  }, [id]);

  const loadCard = async (cardId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const cardData = await apiService.getCardById(cardId);
      setCard(cardData);
    } catch (err) {
      setError('Error al cargar la carta. Por favor, inténtalo de nuevo.');
      console.error('Error loading card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCard = () => {
    if (card) {
      // Navigate to create listing with this card pre-selected
      navigate('/create-listing', { state: { selectedCard: card } });
    }
  };

  const handleShare = async () => {
    if (navigator.share && card) {
      try {
        await navigator.share({
          title: card.name,
          text: `Mira esta carta de Magic: ${card.name}`,
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

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'default';
      case 'uncommon':
        return 'success';
      case 'rare':
        return 'warning';
      case 'mythic rare':
        return 'error';
      case 'special':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'creature':
        return 'primary';
      case 'instant':
        return 'info';
      case 'sorcery':
        return 'secondary';
      case 'artifact':
        return 'default';
      case 'enchantment':
        return 'success';
      case 'planeswalker':
        return 'warning';
      case 'land':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatManaCost = (manaCost?: string) => {
    if (!manaCost) return '';
    
    return manaCost
      .replace(/\{(\d+)\}/g, '$1')
      .replace(/\{W\}/g, '⚪')
      .replace(/\{U\}/g, '🔵')
      .replace(/\{B\}/g, '⚫')
      .replace(/\{R\}/g, '🔴')
      .replace(/\{G\}/g, '🟢')
      .replace(/\{C\}/g, '⚪');
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

  if (error || !card) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Carta no encontrada'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cards')}
        >
          Volver a la búsqueda
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
          onClick={() => navigate('/cards')}
          sx={{ mb: 2 }}
        >
          Volver a la búsqueda
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {card.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {card.type && (
                <Chip
                  label={card.type}
                  color={getTypeColor(card.type)}
                  size="medium"
                />
              )}
              {card.subtype && (
                <Chip
                  label={card.subtype}
                  variant="outlined"
                  size="medium"
                />
              )}
              {card.rarity && (
                <Chip
                  label={card.rarity}
                  color={getRarityColor(card.rarity)}
                  variant="outlined"
                  size="medium"
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleSelectCard}
              size="large"
            >
              Crear Listing
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
                src={card.imageUrl || '/api/placeholder/400/560'}
                alt={card.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  backgroundColor: 'grey.100',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/560';
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Card Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              {/* Mana Cost */}
              {card.manaCost && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Coste de Maná
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  >
                    {formatManaCost(card.manaCost)}
                  </Typography>
                </Box>
              )}

              {/* Power/Toughness */}
              {(card.power || card.toughness) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Fuerza/Resistencia
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  >
                    {card.power || '?'}/{card.toughness || '?'}
                  </Typography>
                </Box>
              )}

              {/* Loyalty */}
              {card.loyalty && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Lealtad
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  >
                    {card.loyalty}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Card Text */}
              {card.text && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Texto de la Carta
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
                    {card.text}
                  </Typography>
                </Box>
              )}

              {/* Flavor Text */}
              {card.flavorText && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Texto de Sabor
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                      backgroundColor: 'grey.50',
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {card.flavorText}
                  </Typography>
                </Box>
              )}

              {/* Artist */}
              {card.artist && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Artista
                  </Typography>
                  <Typography variant="body1">
                    {card.artist}
                  </Typography>
                </Box>
              )}

              {/* Card Number */}
              {card.number && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Número de Carta
                  </Typography>
                  <Typography variant="body1">
                    {card.number}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información Adicional
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Estado:</strong> {card.isActive ? 'Activa' : 'Inactiva'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Fecha de creación:</strong> {new Date(card.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default CardDetail;
