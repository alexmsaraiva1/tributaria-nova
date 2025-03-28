-- Inserir planos de assinatura padrão
INSERT INTO public.subscription_plans (name, description, price, features)
VALUES 
    ('Plano Básico', 'Perfeito para começar a usar a tributarIA', 47.00, ARRAY[
        'Perguntas ilimitadas',
        'Histórico de conversas salvo',
        'Atualizações contínuas',
        'Suporte por email'
    ]),
    ('Plano Premium', 'Acesso completo a todos os recursos avançados', 97.00, ARRAY[
        'Tudo do plano básico',
        'Biblioteca de referências oficiais',
        'Análises comparativas fiscais',
        'Simulações práticas de cenários',
        'Alertas de mudanças na legislação',
        'Suporte prioritário'
    ]); 