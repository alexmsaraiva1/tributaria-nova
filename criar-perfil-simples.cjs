const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// URL e chave do Supabase a partir das variáveis de ambiente
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL do Supabase:', SUPABASE_URL);
console.log('Chave do Supabase disponível:', !!SUPABASE_ANON_KEY);

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ID do usuário obtido na consulta anterior
const USER_ID = '8bc93de8-7b05-4af8-aabd-4aea00cfa933';

// Função para inserir perfil diretamente na tabela
async function inserirPerfil() {
  try {
    // Criar novo perfil
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: USER_ID,
        email: 'alexandre@mlcomunicacao.com.br',
        full_name: 'Alexandre Martins'
      })
      .select();
    
    if (error) {
      console.error('Erro ao inserir perfil:', error);
    } else {
      console.log('Perfil criado com sucesso:', data);
    }
  } catch (e) {
    console.error('Exceção ao inserir perfil:', e);
  }
}

// Função para consultar o perfil após criá-lo
async function verificarPerfil() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID);
    
    if (error) {
      console.error('Erro ao verificar perfil:', error);
    } else {
      console.log('Total de perfis encontrados:', data.length);
      console.log('Perfis:', data);
    }
  } catch (e) {
    console.error('Exceção ao verificar perfil:', e);
  }
}

// Função para verificar a tabela profiles
async function verificarTabela() {
  try {
    // Verifica se a tabela profiles existe obtendo todos os registros
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erro ao verificar tabela profiles:', error);
    } else {
      console.log('Tabela profiles existe! Número de registros retornados:', data.length);
    }
  } catch (e) {
    console.error('Exceção ao verificar tabela profiles:', e);
  }
}

// Executa as funções
async function main() {
  console.log('Iniciando verificação e criação de perfil...');
  
  // Primeiro verifica se a tabela existe
  await verificarTabela();
  
  // Verifica se o perfil já existe
  await verificarPerfil();
  
  // Insere o perfil se necessário
  console.log('Inserindo perfil...');
  await inserirPerfil();
  
  // Verifica novamente se o perfil foi criado
  console.log('Verificando se o perfil foi criado:');
  await verificarPerfil();
}

main().catch(err => console.error('Erro na execução:', err)); 