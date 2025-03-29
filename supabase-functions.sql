-- Função para obter todos os usuários da tabela auth.users
-- Esta função deve ser executada no SQL Editor do Supabase
CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS SETOF auth.users
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM auth.users;
END;
$$ LANGUAGE plpgsql;

-- Função para encontrar um usuário específico pelo email
CREATE OR REPLACE FUNCTION find_user_by_email(user_email TEXT)
RETURNS SETOF auth.users
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM auth.users WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Verificador do trigger para criação de perfil
CREATE OR REPLACE FUNCTION check_trigger_exists()
RETURNS TABLE (trigger_exists BOOLEAN)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
    SELECT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
    );
END;
$$ LANGUAGE plpgsql;

-- Função para criar manualmente um perfil para um usuário existente
CREATE OR REPLACE FUNCTION create_profile_for_user(user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
DECLARE
  profile_exists BOOLEAN;
BEGIN
  -- Verifica se o perfil já existe
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = user_id
  ) INTO profile_exists;
  
  -- Se não existir, cria um perfil
  IF NOT profile_exists THEN
    INSERT INTO public.profiles (id, updated_at, nome)
    VALUES (user_id, NOW(), 'Perfil Criado Manualmente');
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para ver o conteúdo do trigger on_auth_user_created
CREATE OR REPLACE FUNCTION get_trigger_definition()
RETURNS TEXT
SECURITY DEFINER
AS $$
DECLARE
  trigger_def TEXT;
BEGIN
  SELECT pg_get_functiondef(pg_proc.oid)
  INTO trigger_def
  FROM pg_proc
  INNER JOIN pg_trigger ON pg_proc.oid = pg_trigger.tgfoid
  WHERE pg_trigger.tgname = 'on_auth_user_created';
  
  RETURN trigger_def;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se um trigger específico existe
CREATE OR REPLACE FUNCTION public.check_trigger_exists(trigger_name text)
RETURNS boolean AS $$
DECLARE
  trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = trigger_name
  ) INTO trigger_exists;
  
  RETURN trigger_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar um perfil para um usuário existente
CREATE OR REPLACE FUNCTION public.create_profile_for_user(user_id uuid)
RETURNS boolean AS $$
DECLARE
  profile_exists boolean;
  user_email text;
  user_name text;
BEGIN
  -- Verifica se o perfil já existe
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
  ) INTO profile_exists;
  
  -- Se já existe, retorna false
  IF profile_exists THEN
    RETURN false;
  END IF;
  
  -- Obtém informações do usuário
  SELECT 
    email,
    COALESCE(raw_user_meta_data->>'full_name', email) 
  INTO 
    user_email, 
    user_name
  FROM auth.users
  WHERE id = user_id;
  
  -- Cria o perfil
  INSERT INTO public.profiles (id, email, full_name, updated_at)
  VALUES (user_id, user_email, user_name, now());
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verifica se o trigger já existe e cria se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$; 