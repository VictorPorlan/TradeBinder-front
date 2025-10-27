import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import AuthForm from '../components/common/AuthForm';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (data: Record<string, string>) => {
    try {
      console.log('Login: Starting login process');
      clearError(); // Limpiar errores previos
      await login(data.email, data.password);
      console.log('Login: Login successful');
      showSuccess('¡Bienvenido! Has iniciado sesión correctamente.');
    } catch (error: any) {
      console.log('Login: Login failed', error);
      console.log('Login: Error response', error.response);
      console.log('Login: Error message', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      console.log('Login: Final error message', errorMessage);
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
      name: 'password',
      label: 'Contraseña',
      type: 'password' as const,
      required: true,
      placeholder: '••••••••',
    },
  ];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <AuthForm
        title="Iniciar Sesión"
        fields={fields}
        submitText="Iniciar Sesión"
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error || undefined}
        linkText="¿No tienes cuenta?"
        linkHref="/register"
        linkLabel="Regístrate aquí"
      />
    </Container>
  );
};

export default Login;
