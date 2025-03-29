import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica o usuário atual e loga para depuração
    console.log('Verificando usuário atual no Supabase');
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (error) {
          console.error('Erro ao buscar usuário:', error);
        } else {
          console.log('Usuário atual:', data.user);
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro crítico ao buscar usuário:', err);
        setLoading(false);
      });

    // Inscreve para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Evento de autenticação:', _event, session?.user);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    console.log('Iniciando signUp no contexto:', { email, metadata });
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      console.log('Resposta do signUp:', response);
      
      const { data, error } = response;
      if (error) {
        console.error('Erro no signUp:', error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Exceção no signUp:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    console.log('Iniciando signIn no contexto:', { email });
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Resposta do signIn:', response);
      
      const { data, error } = response;
      if (error) {
        console.error('Erro no signIn:', error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Exceção no signIn:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro no signOut:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 