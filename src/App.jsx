import React, { useEffect } from 'react';
import LandingPage from './components/LandingPage';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ChatContainer from './components/chat/ChatContainer';

const TributarIA = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redireciona para a app se autenticado
  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);
  
  // Componente para proteger rotas
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return user ? children : <Navigate to="/login" />;
  };
  
  // Spinner de carregamento
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? <LoadingSpinner /> : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/app" element={
            <ProtectedRoute>
              <ChatContainer />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
};

export default TributarIA;