const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// URL e chave do Supabase a partir das variáveis de ambiente
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ID do usuário obtido na consulta anterior
const USER_ID = '8bc93de8-7b05-4af8-aabd-4aea00cfa933';

// Função para criar perfil manualmente para um usuário existente
async function criarPerfilManual() {
  try {
    const { data, error } = await supabase.rpc('create_profile_for_user', { user_id: USER_ID });

    if (error) {
      console.error('Erro ao criar perfil:', error);
    } else {
      console.log('Resultado da criação do perfil:', data);
      
      if (data === true) {
        console.log('Perfil criado com sucesso!');
      } else if (data === false) {
        console.log('O perfil já existia.');
      }
    }
  } catch (e) {
    console.error('Exceção ao criar perfil:', e);
  }
}

// Função alternativa para criar perfil diretamente na tabela
async function criarPerfilDireto() {
  try {
    // Primeiro verifica se o perfil já existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil existente:', checkError);
      return;
    }
    
    if (existingProfile) {
      console.log('Perfil já existe:', existingProfile);
      return;
    }
    
    // Criar novo perfil
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: USER_ID,
        full_name: 'Alexandre Martins',
        email: 'alexandre@mlcomunicacao.com.br',
        updated_at: new Date()
      }])
      .select();
    
    if (error) {
      console.error('Erro ao inserir perfil diretamente:', error);
    } else {
      console.log('Perfil criado com sucesso:', data);
    }
  } catch (e) {
    console.error('Exceção ao criar perfil direto:', e);
  }
}

// Função para consultar o perfil após criá-lo
async function verificarPerfil() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID)
      .single();
    
    if (error) {
      console.error('Erro ao verificar perfil:', error);
    } else {
      console.log('Perfil encontrado:', data);
    }
  } catch (e) {
    console.error('Exceção ao verificar perfil:', e);
  }
}

// Executa as funções
async function main() {
  console.log('Iniciando criação de perfil...');
  
  // Primeiro tenta criar usando a função RPC
  // await criarPerfilManual();
  
  // Como a função RPC pode ter problema, vamos criar diretamente
  await criarPerfilDireto();
  
  // Verifica se o perfil foi criado
  await verificarPerfil();
}

main().catch(err => console.error('Erro na execução:', err)); 