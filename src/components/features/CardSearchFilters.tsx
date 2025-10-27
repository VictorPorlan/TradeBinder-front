import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Typography,
} from '@mui/material';
import { SearchCardsParams } from '../../types';

interface CardSearchFiltersProps {
  filters: SearchCardsParams;
  onFilterChange: (filters: Partial<SearchCardsParams>) => void;
  onClearFilters: () => void;
}

const CardSearchFilters: React.FC<CardSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const rarityOptions = [
    { value: 'Common', label: 'Común' },
    { value: 'Uncommon', label: 'Poco Común' },
    { value: 'Rare', label: 'Rara' },
    { value: 'Mythic Rare', label: 'Rara Mítica' },
    { value: 'Special', label: 'Especial' },
  ];

  const typeOptions = [
    { value: 'Creature', label: 'Criatura' },
    { value: 'Instant', label: 'Instantáneo' },
    { value: 'Sorcery', label: 'Conjuro' },
    { value: 'Artifact', label: 'Artefacto' },
    { value: 'Enchantment', label: 'Encantamiento' },
    { value: 'Planeswalker', label: 'Planeswalker' },
    { value: 'Land', label: 'Tierra' },
  ];

  const manaCostOptions = [
    { value: '{W}', label: 'Blanco' },
    { value: '{U}', label: 'Azul' },
    { value: '{B}', label: 'Negro' },
    { value: '{R}', label: 'Rojo' },
    { value: '{G}', label: 'Verde' },
    { value: '{C}', label: 'Incoloro' },
  ];

  const handleInputChange = (field: keyof SearchCardsParams) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFilterChange({ [field]: event.target.value || undefined });
  };

  const handleSelectChange = (field: keyof SearchCardsParams) => (
    event: any
  ) => {
    onFilterChange({ [field]: event.target.value || undefined });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.name) count++;
    if (filters.manaCost) count++;
    if (filters.type) count++;
    if (filters.subtype) count++;
    if (filters.rarity) count++;
    if (filters.artist) count++;
    if (filters.text) count++;
    return count;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Filtros Avanzados</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={`${getActiveFiltersCount()} filtros activos`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          <Button
            variant="outlined"
            size="small"
            onClick={onClearFilters}
            disabled={getActiveFiltersCount() === 0}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Nombre */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="Nombre de la carta"
            value={filters.name || ''}
            onChange={handleInputChange('name')}
            placeholder="Ej: Lightning Bolt"
            size="small"
          />
        </Grid>

        {/* Coste de Maná */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Coste de Maná</InputLabel>
            <Select
              value={filters.manaCost || ''}
              label="Coste de Maná"
              onChange={handleSelectChange('manaCost')}
            >
              <MenuItem value="">Todos</MenuItem>
              {manaCostOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label} ({option.value})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Tipo */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filters.type || ''}
              label="Tipo"
              onChange={handleSelectChange('type')}
            >
              <MenuItem value="">Todos</MenuItem>
              {typeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Subtipo */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="Subtipo"
            value={filters.subtype || ''}
            onChange={handleInputChange('subtype')}
            placeholder="Ej: Dragon, Angel"
            size="small"
          />
        </Grid>

        {/* Rareza */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Rareza</InputLabel>
            <Select
              value={filters.rarity || ''}
              label="Rareza"
              onChange={handleSelectChange('rarity')}
            >
              <MenuItem value="">Todas</MenuItem>
              {rarityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Artista */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="Artista"
            value={filters.artist || ''}
            onChange={handleInputChange('artist')}
            placeholder="Ej: Christopher Rush"
            size="small"
          />
        </Grid>

        {/* Texto de la carta */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Texto de la carta"
            value={filters.text || ''}
            onChange={handleInputChange('text')}
            placeholder="Buscar en el texto de la carta..."
            multiline
            rows={2}
            size="small"
          />
        </Grid>
      </Grid>

      {/* Quick Filter Chips */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Filtros Rápidos:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Criaturas"
            onClick={() => onFilterChange({ type: 'Creature' })}
            variant={filters.type === 'Creature' ? 'filled' : 'outlined'}
            size="small"
            clickable
          />
          <Chip
            label="Instantáneos"
            onClick={() => onFilterChange({ type: 'Instant' })}
            variant={filters.type === 'Instant' ? 'filled' : 'outlined'}
            size="small"
            clickable
          />
          <Chip
            label="Artefactos"
            onClick={() => onFilterChange({ type: 'Artifact' })}
            variant={filters.type === 'Artifact' ? 'filled' : 'outlined'}
            size="small"
            clickable
          />
          <Chip
            label="Raras"
            onClick={() => onFilterChange({ rarity: 'Rare' })}
            variant={filters.rarity === 'Rare' ? 'filled' : 'outlined'}
            size="small"
            clickable
          />
          <Chip
            label="Raras Míticas"
            onClick={() => onFilterChange({ rarity: 'Mythic Rare' })}
            variant={filters.rarity === 'Mythic Rare' ? 'filled' : 'outlined'}
            size="small"
            clickable
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CardSearchFilters;
