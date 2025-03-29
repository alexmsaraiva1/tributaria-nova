# Guia para usar a Chave de Serviço do Supabase

## 1. Obtenha a Chave de Serviço

1. Acesse o [Dashboard do Supabase](https://app.supabase.com) e selecione seu projeto.
2. No menu lateral, clique em "Configurações do Projeto" (ícone de engrenagem).
3. No menu lateral, clique em "API".
4. Role para baixo até a seção "Chaves do Projeto".
5. Você verá duas chaves: `anon` (pública) e `service_role` (chave de serviço).
6. Copie a chave `service_role`. Esta é uma chave poderosa que tem permissões para executar qualquer operação, incluindo bypass de RLS.

**Observação importante**: Mantenha esta chave segura! Ela não deve ser compartilhada ou incluída em código de frontend. Use-a apenas em um ambiente seguro (servidor, scripts locais, etc).

## 2. Criar um arquivo `.env.local` com a chave de serviço

Crie um arquivo `.env.local` (que não será versionado) contendo:

```
VITE_SUPABASE_URL=https://oftsofxufkodyuaaohvk.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_KEY=sua-chave-service-role-aqui
```

## 3. Use a chave de serviço para criar o perfil

Crie um arquivo `criar-perfil-admin.cjs` com o seguinte conteúdo:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// URL e chave do Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Chave de serviço com permissões admin

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
    // Verificar usuário na tabela auth.users
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('id', USER_ID)
      .single();
    
    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return;
    }
    
    console.log('Usuário encontrado:', {
      id: userData.id,
      email: userData.email,
      created_at: userData.created_at
    });
    
    // Verificar se o perfil já existe
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID)
      .single();
    
    if (existingProfile) {
      console.log('Perfil já existe:', existingProfile);
      return;
    }
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil existente:', profileError);
      return;
    }
    
    // Inserir o perfil
    const { data: insertResult, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: USER_ID, updated_at: new Date().toISOString() })
      .select();
    
    if (insertError) {
      console.error('Erro ao inserir perfil:', insertError);
    } else {
      console.log('Perfil criado com sucesso:', insertResult);
    }
  } catch (e) {
    console.error('Exceção:', e);
  }
}

// Executar função
inserirPerfilComoAdmin().catch(err => console.error('Erro na execução:', err));
```

Execute com:

```bash
node criar-perfil-admin.cjs
```

## 4. Verificar o perfil no Dashboard do Supabase

Após executar o script:

1. Acesse o [Dashboard do Supabase](https://app.supabase.com) e selecione seu projeto.
2. No menu lateral, clique em "Tabela" ou "SQL Editor".
3. Execute a seguinte consulta SQL:
   ```sql
   SELECT * FROM profiles WHERE id = '8bc93de8-7b05-4af8-aabd-4aea00cfa933';
   ```

Isso confirmará se o perfil foi criado com sucesso.

## 5. Configurar o trigger para futuros usuários

Para garantir que novos usuários tenham perfis criados automaticamente, execute o script SQL `bypass-rls.sql` no SQL Editor do Supabase.

Isso vai criar uma função `public.create_profile_for_existing_user` que pode ser usada para criar perfis sem violar as políticas RLS, bem como configurar o trigger para novos usuários. 