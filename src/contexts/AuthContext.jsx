import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { profiles } from '../config/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega o perfil do usuário
  const loadProfile = async (userId) => {
    if (!userId) return;
    
    try {
      const { data, error } = await profiles.get(userId);
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  // Salvar usuário no localStorage para o webhook
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('userId', user.id);
    } else {
      localStorage.removeItem('userId');
    }
  }, [user]);

  useEffect(() => {
    // Verifica o usuário atual
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (!error && data.user) {
          setUser(data.user);
          localStorage.setItem('userId', data.user.id);
          loadProfile(data.user.id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar usuário:', err);
        setLoading(false);
      });

    // Inscreve para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        localStorage.setItem('userId', currentUser.id);
        loadProfile(currentUser.id);
      } else {
        localStorage.removeItem('userId');
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Salvar o ID do usuário no localStorage
      if (data.user) {
        localStorage.setItem('userId', data.user.id);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Remover o ID do usuário do localStorage
      localStorage.removeItem('userId');
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
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