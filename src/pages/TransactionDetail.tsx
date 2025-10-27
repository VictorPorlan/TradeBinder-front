import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle,
  Cancel,
  LocalShipping,
  Euro,
  Person,
  CalendarToday,
  ShoppingCart,
  Store,
  LocationOn,
} from '@mui/icons-material';
import { Transaction, TransactionStatus } from '../types';
import apiService from '../services/api';

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadTransaction(parseInt(id));
    }
  }, [id]);

  const loadTransaction = async (transactionId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const transactionData = await apiService.getTransactionById(transactionId);
      setTransaction(transactionData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TransactionStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const colorMap = {
      [TransactionStatus.PENDING]: 'warning',
      [TransactionStatus.CONFIRMED]: 'info',
      [TransactionStatus.DELIVERED]: 'success',
      [TransactionStatus.CANCELLED]: 'error',
    };
    return colorMap[status] as any;
  };

  const getStatusLabel = (status: TransactionStatus): string => {
    const labelMap = {
      [TransactionStatus.PENDING]: 'Pendiente',
      [TransactionStatus.CONFIRMED]: 'Confirmada',
      [TransactionStatus.DELIVERED]: 'Entregada',
      [TransactionStatus.CANCELLED]: 'Cancelada',
    };
    return labelMap[status] || status;
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return <ShoppingCart />;
      case TransactionStatus.CONFIRMED:
        return <CheckCircle />;
      case TransactionStatus.DELIVERED:
        return <CheckCircle color="success" />;
      case TransactionStatus.CANCELLED:
        return <Cancel color="error" />;
      default:
        return <ShoppingCart />;
    }
  };

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numericPrice.toFixed(2)}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleConfirmTransaction = async () => {
    if (!transaction) return;

    setIsProcessing(true);
    try {
      await apiService.completeTransaction(transaction.id);
      await loadTransaction(transaction.id); // Recargar la transacción
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al confirmar la transacción');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelTransaction = async () => {
    if (!transaction) return;

    setIsProcessing(true);
    try {
      await apiService.cancelTransaction(transaction.id);
      await loadTransaction(transaction.id); // Recargar la transacción
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cancelar la transacción');
    } finally {
      setIsProcessing(false);
    }
  };

  const canConfirmTransaction = (): boolean => {
    return transaction?.status === TransactionStatus.PENDING;
  };

  const canCancelTransaction = (): boolean => {
    return transaction?.status === TransactionStatus.PENDING;
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

  if (error || !transaction) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Transacción no encontrada'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/transactions')}
        >
          Volver a Mis Transacciones
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
          onClick={() => navigate('/transactions')}
          sx={{ mb: 2 }}
        >
          Volver a Mis Transacciones
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Detalle de Transacción
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              #{transaction.id}
            </Typography>
          </Box>
          
          <Chip
            icon={getStatusIcon(transaction.status)}
            label={getStatusLabel(transaction.status)}
            color={getStatusColor(transaction.status)}
            size="medium"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Card Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de la Carta
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {transaction.listing?.cardBase?.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {transaction.listing?.edition?.name}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={transaction.listing?.condition}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                  {transaction.listing?.isFoil && (
                    <Chip
                      label="Foil"
                      color="secondary"
                      size="small"
                      variant="filled"
                    />
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Transaction Details */}
              <Typography variant="h6" gutterBottom>
                Detalles de la Transacción
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Euro sx={{ fontSize: '1.2rem', mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatPrice(transaction.totalPrice)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Cantidad:</strong> {transaction.quantity} unidades
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Precio por unidad:</strong> {formatPrice(transaction.pricePerUnit)}
                </Typography>
              </Box>

              {transaction.paymentMethod && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Método de pago:</strong> {transaction.paymentMethod}
                  </Typography>
                </Box>
              )}

              {transaction.trackingNumber && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Número de seguimiento:</strong> {transaction.trackingNumber}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de los Usuarios
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingCart sx={{ fontSize: '1.2rem', mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Comprador
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ fontSize: '1rem', mr: 1 }} />
                  <Typography variant="body1">
                    {transaction.buyer?.username}
                  </Typography>
                </Box>
                {transaction.buyer?.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: '1rem', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {transaction.buyer.location.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Store sx={{ fontSize: '1.2rem', mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">
                    Vendedor
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ fontSize: '1rem', mr: 1 }} />
                  <Typography variant="body1">
                    {transaction.seller?.username}
                  </Typography>
                </Box>
                {transaction.seller?.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: '1rem', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {transaction.seller.location.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Shipping Information */}
              {transaction.shippingAddress && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Información de Envío
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {transaction.shippingAddress}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Dates */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Fechas
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ fontSize: '1rem', mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Creada:</strong> {formatDate(transaction.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ fontSize: '1rem', mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Actualizada:</strong> {formatDate(transaction.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        {canConfirmTransaction() && (
          <Button
            variant="contained"
            color="success"
            size="medium"
            onClick={handleConfirmTransaction}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar Recepción'}
          </Button>
        )}
        
        {canCancelTransaction() && (
          <Button
            variant="outlined"
            color="error"
            size="medium"
            onClick={handleCancelTransaction}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Cancel />}
          >
            {isProcessing ? 'Procesando...' : 'Cancelar Transacción'}
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default TransactionDetail;
