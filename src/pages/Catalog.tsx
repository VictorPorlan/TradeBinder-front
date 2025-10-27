import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { Refresh, ShoppingCart } from '@mui/icons-material';
import { Listing, SearchListingsParams, PaginatedResponse } from '../types';
import apiService from '../services/api';
import ListingCard from '../components/features/ListingCard';
import AdvancedFilters from '../components/features/AdvancedFilters';
import BuyModal from '../components/common/BuyModal';

const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Función para crear filtros iniciales desde URL
  const createInitialFilters = (): SearchListingsParams => {
    const cardName = searchParams.get('cardName');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const isFoil = searchParams.get('isFoil');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    const initialFilters: SearchListingsParams = {
      isActive: true,
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    };

    // Aplicar parámetros de URL si existen
    if (cardName) initialFilters.cardName = cardName;
    if (location) initialFilters.locationId = parseInt(location);
    if (minPrice) initialFilters.minPrice = parseFloat(minPrice);
    if (maxPrice) initialFilters.maxPrice = parseFloat(maxPrice);
    if (condition) initialFilters.condition = condition as any;
    if (isFoil) initialFilters.isFoil = isFoil === 'true';
    if (sortBy) initialFilters.sortBy = sortBy;
    if (sortOrder) initialFilters.sortOrder = sortOrder as 'ASC' | 'DESC';

    return initialFilters;
  };

  const [filters, setFilters] = useState<SearchListingsParams>(createInitialFilters());

  // Actualizar filtros cuando cambien los parámetros de URL
  useEffect(() => {
    const newFilters = createInitialFilters();
    setFilters(newFilters);
    setPage(1); // Reset page when URL params change
  }, [searchParams]);

  // Cargar listas cuando cambien los filtros o la página
  useEffect(() => {
    loadListings();
  }, [page, filters]);

  const loadListings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = {
        ...filters,
        page,
      };

      const response: PaginatedResponse<Listing> = await apiService.getListings(searchParams);
      setListings(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las cartas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchListingsParams) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    const defaultFilters: SearchListingsParams = {
      isActive: true,
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    };
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    loadListings();
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewDetails = (listing: Listing) => {
    navigate(`/listing/${listing.id}`);
  };

  const handleAddToFavorites = (listingId: number) => {
    // TODO: Implement add to favorites
    console.log('Add to favorites:', listingId);
  };

  const handleRemoveFromFavorites = (listingId: number) => {
    // TODO: Implement remove from favorites
    console.log('Remove from favorites:', listingId);
  };

  const handleBuy = (listing: Listing) => {
    setSelectedListing(listing);
    setBuyDialogOpen(true);
  };

  const handleBuyConfirm = async (transactionId: number) => {
    try {
      // TODO: Show success message
      console.log('Transaction created successfully:', transactionId);
      
      setBuyDialogOpen(false);
      setSelectedListing(null);
      // Navigate to transactions page
      navigate('/transactions');
    } catch (err) {
      console.error('Error handling transaction confirmation:', err);
    }
  };

  const handleRefresh = () => {
    loadListings();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Cartas en Venta
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Encuentra las cartas que buscas de otros coleccionistas
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Actualizar
        </Button>
      </Box>

      {/* Stats */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingCart />
          <Typography variant="h6">
            {total} cartas disponibles
          </Typography>
          <Chip
            label={`Página ${page} de ${totalPages}`}
            variant="outlined"
            sx={{ color: 'inherit', borderColor: 'currentColor' }}
          />
        </Box>
      </Paper>

      {/* Filters */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Listings Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {listings.map((listing) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={listing.id}>
                <ListingCard
                  listing={listing}
                  onViewDetails={handleViewDetails}
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  onBuy={handleBuy}
                  showBuyButton={true}
                />
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {listings.length === 0 && !isLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron cartas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Intenta ajustar los filtros de búsqueda
              </Typography>
              <Button variant="outlined" onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Buy Modal */}
      <BuyModal
        open={buyDialogOpen}
        onClose={() => {
          setBuyDialogOpen(false);
          setSelectedListing(null);
        }}
        listing={selectedListing}
        onConfirm={handleBuyConfirm}
      />
    </Container>
  );
};

export default Catalog;
