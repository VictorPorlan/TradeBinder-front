import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  Store,
  CheckCircle,
  Cancel,
  LocalShipping,
  Euro,
  Person,
  CalendarToday,
  Visibility,
  Chat,
} from '@mui/icons-material';
import { Transaction, TransactionStatus, SearchTransactionsParams } from '../types';
import apiService from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MyTransactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadTransactions();
  }, [activeTab]);

  const loadTransactions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: SearchTransactionsParams = {
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      // Determinar el tipo de transacciones según la pestaña activa
      if (activeTab === 0) {
        params.type = 'buyer'; // Mis compras
      } else if (activeTab === 1) {
        params.type = 'seller'; // Mis ventas
      } else {
        params.type = 'all'; // Todas
      }

      const response = await apiService.getTransactions(params);
      console.log('API Response:', response);
      setTransactions(response?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las transacciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

  const handleViewTransaction = (transactionId: number) => {
    navigate(`/transaction/${transactionId}`);
  };

  const handleOpenChat = (transactionId: number) => {
    navigate(`/transaction/${transactionId}/chat`);
  };

  const handleConfirmTransaction = async (transactionId: number) => {
    try {
      await apiService.completeTransaction(transactionId);
      loadTransactions(); // Recargar la lista
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al confirmar la transacción');
    }
  };

  const handleCancelTransaction = async (transactionId: number) => {
    try {
      await apiService.cancelTransaction(transactionId);
      loadTransactions(); // Recargar la lista
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cancelar la transacción');
    }
  };

  const canConfirmTransaction = (transaction: Transaction): boolean => {
    return transaction.status === TransactionStatus.PENDING && activeTab === 0; // Solo comprador puede confirmar
  };

  const canCancelTransaction = (transaction: Transaction): boolean => {
    return transaction.status === TransactionStatus.PENDING;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Transacciones
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tus compras y ventas de cartas
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab 
            label="Mis Compras" 
            icon={<ShoppingCart />} 
            iconPosition="start"
          />
          <Tab 
            label="Mis Ventas" 
            icon={<Store />} 
            iconPosition="start"
          />
          <Tab 
            label="Todas" 
            icon={<Visibility />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Loading State */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            {/* Mis Compras */}
            <Grid container spacing={3}>
              {transactions.map((transaction) => (
                <Grid size={{ xs: 12 }} key={transaction.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {transaction.listing?.cardBase?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {transaction.listing?.edition?.name}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(transaction.status)}
                          label={getStatusLabel(transaction.status)}
                          color={getStatusColor(transaction.status)}
                          variant="outlined"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Euro sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                              <strong>Total:</strong> {formatPrice(transaction.totalPrice)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2">
                              <strong>Cantidad:</strong> {transaction.quantity}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Person sx={{ fontSize: '1rem', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>Vendedor:</strong> {transaction.seller?.username}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ fontSize: '1rem', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>Fecha:</strong> {formatDate(transaction.createdAt)}
                            </Typography>
                          </Box>
                          {transaction.paymentMethod && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Método de pago:</strong> {transaction.paymentMethod}
                            </Typography>
                          )}
                          {transaction.trackingNumber && (
                            <Typography variant="body2">
                              <strong>Número de seguimiento:</strong> {transaction.trackingNumber}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="outlined"
                        onClick={() => handleViewTransaction(transaction.id)}
                        startIcon={<Visibility />}
                      >
                        Ver Detalles
                      </Button>
                      <Tooltip title="Chat con el vendedor">
                        <IconButton
                          onClick={() => handleOpenChat(transaction.id)}
                          color="primary"
                        >
                          <Chat />
                        </IconButton>
                      </Tooltip>
                      {canConfirmTransaction(transaction) && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleConfirmTransaction(transaction.id)}
                          startIcon={<CheckCircle />}
                        >
                          Confirmar Recepción
                        </Button>
                      )}
                      {canCancelTransaction(transaction) && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancelTransaction(transaction.id)}
                          startIcon={<Cancel />}
                        >
                          Cancelar
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Empty State */}
            {transactions.length === 0 && !isLoading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tienes compras realizadas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Explora el catálogo para encontrar cartas que te interesen
                </Typography>
                <Button variant="contained" onClick={() => navigate('/catalog')}>
                  Ver Catálogo
                </Button>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {/* Mis Ventas */}
            <Grid container spacing={3}>
              {transactions.map((transaction) => (
                <Grid size={{ xs: 12 }} key={transaction.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {transaction.listing?.cardBase?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {transaction.listing?.edition?.name}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(transaction.status)}
                          label={getStatusLabel(transaction.status)}
                          color={getStatusColor(transaction.status)}
                          variant="outlined"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Euro sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                              <strong>Total:</strong> {formatPrice(transaction.totalPrice)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2">
                              <strong>Cantidad:</strong> {transaction.quantity}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Person sx={{ fontSize: '1rem', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>Comprador:</strong> {transaction.buyer?.username}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ fontSize: '1rem', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>Fecha:</strong> {formatDate(transaction.createdAt)}
                            </Typography>
                          </Box>
                          {transaction.paymentMethod && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Método de pago:</strong> {transaction.paymentMethod}
                            </Typography>
                          )}
                          {transaction.trackingNumber && (
                            <Typography variant="body2">
                              <strong>Número de seguimiento:</strong> {transaction.trackingNumber}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="outlined"
                        onClick={() => handleViewTransaction(transaction.id)}
                        startIcon={<Visibility />}
                      >
                        Ver Detalles
                      </Button>
                      <Tooltip title="Chat con el comprador">
                        <IconButton
                          onClick={() => handleOpenChat(transaction.id)}
                          color="primary"
                        >
                          <Chat />
                        </IconButton>
                      </Tooltip>
                      {canCancelTransaction(transaction) && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancelTransaction(transaction.id)}
                          startIcon={<Cancel />}
                        >
                          Cancelar
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Empty State */}
            {transactions.length === 0 && !isLoading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Store sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tienes ventas realizadas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Crea listings de tus cartas para empezar a vender
                </Typography>
                <Button variant="contained" onClick={() => navigate('/create-listing')}>
                  Crear Listing
                </Button>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {/* Todas las transacciones */}
            <Grid container spacing={3}>
              {transactions.map((transaction) => (
                <Grid size={{ xs: 12 }} key={transaction.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {transaction.listing?.cardBase?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {transaction.listing?.edition?.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            icon={getStatusIcon(transaction.status)}
                            label={getStatusLabel(transaction.status)}
                            color={getStatusColor(transaction.status)}
                            variant="outlined"
                          />
                          <Chip
                            label={transaction.buyerId === transaction.sellerId ? 'Venta' : 'Compra'}
                            color={transaction.buyerId === transaction.sellerId ? 'secondary' : 'primary'}
                            size="small"
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Euro sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                              <strong>Total:</strong> {formatPrice(transaction.totalPrice)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2">
                              <strong>Cantidad:</strong> {transaction.quantity}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Person sx={{ fontSize: '1rem', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>Comprador:</strong> {transaction.buyer?.username}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ fontSize: '1rem', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>Fecha:</strong> {formatDate(transaction.createdAt)}
                            </Typography>
                          </Box>
                          {transaction.paymentMethod && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Método de pago:</strong> {transaction.paymentMethod}
                            </Typography>
                          )}
                          {transaction.trackingNumber && (
                            <Typography variant="body2">
                              <strong>Número de seguimiento:</strong> {transaction.trackingNumber}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="outlined"
                        onClick={() => handleViewTransaction(transaction.id)}
                        startIcon={<Visibility />}
                      >
                        Ver Detalles
                      </Button>
                      <Tooltip title={`Chat con ${transaction.buyerId === transaction.sellerId ? 'el comprador' : 'el vendedor'}`}>
                        <IconButton
                          onClick={() => handleOpenChat(transaction.id)}
                          color="primary"
                        >
                          <Chat />
                        </IconButton>
                      </Tooltip>
                      {canConfirmTransaction(transaction) && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleConfirmTransaction(transaction.id)}
                          startIcon={<CheckCircle />}
                        >
                          Confirmar Recepción
                        </Button>
                      )}
                      {canCancelTransaction(transaction) && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancelTransaction(transaction.id)}
                          startIcon={<Cancel />}
                        >
                          Cancelar
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Empty State */}
            {transactions.length === 0 && !isLoading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Visibility sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tienes transacciones
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Explora el catálogo para comprar o crea listings para vender
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="contained" onClick={() => navigate('/catalog')}>
                    Ver Catálogo
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/create-listing')}>
                    Crear Listing
                  </Button>
                </Box>
              </Box>
            )}
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default MyTransactions;
