import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Pagination,
  Paper,
} from '@mui/material';
import {
  Search,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { CardBase, Edition, SearchCardsParams } from '../../types';
import apiService from '../../services/api';

interface CardSelectorProps {
  onCardSelect: (card: CardBase, edition: Edition) => void;
  onBack: () => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<CardBase[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCard, setSelectedCard] = useState<CardBase | null>(null);
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);

  const limit = 12;

  useEffect(() => {
    loadEditions();
    loadCards();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm === '') {
        loadCards();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, page]);

  // Auto-select first edition when editions are loaded and a card is selected
  useEffect(() => {
    if (editions.length > 0 && selectedCard && !selectedEdition) {
      setSelectedEdition(editions[0]);
    }
  }, [editions, selectedCard, selectedEdition]);

  const loadEditions = async () => {
    try {
      const editionsData = await apiService.getEditions();
      setEditions(editionsData);
    } catch (err) {
      console.error('Error loading editions:', err);
      setError('Error al cargar las ediciones. Por favor, recarga la página.');
      setEditions([]);
    }
  };

  const loadCards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: SearchCardsParams = {
        page,
        limit,
        isActive: true,
      };

      if (searchTerm) {
        params.name = searchTerm;
      }

      const response = await apiService.getCards(params);
      setCards(response.data);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las cartas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (card: CardBase) => {
    setSelectedCard(card);
    // Set first edition as default if available
    if (editions.length > 0) {
      setSelectedEdition(editions[0]);
    } else {
      setSelectedEdition(null);
    }
  };

  const handleEditionChange = (edition: Edition) => {
    setSelectedEdition(edition);
  };

  const handleContinue = () => {
    if (selectedCard && selectedEdition) {
      onCardSelect(selectedCard, selectedEdition);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
          Selecciona una Carta
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar cartas por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {cards.map((card) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={card.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out',
                    border: selectedCard?.id === card.id ? 2 : 1,
                    borderColor: selectedCard?.id === card.id ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleCardClick(card)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={card.imageUrl || '/placeholder-card.jpg'}
                    alt={card.name}
                    sx={{ objectFit: 'contain', p: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {card.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {card.type}
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
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {selectedCard && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Carta Seleccionada: {selectedCard.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Selecciona la edición:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {editions.length > 0 ? (
                  editions.map((edition) => (
                    <Chip
                      key={edition.id}
                      label={edition.name}
                      onClick={() => handleEditionChange(edition)}
                      color={selectedEdition?.id === edition.id ? 'primary' : 'default'}
                      variant={selectedEdition?.id === edition.id ? 'filled' : 'outlined'}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay ediciones disponibles. Por favor, recarga la página.
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleContinue}
                disabled={!selectedEdition || editions.length === 0}
                fullWidth
              >
                Continuar con {selectedCard.name}
              </Button>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default CardSelector;