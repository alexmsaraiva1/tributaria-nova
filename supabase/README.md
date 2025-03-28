# Configuração do Banco de Dados Supabase

Este diretório contém os scripts SQL necessários para configurar o banco de dados do projeto tributarIA no Supabase.

## Ordem de Execução

Execute os scripts na seguinte ordem através do SQL Editor do Supabase:

1. `migrations/01_initial_setup.sql`
   - Cria as tabelas principais do sistema
   - Configura os tipos de dados e relacionamentos

2. `migrations/02_functions_and_triggers.sql`
   - Cria funções auxiliares
   - Configura triggers para atualização automática de timestamps

3. `migrations/03_initial_data.sql`
   - Insere os dados iniciais dos planos de assinatura
   - Configura os preços e features de cada plano

4. `migrations/04_security_policies.sql`
   - Habilita Row Level Security (RLS)
   - Configura as políticas de acesso aos dados

## Como Executar

1. Acesse o painel do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Copie e cole cada arquivo na ordem especificada acima
5. Execute cada script e verifique se não há erros

## Estrutura do Banco de Dados

### Tabelas

- `profiles`: Informações dos usuários
- `chats`: Conversas dos usuários
- `chat_histories`: Histórico de mensagens
- `subscription_plans`: Planos disponíveis
- `subscriptions`: Assinaturas dos usuários

### Políticas de Segurança

- Cada usuário só pode ver e modificar seus próprios dados
- Planos de assinatura são visíveis para todos
- Histórico de chat é protegido por usuário

## Suporte

Em caso de dúvidas ou problemas na execução dos scripts, entre em contato com a equipe de desenvolvimento. 