import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper,
} from '@mui/material';
import {
  ShoppingBag,
  CheckCircle,
  Euro,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import apiService from '../services/api';
import { Transaction, TransactionStatus } from '../types';

const MyPurchases: React.FC = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [purchases, setPurchases] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener solo las transacciones donde el usuario es el comprador
      const response = await apiService.getTransactions({
        type: 'buyer',
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      
      // Filtrar solo las transacciones entregadas (compras completadas)
      const completedPurchases = response.data.filter(
        (transaction: Transaction) => transaction.status === TransactionStatus.DELIVERED
      );
      
      setPurchases(completedPurchases);
    } catch (err) {
      console.error('Error loading purchases:', err);
      setError('Error al cargar tus compras');
      showError('Error al cargar tus compras');
    } finally {
      setLoading(false);
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
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingBag sx={{ fontSize: '2rem', mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Compras
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Aquí puedes ver todas las cartas que has comprado y recibido exitosamente.
        </Typography>
      </Box>

      {/* Stats */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: 'primary.50' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {purchases.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cartas Compradas
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {formatPrice(
                  purchases.reduce((total, purchase) => total + purchase.totalPrice, 0)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Gastado
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="info.main" fontWeight="bold">
                {purchases.reduce((total, purchase) => total + purchase.quantity, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cantidad Total
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ShoppingBag sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes compras aún
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cuando compres cartas y confirmes la recepción, aparecerán aquí.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {purchases.map((purchase) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={purchase.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Card Image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={purchase.listing?.cardBase?.imageUrl || '/placeholder-card.jpg'}
                  alt={purchase.listing?.cardBase?.name}
                  sx={{ objectFit: 'contain', p: 1 }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Card Name */}
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {purchase.listing?.cardBase?.name}
                  </Typography>
                  
                  {/* Edition */}
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {purchase.listing?.edition?.name}
                  </Typography>
                  
                  {/* Status */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      icon={<CheckCircle />}
                      label="Entregada"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  {/* Purchase Details */}
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Euro sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        <strong>Total:</strong> {formatPrice(purchase.totalPrice)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Cantidad:</strong> {purchase.quantity}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(purchase.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Vendido por: {purchase.seller?.username}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyPurchases;
