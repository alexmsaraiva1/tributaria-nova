-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Usuários podem ver apenas seu próprio perfil"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem ver apenas seus próprios chats"
    ON public.chats FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver apenas seu próprio histórico de chat"
    ON public.chat_histories FOR ALL
    USING (chat_id IN (
        SELECT id FROM public.chats WHERE user_id = auth.uid()
    ));

CREATE POLICY "Usuários podem ver apenas suas próprias assinaturas"
    ON public.subscriptions FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Todos podem ver os planos de assinatura"
    ON public.subscription_plans FOR SELECT
    USING (true); 