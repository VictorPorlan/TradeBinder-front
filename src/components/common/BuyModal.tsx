import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Listing, CreateTransactionRequest } from '../../types';
import apiService from '../../services/api';

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
  onConfirm: (transactionId: number) => void;
}

const BuyModal: React.FC<BuyModalProps> = ({
  open,
  onClose,
  listing,
  onConfirm,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numericPrice.toFixed(2)}`;
  };

  const handleConfirm = async () => {
    if (!listing) return;

    setIsLoading(true);
    setError(null);

    try {
      const transactionData: CreateTransactionRequest = {
        listingId: listing.id,
        quantity: 1, // Siempre comprar 1 unidad
        paymentMethod,
        shippingAddress: contactInfo,
      };

      const transaction = await apiService.createTransaction(transactionData);
      onConfirm(transaction.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setPaymentMethod('');
    setContactInfo('');
    setError(null);
    onClose();
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar Compra</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {listing.cardBase?.name} - {listing.edition?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Precio: {formatPrice(listing.price)}
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Método de Pago</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            label="Método de Pago"
          >
            <MenuItem value="paypal">PayPal</MenuItem>
            <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
            <MenuItem value="cash">Efectivo</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Información de Contacto (Opcional)"
          multiline
          rows={3}
          placeholder="Proporciona tu información de contacto (teléfono, email, etc.) para coordinar la compra..."
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h6">
            Total: {formatPrice(listing.price)}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!paymentMethod || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Procesando...' : 'Confirmar Compra'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyModal;
