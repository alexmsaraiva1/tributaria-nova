const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// URL e chave do Supabase a partir das variáveis de ambiente
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL do Supabase:', SUPABASE_URL);
console.log('Chave do Supabase disponível:', !!SUPABASE_ANON_KEY);

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para listar as tabelas do esquema público
async function listarTabelas() {
  try {
    const { data, error } = await supabase.rpc('list_tables');
    
    if (error) {
      console.error('Erro ao listar tabelas:', error);
      
      // Se a função RPC não existir, tenta criar
      if (error.code === 'PGRST404') {
        console.log('Função RPC list_tables não existe. Por favor, crie usando o SQL Editor no Supabase com o seguinte código:');
        console.log(`
        CREATE OR REPLACE FUNCTION public.list_tables()
        RETURNS TABLE (table_name text) AS $$
        BEGIN
          RETURN QUERY SELECT tables.table_name::text
          FROM information_schema.tables
          WHERE table_schema = 'public';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);
      }
    } else {
      console.log('Tabelas encontradas:', data);
    }
  } catch (e) {
    console.error('Exceção ao listar tabelas:', e);
  }
}

// Função para criar usuário diretamente na tabela auth.users (requer a service_role key)
async function criarUsuario() {
  console.log('Para criar um usuário diretamente na tabela auth.users, você precisa da chave service_role do Supabase.');
  console.log('Por razões de segurança, este script não tenta fazer isso diretamente.');
  console.log('Em vez disso, use a UI do Supabase para gerenciar usuários ou o Auth API para sign-ups.');
}

// Função para inserir um perfil manualmente com ID específico
async function inserirPerfilManual() {
  try {
    // Obter o ID do usuário existente na tabela auth.users
    const { data: userData, error: userError } = await supabase.rpc('get_auth_users');
    
    if (userError) {
      console.error('Erro ao obter usuários:', userError);
      console.log('Função get_auth_users pode não existir. Você pode criá-la com:');
      console.log(`
      CREATE OR REPLACE FUNCTION public.get_auth_users()
      RETURNS SETOF auth.users AS $$
      BEGIN
        RETURN QUERY SELECT * FROM auth.users;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `);
      return;
    }
    
    if (!userData || userData.length === 0) {
      console.log('Nenhum usuário encontrado na tabela auth.users');
      return;
    }
    
    console.log('Usuários encontrados:', userData.length);
    console.log('Primeiro usuário:', {
      id: userData[0].id,
      email: userData[0].email,
      created_at: userData[0].created_at
    });
    
    // Tenta inserir usando insert direto (tentando diferentes combinações de colunas)
    console.log('Tentando inserir perfil com ID do usuário:', userData[0].id);
    
    // Tentativa 1: apenas com ID
    const { data: insertData1, error: insertError1 } = await supabase
      .from('profiles')
      .insert({ id: userData[0].id })
      .select();
    
    if (insertError1) {
      console.log('Tentativa 1 falhou:', insertError1.message);
      
      // Tentativa 2: ID e updated_at
      const { data: insertData2, error: insertError2 } = await supabase
        .from('profiles')
        .insert({ 
          id: userData[0].id,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (insertError2) {
        console.log('Tentativa 2 falhou:', insertError2.message);
        console.log('Por favor, verifique a estrutura exata da tabela profiles no SQL Editor do Supabase com:');
        console.log(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles';
        `);
      } else {
        console.log('Perfil criado com sucesso (tentativa 2):', insertData2);
      }
    } else {
      console.log('Perfil criado com sucesso (tentativa 1):', insertData1);
    }
  } catch (e) {
    console.error('Exceção ao inserir perfil manual:', e);
  }
}

// Executa as funções
async function main() {
  console.log('Iniciando verificação de tabelas e colunas...');
  
  // Lista as tabelas
  await listarTabelas();
  
  // Tenta inserir perfil manualmente
  await inserirPerfilManual();
}

main().catch(err => console.error('Erro na execução:', err)); 