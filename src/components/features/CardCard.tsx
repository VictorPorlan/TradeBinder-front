import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { CardBase } from '../../types';

interface CardCardProps {
  card: CardBase;
  onView?: (card: CardBase) => void;
  onSelect?: (card: CardBase) => void;
  onViewAvailable?: (card: CardBase) => void;
  showSelectButton?: boolean;
  showViewButton?: boolean;
  showViewAvailableButton?: boolean;
}

const CardCard: React.FC<CardCardProps> = ({
  card,
  onView,
  onSelect,
  onViewAvailable,
  showSelectButton = true,
  showViewButton = true,
  showViewAvailableButton = false,
}) => {
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
    
    // Simple formatting for mana symbols
    return manaCost
      .replace(/\{(\d+)\}/g, '$1')
      .replace(/\{W\}/g, '⚪')
      .replace(/\{U\}/g, '🔵')
      .replace(/\{B\}/g, '⚫')
      .replace(/\{R\}/g, '🔴')
      .replace(/\{G\}/g, '🟢')
      .replace(/\{C\}/g, '⚪');
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
        image={card.imageUrl || '/api/placeholder/200/280'}
        alt={card.name}
        sx={{
          objectFit: 'cover',
          backgroundColor: 'grey.100',
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/api/placeholder/200/280';
        }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Card Name */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: 1.2,
            minHeight: '2.4em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {card.name}
        </Typography>

        {/* Mana Cost */}
        {card.manaCost && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontFamily: 'monospace' }}
          >
            {formatManaCost(card.manaCost)}
          </Typography>
        )}

        {/* Type and Subtype */}
        <Box sx={{ mb: 1 }}>
          {card.type && (
            <Chip
              label={card.type}
              size="small"
              color={getTypeColor(card.type)}
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
          {card.subtype && (
            <Chip
              label={card.subtype}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
        </Box>

        {/* Power/Toughness for creatures */}
        {card.power && card.toughness && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              fontFamily: 'monospace',
            }}
          >
            {card.power}/{card.toughness}
          </Typography>
        )}

        {/* Loyalty for planeswalkers */}
        {card.loyalty && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              fontFamily: 'monospace',
            }}
          >
            Lealtad: {card.loyalty}
          </Typography>
        )}

        {/* Card Text */}
        {card.text && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.75rem',
              lineHeight: 1.3,
              minHeight: '2.6em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {truncateText(card.text, 80)}
          </Typography>
        )}

        {/* Rarity */}
        {card.rarity && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={card.rarity}
              size="small"
              color={getRarityColor(card.rarity)}
              variant="outlined"
            />
          </Box>
        )}

        {/* Artist */}
        {card.artist && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
          >
            {card.artist}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', flexDirection: 'column' }}>
          {showViewAvailableButton && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={() => onViewAvailable?.(card)}
              sx={{ width: '100%' }}
            >
              Ver Disponibles
            </Button>
          )}
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            {showViewButton && (
              <Button
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => onView?.(card)}
                sx={{ flex: 1 }}
              >
                Ver
              </Button>
            )}
            {showSelectButton && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => onSelect?.(card)}
                sx={{ flex: 1 }}
              >
                Seleccionar
              </Button>
            )}
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CardCard;
