# Passos para Implementar a Interface de Chat no TributarIA

## 1. Criar as Tabelas de Chat no Supabase

Execute o script `criar-tabelas-chat.sql` no Editor SQL do Supabase. Este script:
- Cria a tabela `chats` para armazenar as conversas dos usuários
- Cria a tabela `chat_histories` para armazenar as mensagens de cada conversa
- Configura as políticas de Row Level Security (RLS) para garantir que os usuários só acessem seus próprios dados
- Cria índices para melhorar a performance das consultas

## 2. Atualizar o Arquivo main.jsx para Incluir o ChatProvider

Edite o arquivo `src/main.jsx` para adicionar o ChatProvider, seguindo o padrão abaixo:

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

## 3. Modificar o App.jsx para Usar o Componente ChatContainer

Atualize o arquivo `src/App.jsx` para substituir a tela de boas-vindas pelo componente ChatContainer:

```jsx
import React, { useState, useEffect } from 'react';
// Outras importações...
import ChatContainer from './components/chat/ChatContainer';

const TributarIA = () => {
  // Código existente...
  
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
```

## 4. Componentes de Chat

Os componentes de chat já estão criados no diretório `src/components/chat/`:
- **ChatContainer.jsx**: Componente principal que organiza a interface de chat
- **ChatList.jsx**: Lista de conversas do usuário
- **ChatInput.jsx**: Campo de entrada para o usuário digitar mensagens
- **ChatMessages.jsx**: Exibição das mensagens da conversa atual

## 5. Contexto do Chat

O contexto do chat (`src/contexts/ChatContext.jsx`) gerencia:
- Carregamento das conversas do usuário
- Criação de novas conversas
- Envio e recebimento de mensagens
- Estado atual da conversa

## 6. API do Supabase para Chat

As funções de API para o chat estão definidas em `src/config/supabase.js`:
- `chats.list()`: Lista todas as conversas do usuário
- `chats.create()`: Cria uma nova conversa
- `chats.getMessages()`: Obtém as mensagens de uma conversa
- `chats.sendMessage()`: Envia uma nova mensagem

## 7. Testando a Implementação

Após implementar todas as alterações:

1. Execute o projeto com `npm run dev`
2. Faça login na aplicação
3. Você deve ver a interface de chat completa em vez da tela de boas-vindas
4. Teste a criação de uma nova conversa e o envio de mensagens

## 8. Resolução de Problemas

Se a interface de chat não funcionar corretamente:

1. Verifique se as tabelas foram criadas corretamente no Supabase
2. Verifique os logs do console do navegador para identificar erros
3. Confirme que o ChatProvider foi adicionado corretamente no main.jsx
4. Verifique se o componente ChatContainer está sendo carregado na rota /app 