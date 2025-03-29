const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// URL e chave do Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Chave de serviço com permissões admin

console.log('URL do Supabase:', SUPABASE_URL);
console.log('Chave de serviço disponível:', !!SUPABASE_SERVICE_KEY);

if (!SUPABASE_SERVICE_KEY) {
  console.error('ERRO: Chave de serviço do Supabase não encontrada!');
  console.error('Crie um arquivo .env.local com SUPABASE_SERVICE_KEY=sua-chave-service-role');
  process.exit(1);
}

// Cria o cliente Supabase com a chave de serviço
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ID do usuário obtido anteriormente
const USER_ID = '8bc93de8-7b05-4af8-aabd-4aea00cfa933';

// Função para inserir perfil usando a chave de serviço
async function inserirPerfilComoAdmin() {
  try {
    // Como estamos usando a chave service_role, podemos diretamente acessar auth.users
    console.log('Obtendo usuário do sistema de autenticação...');
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(USER_ID);
    
    if (authError) {
      console.error('Erro ao buscar usuário via API Admin:', authError);
      return;
    }
    
    if (!authUser || !authUser.user) {
      console.error('Usuário não encontrado');
      return;
    }
    
    console.log('Usuário encontrado:', {
      id: authUser.user.id,
      email: authUser.user.email,
      created_at: authUser.user.created_at
    });
    
    // Verificar se o perfil já existe
    console.log('Verificando se o perfil já existe...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID);
    
    if (profileError) {
      console.error('Erro ao verificar perfil existente:', profileError);
      return;
    }
    
    if (existingProfile && existingProfile.length > 0) {
      console.log('Perfil já existe:', existingProfile[0]);
      return;
    }
    
    // Inserir o perfil
    console.log('Criando novo perfil...');
    const { data: insertResult, error: insertError } = await supabase
      .from('profiles')
      .insert({ 
        id: USER_ID, 
        updated_at: new Date().toISOString() 
      })
      .select();
    
    if (insertError) {
      console.error('Erro ao inserir perfil:', insertError);
    } else {
      console.log('Perfil criado com sucesso:', insertResult);
    }
    
    // Verificar se o perfil foi criado
    console.log('Verificando perfil recém-criado...');
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID);
    
    if (verifyError) {
      console.error('Erro ao verificar perfil criado:', verifyError);
    } else {
      console.log('Verificação final - perfis encontrados:', verifyProfile.length);
      console.log('Dados do perfil:', verifyProfile[0]);
    }
    
  } catch (e) {
    console.error('Exceção:', e);
  }
}

// Executar função
inserirPerfilComoAdmin().catch(err => console.error('Erro na execução:', err)); 