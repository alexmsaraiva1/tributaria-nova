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
  
  // Verifica autenticação ao carregar
  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('Usuário autenticado:', user);
        navigate('/app');
      } else {
        console.log('Usuário não autenticado');
      }
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
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };
  
  // Renderização principal com rotas
  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
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