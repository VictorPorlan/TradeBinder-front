import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import CardSearch from './pages/CardSearch';
import CardDetail from './pages/CardDetail';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import EditListing from './pages/EditListing';
import ListingDetail from './pages/ListingDetail';
import MyTransactions from './pages/MyTransactions';
import TransactionDetail from './pages/TransactionDetail';
import TransactionChat from './pages/TransactionChat';
import MyPurchases from './pages/MyPurchases';
import ProtectedRoute from './components/common/ProtectedRoute';

// Configuración del tema MaterialUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Cargando aplicación..." />;
  }

  return (
    <Routes>
      {/* Rutas públicas con Layout */}
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } 
      key="home"
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : 
          <Layout>
            <Login />
          </Layout>
        } 
        key="login"
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : 
          <Layout>
            <Register />
          </Layout>
        } 
        key="register"
      />
      <Route path="/catalog" element={
        <Layout>
          <Catalog />
        </Layout>
      } 
      key="catalog"
      />
      <Route 
        path="/listing/:id" 
        element={
          <Layout>
            <ListingDetail />
          </Layout>
        } 
        key="listing-detail"
      />
      <Route path="/announcements" element={
        <Layout>
          <Announcements />
        </Layout>
      } 
      key="announcements"
      />
      
      {/* Rutas de cartas */}
      <Route path="/cards" element={
        <Layout>
          <CardSearch />
        </Layout>
      } 
      key="cards"
      />
      <Route 
        path="/cards/:id" 
        element={
          <Layout>
            <ProtectedRoute>
              <CardDetail />
            </ProtectedRoute>
          </Layout>
        } 
        key="card-detail"
      />
      
      {/* Rutas protegidas */}
      <Route 
        path="/profile" 
        element={
          <Layout>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Layout>
        } 
        key="profile"
      />
      <Route 
        path="/create-listing" 
        element={
          <Layout>
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          </Layout>
        } 
        key="create-listing"
      />
      <Route 
        path="/my-listings" 
        element={
          <Layout>
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          </Layout>
        } 
        key="my-listings"
      />
      <Route 
        path="/edit-listing/:id" 
        element={
          <Layout>
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          </Layout>
        } 
        key="edit-listing"
      />
      <Route 
        path="/transactions" 
        element={
          <Layout>
            <ProtectedRoute>
              <MyTransactions />
            </ProtectedRoute>
          </Layout>
        } 
        key="transactions"
      />
      <Route 
        path="/transaction/:id" 
        element={
          <Layout>
            <ProtectedRoute>
              <TransactionDetail />
            </ProtectedRoute>
          </Layout>
        } 
        key="transaction-detail"
      />
      <Route 
        path="/transaction/:transactionId/chat" 
        element={
          <Layout>
            <ProtectedRoute>
              <TransactionChat />
            </ProtectedRoute>
          </Layout>
        } 
        key="transaction-chat"
      />
      <Route 
        path="/my-purchases" 
        element={
          <Layout>
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          </Layout>
        } 
        key="my-purchases"
      />
      
      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;