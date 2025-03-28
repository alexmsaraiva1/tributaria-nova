import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Building, BookOpen, Calculator, TrendingUp, ChevronRight, MessageSquareText, LogIn, UserPlus, ShieldCheck, Clock, BarChart, Lightbulb, UserCheck, ChevronDown } from 'lucide-react';
import FormErrors from './FormErrors';
import { validateRegistrationForm, sanitizeInput } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const LandingPage = () => {
  const { signIn, signUp } = useAuth();
  const { plans } = useSubscription();
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [formErrors, setFormErrors] = useState({});

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    try {
      const { error } = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
    } catch (error) {
      setFormErrors({
        auth: 'Email ou senha inválidos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      });

      if (error) throw error;
    } catch (error) {
      setFormErrors({
        auth: 'Erro ao criar conta. Por favor, tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "A tributarIA é precisa nas informações sobre a reforma tributária?",
      answer: "Sim. A tributarIA foi treinada com informações oficiais e atualizadas sobre a reforma tributária brasileira. Nosso sistema é constantemente atualizado para incorporar as mais recentes mudanças na legislação, garantindo que você receba informações precisas e confiáveis. Além disso, quando relevante, fornecemos referências às fontes oficiais para que você possa verificar as informações."
    },
    {
      question: "Vale a pena pagar R$47 por mês por um serviço que posso obter de um contador?",
      answer: "A tributarIA não substitui o trabalho do contador, mas o complementa. Por apenas R$47/mês, você tem acesso ilimitado a informações instantâneas, 24/7, sem necessidade de agendar consultas ou esperar por respostas. Seu contador continua sendo essencial para questões específicas do seu negócio, mas a tributarIA oferece um suporte contínuo para dúvidas pontuais e atualizações constantes, economizando tempo e dinheiro em consultas frequentes."
    },
    {
      question: "As informações são realmente atualizadas conforme as mudanças na legislação?",
      answer: "Absolutamente. Nossa equipe monitora constantemente as alterações na legislação tributária e atualiza a tributarIA com essas novas informações. Quando há uma atualização significativa na reforma tributária, nosso sistema é imediatamente atualizado para refletir essas mudanças, garantindo que você sempre tenha acesso às informações mais recentes e relevantes para o seu negócio."
    },
    {
      question: "Como posso confiar em respostas geradas por IA em vez de um especialista humano?",
      answer: "Nossa IA é treinada com informações verificadas por especialistas em tributação. O sistema foi desenvolvido para fornecer informações objetivas baseadas na legislação atual, não opiniões. Quando há interpretações divergentes ou situações complexas, a tributarIA indica claramente esses pontos e sugere consulta especializada. Além disso, todas as respostas incluem referências às fontes legais, permitindo que você verifique as informações."
    },
    {
      question: "Meu negócio tem especificidades únicas. A tributarIA entenderá meu contexto?",
      answer: "A tributarIA foi projetada para compreender contextos específicos de diversos setores e portes de empresas. Você pode detalhar sua situação nas perguntas, e o sistema adaptará as respostas ao seu contexto. Para casos extremamente específicos ou situações que exigem interpretação única da sua realidade empresarial, recomendamos complementar as informações da tributarIA com a consultoria do seu contador."
    },
    {
      question: "E se eu tiver dificuldades em usar a plataforma ou não encontrar respostas satisfatórias?",
      answer: "Oferecemos suporte por email para ajudar em qualquer dificuldade técnica com a plataforma. Além disso, estamos constantemente aprimorando a tributarIA com base no feedback dos usuários. Se você não encontrar uma resposta satisfatória, nossa equipe de suporte pode orientá-lo e utilizar sua dúvida para melhorar ainda mais o sistema. E lembre-se: você pode cancelar a assinatura a qualquer momento sem custos adicionais."
    },
    {
      question: "Minhas perguntas e dados ficarão seguros na plataforma?",
      answer: "Sim, a segurança dos seus dados é nossa prioridade. Utilizamos tecnologias avançadas de criptografia para proteger todas as conversas e informações compartilhadas na plataforma. Seguimos rigorosamente as diretrizes da LGPD, e seus dados nunca são compartilhados com terceiros. Você mantém total controle sobre suas informações e pode solicitar a exclusão delas a qualquer momento."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col landing-page">
      {/* Barra de navegação */}
      <nav className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-blue-600">
            <MessageSquareText size={28} />
            <h1 className="ml-2 text-xl font-bold">tributarIA</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <LogIn size={18} className="mr-1" />
              Entrar
            </button>
            <button 
              onClick={() => setShowLogin(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center"
            >
              <UserPlus size={18} className="mr-1" />
              Criar conta
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fadeIn">Reforma Tributária Simplificada com IA</h1>
            <p className="text-xl md:text-2xl mb-8 animate-fadeIn delay-200">
              Tire todas as suas dúvidas sobre a reforma tributária brasileira com um assistente de IA especializado e focado em contadores e empresários.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fadeIn delay-400">
              <button 
                onClick={() => setShowLogin(false)}
                className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 font-bold flex items-center justify-center"
              >
                Começar agora
                <ChevronRight size={20} className="ml-1" />
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-900 font-bold flex items-center justify-center"
              >
                Acessar minha conta
                <ArrowRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Login/Registro */}
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between mb-6">
          <button
            className={`flex-1 py-2 text-center ${showLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${!showLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setShowLogin(false)}
          >
            Cadastro
          </button>
        </div>

        <FormErrors errors={formErrors} />

        <form onSubmit={showLogin ? handleLogin : handleRegister}>
          {!showLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {!showLogin && (
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                <span className="text-sm text-gray-600">
                  Aceito os termos de uso e política de privacidade
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              showLogin ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>
      </div>

      {/* Benefícios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que usar a tributarIA?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Respostas Precisas</h3>
              <p className="text-gray-600">
                Obtenha informações confiáveis e atualizadas sobre a reforma tributária direto de um assistente especializado.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Clock size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Economize Tempo</h3>
              <p className="text-gray-600">
                Encontre respostas instantaneamente, sem precisar pesquisar em documentos extensos ou consultar especialistas.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <BarChart size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Informações Atualizadas</h3>
              <p className="text-gray-600">
                Mantenha-se informado com as últimas atualizações sobre a reforma tributária e suas implicações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para quem */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Para quem é a tributarIA?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="text-blue-600 mr-4">
                  <Building size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Contadores</h3>
                  <p className="text-gray-600 mb-4">
                    Atualize-se rapidamente sobre as mudanças tributárias e ofereça orientações precisas aos seus clientes sem longas pesquisas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 size={20} className="text-green-500 mr-2" />
                      <span>Respostas específicas para dúvidas técnicas</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={20} className="text-green-500 mr-2" />
                      <span>Interpretação de mudanças na legislação</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={20} className="text-green-500 mr-2" />
                      <span>Suporte para aconselhamento de clientes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="text-blue-600 mr-4">
                  <UserCheck size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Empresários</h3>
                  <p className="text-gray-600 mb-4">
                    Entenda como a reforma tributária afetará seu negócio e quais estratégias adotar para se adaptar às mudanças.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 size={20} className="text-green-500 mr-2" />
                      <span>Impactos da reforma no seu setor</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={20} className="text-green-500 mr-2" />
                      <span>Preparação para novas exigências</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={20} className="text-green-500 mr-2" />
                      <span>Planejamento tributário estratégico</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta em segundos e tenha acesso imediato ao nosso assistente especializado.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">Faça suas perguntas</h3>
              <p className="text-gray-600">
                Pergunte qualquer coisa sobre a reforma tributária em linguagem natural e conversacional.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">Receba respostas</h3>
              <p className="text-gray-600">
                Obtenha respostas claras e precisas, com referências às fontes oficiais quando necessário.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preço */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Escolha o plano ideal para você</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Plano Básico */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800 transform transition-transform hover:scale-105">
                <div className="bg-blue-600 p-4 text-white text-center">
                  <h3 className="text-xl font-bold">Plano Básico</h3>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold">R$ 47</span>
                    <span className="text-gray-500 ml-2">/mês</span>
                  </div>
                  <p className="text-gray-600 text-center mb-6">
                    Perfeito para começar a usar a tributarIA
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Perguntas ilimitadas</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Histórico de conversas salvo</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Atualizações contínuas</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Suporte por email</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => setShowLogin(false)}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold transition-colors"
                  >
                    Começar agora
                  </button>
                </div>
              </div>
              
              {/* Plano Premium */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800 transform transition-transform hover:scale-105 border-2 border-yellow-400 relative">
                {/* Faixa Recomendado na diagonal */}
                <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-xs font-medium px-4 py-0.5 origin-top-right rotate-45 transform translate-y-4 translate-x-8 opacity-80 z-10">
                  RECOMENDADO
                </div>
                
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white text-center">
                  <h3 className="text-xl font-bold">Plano Premium</h3>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold">R$ 97</span>
                    <span className="text-gray-500 ml-2">/mês</span>
                  </div>
                  <p className="text-gray-600 text-center mb-6">
                    Acesso completo a todos os recursos avançados
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Tudo do plano básico</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Biblioteca de referências oficiais</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Análises comparativas fiscais</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Simulações práticas de cenários</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Alertas de mudanças na legislação</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      <span>Suporte prioritário</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => setShowLogin(false)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-900 font-bold transition-colors"
                  >
                    Obter plano premium
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-8 text-sm opacity-80 text-center">
              Cancele a qualquer momento. Sem compromisso de permanência.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ - Perguntas Frequentes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <button
                    className="flex justify-between items-center w-full p-6 text-left"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                    <ChevronDown 
                      className={`text-blue-600 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`} 
                      size={20} 
                    />
                  </button>
                  
                  <div 
                    className={`px-6 transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'pb-6 max-h-96' : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button 
                onClick={() => setShowLogin(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold flex items-center mx-auto"
              >
                Comece a esclarecer suas dúvidas agora
                <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageSquareText size={24} />
            <h2 className="ml-2 text-xl font-bold">tributarIA</h2>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} tributarIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;