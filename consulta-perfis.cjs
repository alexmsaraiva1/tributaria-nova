const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// URL e chave do Supabase a partir das variáveis de ambiente
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Conectando ao Supabase com:');
console.log('URL:', SUPABASE_URL);
console.log('Key disponível:', !!SUPABASE_ANON_KEY);

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para listar todos os perfis
async function listarPerfis() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Erro ao listar perfis:', error);
    } else {
      console.log('Total de perfis encontrados:', data?.length || 0);
      console.log('Perfis:', data);
    }
  } catch (e) {
    console.error('Exceção ao listar perfis:', e);
  }
}

// Função para verificar se existe o trigger de criação de perfil
async function verificarTrigger() {
  try {
    // Usando a função RPC que criamos no supabase-functions.sql
    const { data, error } = await supabase.rpc('check_trigger_exists');

    if (error) {
      console.error('Erro ao verificar trigger:', error);
      console.log('Talvez você ainda não tenha criado a função RPC check_trigger_exists.');
    } else {
      console.log('Trigger exists:', data);
      if (data && data.trigger_exists) {
        console.log('O trigger on_auth_user_created está ativo!');
      } else {
        console.log('O trigger on_auth_user_created NÃO existe. Você precisa criá-lo.');
      }
    }
  }  catch (e) {
    console.error('Exceção ao verificar trigger:', e);
  }
}

// Função para consultar usuários no auth.users
async function consultarUsuariosAuth() {
  try {
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

// Executa as funções
async function main() {
  console.log('Iniciando consultas...');
  await listarPerfis();
  await verificarTrigger();
  await consultarUsuariosAuth();
}

main().catch(err => console.error('Erro na execução:', err)); 