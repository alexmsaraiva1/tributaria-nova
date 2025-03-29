const { createClient } = require('@supabase/supabase-js');

// URL e chave do Supabase
const SUPABASE_URL = 'https://oftsofxufkodyuaaohvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHNvZnh1ZmtvZHl1YWFvaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjU0MTEsImV4cCI6MjA1ODQ0MTQxMX0.RRbs_K4Sypu8mjFYHJYajlT6qcwIjKnA73_cC7NJ5-Y';

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para testar o login
async function testarLogin() {
  try {
    // Teste com um email e senha de exemplo
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'teste@exemplo.com',
      password: 'senha123'
    });

    if (error) {
      console.error('Erro de login:', error);
    } else {
      console.log('Login bem-sucedido:', data);
    }
  } catch (e) {
    console.error('Exceção no teste de login:', e);
  }
}

// Função para testar o registro
async function testarRegistro() {
  try {
    // Teste com um email e senha novos
    const { data, error } = await supabase.auth.signUp({
      email: 'novo@exemplo.com',
      password: 'senha123456',
      options: {
        data: {
          nome: 'Usuário Teste',
          telefone: '11999999999'
        }
      }
    });

    if (error) {
      console.error('Erro de registro:', error);
    } else {
      console.log('Registro bem-sucedido:', data);
    }
  } catch (e) {
    console.error('Exceção no teste de registro:', e);
  }
}

// Executa os testes
console.log('Iniciando testes do Supabase...');
testarLogin();
testarRegistro(); 