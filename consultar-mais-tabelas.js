import { createClient } from '@supabase/supabase-js';

// URL e chave do Supabase
const SUPABASE_URL = 'https://oftsofxufkodyuaaohvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHNvZnh1ZmtvZHl1YWFvaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxOTM0ODEsImV4cCI6MjA1ODc2OTQ4MX0.ulagNHBmW9U3bmi7GJ-Im4FG5k3bbazfIssLNjPLo9I';

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function consultarMaisTabelas() {
  try {
    // Consulta para obter o schema das tabelas
    console.log('1. Consultando informações sobre as tabelas no schema public:');
    const { data: tableInfo, error: tableInfoError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tableInfoError) {
      console.error('Erro ao consultar schema das tabelas:', tableInfoError);
    } else {
      console.log('Tabelas no schema public:');
      console.log(tableInfo);
    }

    // Verificar se existem usuários no auth
    console.log('\n2. Verificando se existem função para consultar usuários:');
    const { data: authUsers, error: authUsersError } = await supabase
      .rpc('get_auth_users');
    
    if (authUsersError) {
      console.error('Erro ao consultar get_auth_users (função RPC):', authUsersError);
    } else {
      console.log('Usuários autenticados:', authUsers);
    }

    // Consultar tabela storage.buckets (se existir)
    console.log('\n3. Consultando storage.buckets:');
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .from('storage.buckets')
        .select('*');
      
      if (bucketsError) {
        console.error('Erro ao consultar storage.buckets:', bucketsError);
      } else {
        console.log('Buckets de armazenamento:', buckets);
      }
    } catch (e) {
      console.error('Exceção ao consultar storage.buckets:', e);
    }

    // Lista de nomes de tabelas específicas que queremos verificar
    const tablesToCheck = [
      'users',
      'mfa_factors',
      'audit_log_entries',
      'identities',
      'instances',
      'refresh_tokens',
      'sso_providers',
      'saml_providers',
      'saml_relay_states',
      'flow_state',
      'schema_migrations'
    ];
    
    // Verificar cada tabela da lista
    console.log('\n4. Verificando tabelas adicionais:');
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.log(`Tabela '${tableName}' não existe ou não é acessível:`, error.message);
        } else {
          console.log(`Tabela '${tableName}' existe e contém ${data} registros`);
        }
      } catch (e) {
        console.log(`Erro ao verificar tabela '${tableName}':`, e.message);
      }
    }

    // Tentar verificar se há gatilhos (triggers)
    console.log('\n5. Verificando triggers:');
    try {
      const { data: triggers, error: triggersError } = await supabase.rpc('check_trigger_exists');
      
      if (triggersError) {
        console.error('Erro ao verificar triggers:', triggersError);
      } else {
        console.log('Informação sobre triggers:', triggers);
      }
    } catch (e) {
      console.error('Exceção ao verificar triggers:', e);
    }
  } catch (e) {
    console.error('Exceção geral na consulta:', e);
  }
}

// Executa a consulta
consultarMaisTabelas(); 