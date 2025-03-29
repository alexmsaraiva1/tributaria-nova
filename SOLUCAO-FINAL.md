# Solução para o Problema de Perfis no Supabase

## Diagnóstico

Após análise, identificamos o seguinte problema:

1. Usuários são criados no sistema de autenticação do Supabase (`auth.users`), mas 
2. Não são criados automaticamente na tabela `profiles` no esquema público
3. O acesso à tabela `profiles` está protegido por Row Level Security (RLS), o que impede inserções diretas

## Solução Completa

Siga os passos abaixo para resolver o problema:

### 1. Configurar Estrutura da Tabela Profiles

Execute as seguintes consultas SQL no editor SQL do Supabase:

```sql
-- Verificar estrutura da tabela profiles
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public'
  AND table_name = 'profiles';

-- Se necessário, recriar tabela com estrutura correta
DROP TABLE IF EXISTS public.profiles;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para segurança
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Política para permitir inserção de perfis pelo trigger
CREATE POLICY "Função de trigger pode inserir perfis" 
  ON public.profiles 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);
```

### 2. Criar Função e Trigger para Criação Automática de Perfis

```sql
-- Criar função para inserir perfil quando um usuário for criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para chamar a função automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

### 3. Criar Perfil Manualmente para Usuário Existente

Para usuários já existentes, siga um destes métodos:

#### Método 1: Usando o SQL Editor

Execute a seguinte consulta SQL substituindo o ID pelo do usuário:

```sql
INSERT INTO public.profiles (id, full_name, updated_at)
VALUES (
  '8bc93de8-7b05-4af8-aabd-4aea00cfa933',  -- Substitua pelo ID do usuário
  'Alexandre Martins',
  now()
);
```

#### Método 2: Usando Script com Chave de Serviço

1. Obtenha a chave `service_role` do seu projeto Supabase (Configurações > API)
2. Crie um arquivo `.env.local` com o conteúdo:
   ```
   VITE_SUPABASE_URL=https://oftsofxufkodyuaaohvk.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   SUPABASE_SERVICE_KEY=sua-chave-service-role
   ```
3. Execute o script `criar-perfil-admin.cjs`

### 4. Configurar Interface de Chat

Para implementar a interface de chat completa, siga os seguintes passos:

#### 4.1 Criar Tabelas de Chat no Supabase

Execute o seguinte script SQL no Editor SQL do Supabase para criar as tabelas necessárias:

```sql
-- Criar tabela de chats
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de histórico de chat
CREATE TABLE IF NOT EXISTS public.chat_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_histories ENABLE ROW LEVEL SECURITY;

-- Criar políticas para acesso às tabelas
CREATE POLICY "Usuários podem ver seus próprios chats" 
  ON public.chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios chats" 
  ON public.chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver mensagens de seus próprios chats" 
  ON public.chat_histories 
  FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.chats WHERE id = chat_id));

CREATE POLICY "Usuários podem criar mensagens em seus próprios chats" 
  ON public.chat_histories 
  FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.chats WHERE id = chat_id));
```

#### 4.2 Modificar o Arquivo main.jsx

Adicione o ChatProvider ao arquivo `main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
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

#### 4.3 Atualizar o App.jsx

Modifique o arquivo `App.jsx` para usar o componente ChatContainer:

```jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ChatContainer from './components/chat/ChatContainer';

const TributarIA = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Verifica autenticação ao carregar
  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('Usuário autenticado:', user);
        navigate('/app');
      } else {
        console.log('Usuário não autenticado');
      }
    }
  }, [user, loading, navigate]);
  
  // Componente para proteger rotas
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };
  
  // Renderização principal com rotas
  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/app" element={
            <ProtectedRoute>
              <ChatContainer />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
};

export default TributarIA;
```

## Verificação

Para verificar se tudo está funcionando:

1. Registre um novo usuário na aplicação
2. Faça login e verifique se o perfil é criado automaticamente
3. Execute a seguinte consulta SQL para verificar se o perfil existe:
   ```sql
   SELECT * FROM profiles;
   ```
4. Verifique se a interface de chat está funcionando:
   - Crie uma nova conversa
   - Envie mensagens e verifique se são salvas no banco de dados

## Resolução de Problemas

Se ainda houver problemas:

1. Verifique os logs de erro do Supabase (Configurações > Logs)
2. Certifique-se de que o trigger está ativo:
   ```sql
   SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
3. Verifique se as políticas RLS estão configuradas corretamente:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```
4. Verifique se as tabelas de chat foram criadas corretamente:
   ```sql
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
   ``` 