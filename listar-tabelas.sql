-- Listar todas as tabelas do schema public
SELECT 
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public';

-- Mostrar detalhes da tabela profiles (colunas)
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'profiles';

-- Mostrar detalhes da tabela chats (colunas)
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'chats';

-- Mostrar detalhes da tabela chat_histories (colunas)
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'chat_histories';

-- Mostrar detalhes da tabela subscription_plans (colunas)
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'subscription_plans';

-- Mostrar detalhes da tabela subscriptions (colunas)
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'subscriptions'; 