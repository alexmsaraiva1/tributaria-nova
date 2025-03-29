import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscriptions } from '../config/supabase';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext({});

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [plans, setPlans] = useState([
    // Planos padrão para caso a API falhe
    {
      id: 1,
      name: 'Básico',
      price: 47,
      description: 'Perfeito para começar a usar a tributarIA',
      features: ['Perguntas ilimitadas', 'Histórico de conversas salvo', 'Atualizações contínuas', 'Suporte por email']
    },
    {
      id: 2,
      name: 'Premium',
      price: 97,
      description: 'Acesso completo a todos os recursos avançados',
      features: ['Tudo do plano básico', 'Biblioteca de referências oficiais', 'Análises comparativas fiscais', 'Simulações práticas de cenários', 'Alertas de mudanças na legislação', 'Suporte prioritário']
    }
  ]);
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
      console.log('Tentando carregar planos de assinatura...');
      const { data, error } = await subscriptions.getPlans();
      if (error) {
        console.error('Erro ao carregar planos:', error);
        return; // Mantém os planos padrão
      }
      
      console.log('Planos carregados com sucesso:', data);
      if (data && data.length > 0) {
        setPlans(data);
      }
    } catch (error) {
      console.error('Exceção ao carregar planos:', error);
    }
  }

  async function loadCurrentSubscription() {
    try {
      setLoading(true);
      console.log('Tentando carregar assinatura atual...');
      const { data, error } = await subscriptions.getCurrentSubscription();
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar assinatura:', error);
        throw error;
      }
      
      console.log('Assinatura atual carregada:', data);
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Exceção ao carregar assinatura:', error);
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