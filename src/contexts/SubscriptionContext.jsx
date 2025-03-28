import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscriptions } from '../config/supabase';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext({});

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
    if (user) {
      loadCurrentSubscription();
    } else {
      setCurrentSubscription(null);
    }
  }, [user]);

  async function loadPlans() {
    try {
      const { data, error } = await subscriptions.getPlans();
      if (error) throw error;
      setPlans(data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  }

  async function loadCurrentSubscription() {
    try {
      setLoading(true);
      const { data, error } = await subscriptions.getCurrentSubscription();
      if (error && error.code !== 'PGRST116') throw error; // Ignora erro de não encontrado
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    currentSubscription,
    plans,
    loading,
    loadCurrentSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
} 