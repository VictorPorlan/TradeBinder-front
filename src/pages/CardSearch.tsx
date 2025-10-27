import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { CardBase, SearchCardsParams, PaginatedResponse } from '../types';
import apiService from '../services/api';
import CardCard from '../components/features/CardCard';
import CardSearchFilters from '../components/features/CardSearchFilters';

const CardSearch: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchCardsParams>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'ASC',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load cards on component mount and when search params change
  useEffect(() => {
    loadCards();
  }, [searchParams]);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<CardBase> = await apiService.getCards(searchParams);
      
      setCards(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError('Error al cargar las cartas. Por favor, inténtalo de nuevo.');
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams(prev => ({
      ...prev,
      name: searchTerm || undefined,
      page: 1,
    }));
  };

  const handleQuickSearch = async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await apiService.searchCards(term, 20);
      setCards(results);
      setPagination({
        total: results.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    } catch (err) {
      setError('Error en la búsqueda rápida. Por favor, inténtalo de nuevo.');
      console.error('Error in quick search:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: Partial<SearchCardsParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({
      page: 1,
      limit: 20,
      sortBy: 'name',
      sortOrder: 'ASC',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchParams.name) count++;
    if (searchParams.manaCost) count++;
    if (searchParams.type) count++;
    if (searchParams.subtype) count++;
    if (searchParams.rarity) count++;
    if (searchParams.artist) count++;
    if (searchParams.text) count++;
    return count;
  };

  const handleViewAvailable = (card: CardBase) => {
    // Navegar al catálogo con filtro de carta específica
    navigate(`/catalog?cardName=${encodeURIComponent(card.name)}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Búsqueda de Cartas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Busca y explora el catálogo completo de cartas de Magic: The Gathering
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Buscar cartas por nombre, tipo, rareza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchTerm('');
                        handleSearch();
                      }}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ minWidth: 120 }}
            >
              Filtros {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Button>
          </Box>

          {/* Quick Search Suggestions */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['Lightning Bolt', 'Black Lotus', 'Counterspell', 'Serra Angel'].map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                onClick={() => handleQuickSearch(suggestion)}
                variant="outlined"
                size="small"
                clickable
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <CardSearchFilters
              filters={searchParams}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </CardContent>
        </Card>

      )}

      {/* Results */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {loading ? 'Cargando...' : `${pagination.total} cartas encontradas`}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={searchParams.sortBy}
                label="Ordenar por"
                onChange={(e) => setSearchParams(prev => ({ ...prev, sortBy: e.target.value }))}
              >
                <MenuItem value="name">Nombre</MenuItem>
                <MenuItem value="manaCost">Coste de Maná</MenuItem>
                <MenuItem value="type">Tipo</MenuItem>
                <MenuItem value="rarity">Rareza</MenuItem>
                <MenuItem value="createdAt">Fecha</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Orden</InputLabel>
              <Select
                value={searchParams.sortOrder}
                label="Orden"
                onChange={(e) => setSearchParams(prev => ({ ...prev, sortOrder: e.target.value as 'ASC' | 'DESC' }))}
              >
                <MenuItem value="ASC">Ascendente</MenuItem>
                <MenuItem value="DESC">Descendente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {cards.map((card) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={card.id}>
                  <CardCard 
                    card={card} 
                    showViewAvailableButton={true}
                    onViewAvailable={handleViewAvailable}
                    showSelectButton={false}
                    showViewButton={false}
                  />
                </Grid>
              ))}
            </Grid>

            {cards.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No se encontraron cartas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Intenta ajustar tus filtros de búsqueda
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default CardSearch;
