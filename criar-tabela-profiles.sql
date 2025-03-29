-- Verificar se a tabela profiles existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'profiles'
) AS "tabela_profiles_existe";

-- Dropar a tabela existente (execute apenas se precisar recriar)
DROP TABLE IF EXISTS public.profiles;

-- Criar tabela profiles com a estrutura correta
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar comentário à tabela
COMMENT ON TABLE public.profiles IS 'Perfis de usuários do sistema';

-- Configurar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que usuários vejam seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Criar política para permitir que usuários editem seus próprios perfis
CREATE POLICY "Usuários podem editar seus próprios perfis" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Criar função para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user(); 