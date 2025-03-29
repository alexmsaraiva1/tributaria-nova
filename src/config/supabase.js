import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Imprime as variáveis para depuração
console.log('Configuração do Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key disponível:', !!supabaseAnonKey);

// Verifica se as variáveis existem
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: Variáveis de ambiente do Supabase não encontradas!');
  throw new Error('Supabase URL e Anon Key são necessários');
}

// Cria o cliente Supabase
let supabase;
try {
  console.log('Criando cliente Supabase...');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Cliente Supabase criado com sucesso!');
} catch (error) {
  console.error('ERRO ao criar cliente Supabase:', error);
  throw error;
}

// Exporta o cliente
export { supabase };

// Funções auxiliares para autenticação
export const auth = {
  signUp: async ({ email, password, ...metadata }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Funções auxiliares para perfil do usuário
export const profiles = {
  get: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  update: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    return { data, error };
  },
};

// Funções auxiliares para chats
export const chats = {
  list: async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  create: async (title) => {
    const { data, error } = await supabase
      .from('chats')
      .insert([{ title }])
      .select()
      .single();
    return { data, error };
  },

  getMessages: async (chatId) => {
    const { data, error } = await supabase
      .from('chat_histories')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  sendMessage: async (chatId, message, role = 'user') => {
    const { data, error } = await supabase
      .from('chat_histories')
      .insert([{
        chat_id: chatId,
        message,
        role,
      }])
      .select()
      .single();
    return { data, error };
  },
};

// Funções auxiliares para assinaturas
export const subscriptions = {
  getCurrentSubscription: async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  getPlans: async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });
    return { data, error };
  },
}; 