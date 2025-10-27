import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, AuthResponse } from '../types';
import apiService from '../services/api';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, locationId: number) => Promise<AuthResponse>;
  logout: () => void;
  clearError: () => void;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthResponse }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'AUTH_INIT_COMPLETE' };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check for existing token
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log('AuthReducer: Action', action.type, 'Current state:', state);
  
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.access_token,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'AUTH_INIT_COMPLETE':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch({ type: 'AUTH_START' });
      apiService.getCurrentUser()
        .then((user) => {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, access_token: token, refresh_token: '' } });
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
        });
    } else {
      // Si no hay token, marcar inicialización como completa
      dispatch({ type: 'AUTH_INIT_COMPLETE' });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      dispatch({ type: 'AUTH_START' });
      const response = await apiService.login({ email, password });
      console.log('AuthContext: Login successful, setting token');
      localStorage.setItem('authToken', response.access_token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response });
      console.log('AuthContext: Login state updated');
    } catch (error: any) {
      console.log('AuthContext: Login failed', error);
      console.log('AuthContext: Error response', error.response);
      console.log('AuthContext: Error response data', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      console.log('AuthContext: Final error message', errorMessage);
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string, locationId: number) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await apiService.register({ email, username, password, locationId });
      // No hacer login automático después del registro
      dispatch({ type: 'AUTH_INIT_COMPLETE' }); // Marcar como completado sin error
      return response; // Devolver la respuesta para mostrar éxito
    } catch (error: any) {
      console.log('AuthContext: Register failed', error);
      console.log('AuthContext: Error response', error.response);
      console.log('AuthContext: Error response data', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear la cuenta';
      console.log('AuthContext: Final error message', errorMessage);
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
