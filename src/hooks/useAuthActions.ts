import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuthActions = () => {
  const { login, register, logout, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate('/profile');
    } catch (error) {
      // Error is handled by AuthContext
      throw error;
    }
  }, [login, navigate]);

  const handleRegister = useCallback(async (
    email: string, 
    username: string, 
    password: string, 
    locationId: number
  ) => {
    try {
      await register(email, username, password, locationId);
      navigate('/profile');
    } catch (error) {
      // Error is handled by AuthContext
      throw error;
    }
  }, [register, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    isLoading,
    error,
    clearError,
  };
};
