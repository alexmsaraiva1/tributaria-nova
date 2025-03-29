const { createClient } = require('@supabase/supabase-js');

// URL e chave do Supabase
const SUPABASE_URL = 'https://oftsofxufkodyuaaohvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHNvZnh1ZmtvZHl1YWFvaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjU0MTEsImV4cCI6MjA1ODQ0MTQxMX0.RRbs_K4Sypu8mjFYHJYajlT6qcwIjKnA73_cC7NJ5-Y';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Deve ser definido no ambiente

// Cria o cliente Supabase com a chave de serviço (não a de anonimo)
// A chave de serviço é necessária para acessar a API de Admin
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY);

// Importante: As funções abaixo só funcionarão se for utilizada a chave de serviço
// A chave anônima não tem permissões para estas operações

// Função para listar usuários (requer chave de serviço)
async function listarUsuarios() {
  try {
    // Usando a API de administração
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('Erro ao listar usuários:', error);
    } else {
      console.log('Usuários:', data);
    }
  } catch (e) {
    console.error('Exceção ao listar usuários:', e);
    console.log('Importante: Você está usando a chave de serviço? A chave anônima não tem permissão para esta operação.');
  }
}

// Função para buscar usuário por ID (requer chave de serviço)
async function buscarUsuarioPorId(userId) {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error(`Erro ao buscar usuário com ID ${userId}:`, error);
    } else {
      console.log(`Usuário com ID ${userId}:`, data);
    }
  } catch (e) {
    console.error(`Exceção ao buscar usuário com ID ${userId}:`, e);
    console.log('Importante: Você está usando a chave de serviço? A chave anônima não tem permissão para esta operação.');
  }
}

// Função para criar perfil para um usuário que não tem (usando as tabelas públicas)
async function criarPerfil(userId, nome = 'Novo Usuário') {
  try {
    // Primeiro verifica se o perfil já existe
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil existente:', profileError);
      return;
    }
    
    if (existingProfile) {
      console.log(`Perfil para usuário ${userId} já existe:`, existingProfile);
      return;
    }
    
    // Criar o perfil se não existir
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, nome: nome }])
      .select();
    
    if (error) {
      console.error(`Erro ao criar perfil para usuário ${userId}:`, error);
    } else {
      console.log(`Perfil criado para usuário ${userId}:`, data);
    }
  } catch (e) {
    console.error(`Exceção ao criar perfil para usuário ${userId}:`, e);
  }
}

// Executa as consultas (você precisará adicionar um ID real)
// Por exemplo: const userId = '123e4567-e89b-12d3-a456-426614174000';
console.log('Iniciando operações de administração de usuários...');
listarUsuarios();
// Descomente e substitua com um ID real para testar
// buscarUsuarioPorId(userId);
// criarPerfil(userId, 'Nome do Usuário');

console.log('NOTA: Se estiver vendo erros de permissão, é porque você precisa usar a chave de serviço do Supabase.');
console.log('Defina a variável de ambiente SUPABASE_SERVICE_KEY antes de executar este script.'); 