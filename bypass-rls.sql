-- Verificar estrutura da tabela profiles
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public'
  AND table_name = 'profiles';

-- Verificar políticas RLS existentes
SELECT 
  policyname, 
  tablename, 
  permissive, 
  roles,
  cmd
FROM 
  pg_policies
WHERE 
  tablename = 'profiles';

-- Adicionar permissão para serviço de banco de dados inserir perfis
-- (pode ser executado sem desativar o RLS)
CREATE OR REPLACE FUNCTION public.create_profile_for_existing_user(user_id uuid)
RETURNS boolean AS $$
DECLARE
  profile_exists boolean;
  user_email text;
BEGIN
  -- Verifica se o perfil já existe
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
  ) INTO profile_exists;
  
  -- Se o perfil já existe, retorna falso
  IF profile_exists THEN
    RETURN false;
  END IF;
  
  -- Obtém email do usuário
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id;
  
  -- Insere o perfil usando SECURITY DEFINER para bypass de RLS
  INSERT INTO public.profiles (id, updated_at)
  VALUES (user_id, now());
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para permitir insert por serviço
CREATE POLICY "Serviço de banco de dados pode inserir perfis" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Inserir perfil manualmente para o usuário existente
-- (usar ID do usuário obtido anteriormente)
SELECT public.create_profile_for_existing_user('8bc93de8-7b05-4af8-aabd-4aea00cfa933');

-- Verificar se o perfil foi criado
SELECT * FROM public.profiles WHERE id = '8bc93de8-7b05-4af8-aabd-4aea00cfa933'; 