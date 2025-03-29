# Implementação do Chat no TributarIA - Guia Prático

## O que foi feito

As seguintes etapas já foram implementadas:

1. O arquivo `main.jsx` já inclui o `ChatProvider`:
   ```jsx
   import { ChatProvider } from './contexts/ChatContext'
   
   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <BrowserRouter>
         <AuthProvider>
           <SubscriptionProvider>
             <ChatProvider>
               <App />
             </ChatProvider>
           </SubscriptionProvider>
         </AuthProvider>
       </BrowserRouter>
     </React.StrictMode>,
   )
   ```

2. O arquivo `App.jsx` já foi modificado para usar o `ChatContainer`:
   ```jsx
   <Route path="/app" element={
     <ProtectedRoute>
       <ChatContainer />
     </ProtectedRoute>
   } />
   ```

3. Os componentes de chat já existem:
   - `src/components/chat/ChatContainer.jsx`
   - `src/components/chat/ChatList.jsx`
   - `src/components/chat/ChatInput.jsx`
   - `src/components/chat/ChatMessages.jsx`

## O que falta fazer

A única etapa pendente é a **criação das tabelas e políticas de segurança no Supabase**.

### Passos para criar as tabelas no Supabase:

1. Acesse o dashboard do Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione o projeto do TributarIA
3. Clique em "SQL Editor" na barra lateral esquerda
4. Clique em "New Query" (Nova Consulta)
5. Cole o seguinte código SQL:

```sql
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
DROP POLICY IF EXISTS "Usuários podem ver seus próprios chats" ON public.chats;
CREATE POLICY "Usuários podem ver seus próprios chats" 
  ON public.chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Criar política para permitir que usuários criem seus próprios chats
DROP POLICY IF EXISTS "Usuários podem criar seus próprios chats" ON public.chats;
CREATE POLICY "Usuários podem criar seus próprios chats" 
  ON public.chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Criar política para permitir que usuários atualizem seus próprios chats
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios chats" ON public.chats;
CREATE POLICY "Usuários podem atualizar seus próprios chats" 
  ON public.chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Criar política para permitir que usuários vejam mensagens de seus próprios chats
DROP POLICY IF EXISTS "Usuários podem ver mensagens de seus próprios chats" ON public.chat_histories;
CREATE POLICY "Usuários podem ver mensagens de seus próprios chats" 
  ON public.chat_histories 
  FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.chats WHERE id = chat_id));

-- Criar política para permitir que usuários criem mensagens em seus próprios chats
DROP POLICY IF EXISTS "Usuários podem criar mensagens em seus próprios chats" ON public.chat_histories;
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

DROP TRIGGER IF EXISTS update_chats_updated_at ON public.chats;
CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

6. Clique no botão "Run" (Executar) para criar as tabelas

### Verificando se a implementação foi bem-sucedida:

1. No menu lateral do Supabase, clique em "Table Editor" (Editor de Tabelas)
2. Verifique se as tabelas `chats` e `chat_histories` foram criadas
3. Clique em cada tabela e verifique nas guias "Policies" se as políticas RLS foram criadas corretamente
4. Se você já tiver usuários registrados, você pode também verificar no painel Authentication > Users

## Testando o aplicativo

Após executar o SQL no Supabase:

1. Execute o aplicativo com `npm run dev`
2. Acesse a aplicação no navegador
3. Faça login com suas credenciais
4. Você deverá ver a interface de chat completa em vez da tela de boas-vindas
5. Teste as funcionalidades:
   - Criar uma nova conversa
   - Enviar mensagens
   - Receber respostas

## Resolução de problemas

Se ainda houver problemas com a interface de chat:

1. Verifique o console do navegador (F12) para erros JavaScript
2. Verifique se as tabelas foram criadas corretamente no Supabase
3. Verifique se as conexões com a API do Supabase estão funcionando (confira os logs no console)
4. Se necessário, reinicie o servidor de desenvolvimento 