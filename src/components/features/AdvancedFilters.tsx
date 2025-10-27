import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  Search,
} from '@mui/icons-material';
import { SearchListingsParams, ListingCondition } from '../../types';

interface AdvancedFiltersProps {
  filters: SearchListingsParams;
  onFiltersChange: (filters: SearchListingsParams) => void;
  onClearFilters: () => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  onSearch,
  isLoading = false,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    price: false,
    condition: false,
    location: false,
  });

  const handleSectionToggle = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (key: keyof SearchListingsParams, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    handleFilterChange('minPrice', min);
    handleFilterChange('maxPrice', max);
  };

  const conditionOptions = [
    { value: ListingCondition.MINT, label: 'Mint' },
    { value: ListingCondition.NEAR_MINT, label: 'Near Mint' },
    { value: ListingCondition.LIGHTLY_PLAYED, label: 'Lightly Played' },
    { value: ListingCondition.MODERATELY_PLAYED, label: 'Moderately Played' },
    { value: ListingCondition.HEAVILY_PLAYED, label: 'Heavily Played' },
    { value: ListingCondition.DAMAGED, label: 'Damaged' },
  ];

  const sortOptions = [
    { value: 'price', label: 'Precio' },
    { value: 'createdAt', label: 'Fecha de publicación' },
    { value: 'cardName', label: 'Nombre de carta' },
    { value: 'edition', label: 'Edición' },
  ];

  const sortOrderOptions = [
    { value: 'ASC', label: 'Ascendente' },
    { value: 'DESC', label: 'Descendente' },
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.cardName) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.condition) count++;
    if (filters.isFoil !== undefined) count++;
    if (filters.locationId) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Filtros Avanzados
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} activos`}
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        {/* Search Section */}
        <Accordion
          expanded={expandedSections.search}
          onChange={() => handleSectionToggle('search')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Búsqueda</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre de carta"
                  value={filters.cardName || ''}
                  onChange={(e) => handleFilterChange('cardName', e.target.value)}
                  placeholder="Ej: Lightning Bolt"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  value={filters.locationId || ''}
                  onChange={(e) => handleFilterChange('locationId', e.target.value)}
                  placeholder="Ej: Madrid, Barcelona"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Price Section */}
        <Accordion
          expanded={expandedSections.price}
          onChange={() => handleSectionToggle('price')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Precio</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>
                Rango de precio: €{filters.minPrice || 0} - €{filters.maxPrice || 1000}
              </Typography>
              <Slider
                value={[filters.minPrice || 0, filters.maxPrice || 1000]}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={5}
                marks={[
                  { value: 0, label: '€0' },
                  { value: 250, label: '€250' },
                  { value: 500, label: '€500' },
                  { value: 750, label: '€750' },
                  { value: 1000, label: '€1000' },
                ]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Condition Section */}
        <Accordion
          expanded={expandedSections.condition}
          onChange={() => handleSectionToggle('condition')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Condición</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Condición</InputLabel>
                  <Select
                    value={filters.condition || ''}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    label="Condición"
                  >
                    <MenuItem value="">
                      <em>Todas las condiciones</em>
                    </MenuItem>
                    {conditionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.isFoil || false}
                      onChange={(e) => handleFilterChange('isFoil', e.target.checked)}
                    />
                  }
                  label="Solo Foil"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Sorting Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Ordenamiento</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={filters.sortBy || 'createdAt'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    label="Ordenar por"
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Orden</InputLabel>
                  <Select
                    value={filters.sortOrder || 'DESC'}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    label="Orden"
                  >
                    {sortOrderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={onClearFilters}
            disabled={activeFiltersCount === 0}
          >
            Limpiar Filtros
          </Button>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={onSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
