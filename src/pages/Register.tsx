import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import AuthForm from '../components/common/AuthForm';
import { Location } from '../types';
import apiService from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await apiService.getLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
        showError('Error al cargar las ubicaciones disponibles');
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [showError]);

  const handleRegister = async (data: Record<string, string>) => {
    try {
      console.log('Register: Starting register process');
      clearError(); // Limpiar errores previos
      const locationId = parseInt(data.locationId);
      if (!locationId) {
        showError('Por favor selecciona una ubicación');
        return;
      }
      
      await register(data.email, data.username, data.password, locationId);
      console.log('Register: Register successful');
      showSuccess('¡Cuenta creada exitosamente! Por favor, inicia sesión con tus credenciales.');
      navigate('/login');
    } catch (error: any) {
      console.log('Register: Register failed', error);
      console.log('Register: Error response', error.response);
      console.log('Register: Error message', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear la cuenta';
      console.log('Register: Final error message', errorMessage);
      showError(errorMessage);
    }
  };

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'tu@email.com',
    },
    {
      name: 'username',
      label: 'Nombre de usuario',
      type: 'text' as const,
      required: true,
      placeholder: 'tu_usuario',
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password' as const,
      required: true,
      placeholder: '••••••••',
    },
    {
      name: 'locationId',
      label: 'Ubicación',
      type: 'select' as const,
      required: true,
      options: locations.map(location => ({
        value: location.id.toString(),
        label: location.name,
      })),
      placeholder: 'Selecciona tu ubicación',
    },
  ];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <AuthForm
        title="Crear Cuenta"
        fields={fields}
        submitText="Registrarse"
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error || undefined}
        linkText="¿Ya tienes cuenta?"
        linkHref="/login"
        linkLabel="Inicia sesión aquí"
      />
    </Container>
  );
};

export default Register;
