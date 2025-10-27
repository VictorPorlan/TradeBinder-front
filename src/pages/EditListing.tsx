import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ListingForm from '../components/features/ListingForm';
import ListingPreview from '../components/features/ListingPreview';
import { CardBase, Edition, ListingCondition, Listing } from '../types';
import apiService from '../services/api';

const steps = ['Configurar Listing', 'Revisar y Actualizar'];

const EditListing: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [originalListing, setOriginalListing] = useState<Listing | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardBase | null>(null);
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [listingData, setListingData] = useState({
    condition: ListingCondition.NEAR_MINT,
    isFoil: false,
    price: 0,
    quantity: 1,
    description: '',
    images: [] as string[],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (id) {
      loadListing();
    }
  }, [isAuthenticated, navigate, id]);

  const loadListing = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const listing = await apiService.getListingById(parseInt(id));
      setOriginalListing(listing);
      
      // Cargar datos del listing existente
      setSelectedCard(listing.cardBase || null);
      setSelectedEdition(listing.edition || null);
      setListingData({
        condition: listing.condition,
        isFoil: listing.isFoil,
        price: listing.price,
        quantity: listing.quantity,
        description: listing.description || '',
        images: listing.images || [],
      });
      
      // Ir directamente al paso de configuración ya que no se puede cambiar la carta
      setActiveStep(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el listing');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-disable foil if edition doesn't support it
  useEffect(() => {
    if (selectedEdition && !selectedEdition.hasFoil && listingData.isFoil) {
      setListingData(prev => ({ ...prev, isFoil: false }));
    }
  }, [selectedEdition, listingData.isFoil]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleListingDataChange = (data: Partial<typeof listingData>) => {
    setListingData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!selectedCard || !selectedEdition || !id) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updateData: Partial<Listing> = {
        condition: listingData.condition,
        isFoil: listingData.isFoil,
        price: listingData.price,
        quantity: listingData.quantity,
        ...(listingData.description && listingData.description.trim().length > 0 && { description: listingData.description }),
        images: listingData.images,
      };

      await apiService.updateListing(parseInt(id), updateData);
      
      showNotification('Listing actualizado exitosamente', 'success');
      navigate('/my-listings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el listing');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ListingForm
            card={selectedCard!}
            edition={selectedEdition!}
            data={listingData}
            onChange={handleListingDataChange}
            onBack={() => navigate('/my-listings')}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <ListingPreview
            card={selectedCard!}
            edition={selectedEdition!}
            data={listingData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            submitText="Actualizar Listing"
          />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !originalListing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/my-listings')}>
          Volver a Mis Listings
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Listing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Modifica los detalles de tu carta en TradeBinder
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {renderStepContent(activeStep)}
      </Paper>
    </Container>
  );
};

export default EditListing;
