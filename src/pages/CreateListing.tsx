import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import CardSelector from '../components/features/CardSelector';
import ListingForm from '../components/features/ListingForm';
import ListingPreview from '../components/features/ListingPreview';
import { CardBase, Edition, ListingCondition, Listing } from '../types';
import apiService from '../services/api';

const steps = ['Seleccionar Carta', 'Configurar Listing', 'Revisar y Publicar'];

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

  const handleCardSelect = (card: CardBase, edition: Edition) => {
    setSelectedCard(card);
    setSelectedEdition(edition);
    handleNext();
  };

  const handleListingDataChange = (data: Partial<typeof listingData>) => {
    setListingData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!selectedCard || !selectedEdition) {
      setError('Por favor selecciona una carta y edición');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newListing: Partial<Listing> = {
        cardId: selectedCard.id,
        editionId: selectedEdition.id,
        condition: listingData.condition,
        isFoil: listingData.isFoil,
        price: listingData.price,
        quantity: listingData.quantity,
        ...(listingData.description && listingData.description.trim().length > 0 && { description: listingData.description }),
        images: listingData.images,
        // isActive se establece automáticamente en el backend
      };

      await apiService.createListing(newListing);
      
      showNotification('Listing creado exitosamente', 'success');
      navigate('/my-listings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el listing');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CardSelector
            onCardSelect={handleCardSelect}
            onBack={() => navigate('/my-listings')}
          />
        );
      case 1:
        return (
          <ListingForm
            card={selectedCard!}
            edition={selectedEdition!}
            data={listingData}
            onChange={handleListingDataChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ListingPreview
            card={selectedCard!}
            edition={selectedEdition!}
            data={listingData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crear Nuevo Listing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Publica tu carta para vender en TradeBinder
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

export default CreateListing;
