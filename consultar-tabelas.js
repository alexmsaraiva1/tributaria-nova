import { createClient } from '@supabase/supabase-js';

// URL e chave do Supabase
const SUPABASE_URL = 'https://oftsofxufkodyuaaohvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHNvZnh1ZmtvZHl1YWFvaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxOTM0ODEsImV4cCI6MjA1ODc2OTQ4MX0.ulagNHBmW9U3bmi7GJ-Im4FG5k3bbazfIssLNjPLo9I';

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function consultarTabelas() {
  try {
    console.log('1. Consultando tabela profiles:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
    
    if (profilesError) {
      console.error('Erro ao consultar profiles:', profilesError);
    } else {
      console.log(`Encontrados ${profiles?.length || 0} registros em profiles:`);
      console.log(JSON.stringify(profiles, null, 2));
    }

    console.log('\n2. Consultando tabela chats:');
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .limit(10);
    
    if (chatsError) {
      console.error('Erro ao consultar chats:', chatsError);
    } else {
      console.log(`Encontrados ${chats?.length || 0} registros em chats:`);
      console.log(JSON.stringify(chats, null, 2));
    }

    console.log('\n3. Consultando tabela chat_histories:');
    const { data: chatHistories, error: chatHistoriesError } = await supabase
      .from('chat_histories')
      .select('*')
      .limit(10);
    
    if (chatHistoriesError) {
      console.error('Erro ao consultar chat_histories:', chatHistoriesError);
    } else {
      console.log(`Encontrados ${chatHistories?.length || 0} registros em chat_histories:`);
      console.log(JSON.stringify(chatHistories, null, 2));
    }

    console.log('\n4. Consultando tabela subscription_plans:');
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .limit(10);
    
    if (plansError) {
      console.error('Erro ao consultar subscription_plans:', plansError);
    } else {
      console.log(`Encontrados ${plans?.length || 0} registros em subscription_plans:`);
      console.log(JSON.stringify(plans, null, 2));
    }

    console.log('\n5. Consultando tabela subscriptions:');
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(10);
    
    if (subscriptionsError) {
      console.error('Erro ao consultar subscriptions:', subscriptionsError);
    } else {
      console.log(`Encontrados ${subscriptions?.length || 0} registros em subscriptions:`);
      console.log(JSON.stringify(subscriptions, null, 2));
    }

    // Tentar obter uma lista de todas as tabelas disponíveis
    console.log('\n6. Tentando listar todas as tabelas disponíveis:');
    try {
      const { data, error } = await supabase.rpc('list_tables');
      
      if (error) {
        console.error('Erro ao listar tabelas (função RPC):', error);
        console.log('A função list_tables pode não existir no Supabase.');
      } else {
        console.log('Tabelas disponíveis:', data);
      }
    } catch (e) {
      console.error('Exceção ao tentar listar tabelas:', e);
    }
  } catch (e) {
    console.error('Exceção na consulta de tabelas:', e);
  }
}

// Executa a consulta
consultarTabelas(); 