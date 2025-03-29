const { createClient } = require('@supabase/supabase-js');

// URL e chave do Supabase (use os mesmos do arquivo de teste)
const SUPABASE_URL = 'https://oftsofxufkodyuaaohvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHNvZnh1ZmtvZHl1YWFvaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjU0MTEsImV4cCI6MjA1ODQ0MTQxMX0.RRbs_K4Sypu8mjFYHJYajlT6qcwIjKnA73_cC7NJ5-Y';

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para consultar usuários no auth.users
async function consultarUsuariosAuth() {
  try {
    // Esta consulta requer funções RPC ou uma função personalizada
    // Uma vez que auth.users está em um schema protegido
    const { data, error } = await supabase.rpc('get_auth_users');

    if (error) {
      console.error('Erro ao consultar auth.users:', error);
    } else {
      console.log('Usuários em auth.users:', data);
    }
  } catch (e) {
    console.error('Exceção na consulta auth.users:', e);
  }
}

// Função para consultar usuários na tabela profiles
async function consultarProfiles() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Erro ao consultar profiles:', error);
    } else {
      console.log('Usuários em profiles:', data);
    }
  } catch (e) {
    console.error('Exceção na consulta profiles:', e);
  }
}

// Função para consultar um usuário específico por email (através da função RPC)
async function consultarUsuarioPorEmail(email) {
  try {
    // Esta consulta requer uma função RPC personalizada
    const { data, error } = await supabase.rpc('find_user_by_email', { user_email: email });

    if (error) {
      console.error(`Erro ao consultar usuário com email ${email}:`, error);
    } else {
      console.log(`Usuário com email ${email}:`, data);
    }
  } catch (e) {
    console.error(`Exceção na consulta do usuário com email ${email}:`, e);
  }
}

// Executa as consultas
console.log('Iniciando consultas ao Supabase...');
consultarUsuariosAuth();
consultarProfiles();
consultarUsuarioPorEmail('teste@exemplo.com'); 