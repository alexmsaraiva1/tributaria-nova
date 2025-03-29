-- Verificar a estrutura atual da tabela profiles
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' 
  AND table_name = 'profiles';

-- Verificar se a tabela perfis existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'profiles'
) AS "tabela_profiles_existe";

-- Se a tabela não existir, vamos criá-la
-- (Você deve executar este bloco apenas se a consulta anterior retornar falso)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar colunas que podem estar faltando
-- (Execute estas alterações somente se a tabela já existir mas faltar a coluna)
DO $$
BEGIN
  -- Adiciona a coluna nome se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'nome'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN nome TEXT;
  END IF;
  
  -- Adiciona a coluna full_name se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
  END IF;
END
$$;

-- Verificar novamente a estrutura da tabela após as alterações
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' 
  AND table_name = 'profiles'; 