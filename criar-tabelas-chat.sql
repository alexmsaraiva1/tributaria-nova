-- Verificar se as tabelas de chat existem
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'chats'
) AS "tabela_chats_existe";

SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'chat_histories'
) AS "tabela_chat_histories_existe";

-- Criar tabela de chats se não existir
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar comentário à tabela
COMMENT ON TABLE public.chats IS 'Conversas dos usuários com a assistente tributarIA';

-- Criar tabela de histórico de chat se não existir
CREATE TABLE IF NOT EXISTS public.chat_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')), -- user ou assistant
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar comentário à tabela
COMMENT ON TABLE public.chat_histories IS 'Histórico de mensagens das conversas dos usuários';

-- Configurar RLS (Row Level Security)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_histories ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que usuários vejam apenas seus próprios chats
CREATE POLICY "Usuários podem ver seus próprios chats" 
  ON public.chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Criar política para permitir que usuários criem seus próprios chats
CREATE POLICY "Usuários podem criar seus próprios chats" 
  ON public.chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Criar política para permitir que usuários atualizem seus próprios chats
CREATE POLICY "Usuários podem atualizar seus próprios chats" 
  ON public.chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Criar política para permitir que usuários vejam mensagens de seus próprios chats
CREATE POLICY "Usuários podem ver mensagens de seus próprios chats" 
  ON public.chat_histories 
  FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.chats WHERE id = chat_id));

-- Criar política para permitir que usuários criem mensagens em seus próprios chats
CREATE POLICY "Usuários podem criar mensagens em seus próprios chats" 
  ON public.chat_histories 
  FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.chats WHERE id = chat_id));

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_chat_id ON public.chat_histories(chat_id);

-- Trigger para atualizar o campo updated_at quando um chat é atualizado
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 