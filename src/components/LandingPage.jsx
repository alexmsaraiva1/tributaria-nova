import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Building, BookOpen, Calculator, TrendingUp, ChevronRight, MessageSquareText, LogIn, UserPlus, ShieldCheck, Clock, BarChart, Lightbulb, UserCheck, ChevronDown } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

const LandingPage = () => {
  const { plans } = useSubscription();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
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
            <Link 
              to="/login"
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <LogIn size={18} className="mr-1" />
              Entrar
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center"
            >
              <UserPlus size={18} className="mr-1" />
              Criar conta
            </Link>
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
              <Link 
                to="/register"
                className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 font-bold flex items-center justify-center"
              >
                Começar agora
                <ChevronRight size={20} className="ml-1" />
              </Link>
              <Link 
                to="/login"
                className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-900 font-bold flex items-center justify-center"
              >
                Acessar minha conta
                <ArrowRight size={20} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por que usar a tributarIA? */}
      <section id="beneficios" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que usar a tributarIA?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Respostas Precisas</h3>
              <p className="text-gray-600">
                Obtenha informações confiáveis e atualizadas sobre a reforma tributária direta de um assistente especializado.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <Clock size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Economize Tempo</h3>
              <p className="text-gray-600">
                Encontre respostas instantaneamente, sem precisar pesquisar em documentos extensos ou aguardar consultas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <BarChart size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Informações Atualizadas</h3>
              <p className="text-gray-600">
                Mantenha-se informado com as últimas atualizações sobre a reforma tributária e suas implicações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é a tributarIA? */}
      <section id="publico-alvo" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Para quem é a tributarIA?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex">
              <div className="mr-4 text-blue-600">
                <Building size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Contadores</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Atualize-se rapidamente sobre as mudanças tributárias e informe seus clientes</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Tenha um assistente especializado para resolver dúvidas pontuais</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Interpretação de mudanças na legislação</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Saiba para automaticamente as alterações legislativas</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-blue-600">
                <UserCheck size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Empresários</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Compreenda como a reforma tributária afetará seu negócio</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Planejamento eficiente para a nova legislação</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Prepare-se para as mudanças antecipadamente</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                    <span>Poupe tempo e dinheiro com informações simplificadas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Crie sua conta em segundos</h3>
              <p className="text-gray-600">
                Preencha o formulário de cadastro e tenha acesso instantâneo à plataforma.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Faça suas perguntas</h3>
              <p className="text-gray-600">
                Pergunte qualquer coisa sobre a reforma tributária em linguagem natural e conversacional.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Receba respostas</h3>
              <p className="text-gray-600">
                Obtenha respostas claras e precisas, com referências às fontes oficiais quando necessário.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Escolha o plano ideal para você</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-center">Plano Básico</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">R$ 47</span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>
                <p className="text-center text-sm text-gray-600 mb-6">
                  Perfeito para começar a usar a tributarIA
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Perguntas ilimitadas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Histórico de conversas salvo</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Atualizações contínuas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Suporte por email</span>
                  </li>
                </ul>
                <Link 
                  to="/register"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Começar agora
                </Link>
              </div>
            </div>

            {/* Plano Premium */}
            <div className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 relative">
              <div className="absolute top-0 right-0 transform rotate-45 translate-x-5 -translate-y-3 bg-yellow-400 text-black py-1 px-8 text-xs font-bold shadow-md">
                RECOMENDADO
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-center">Plano Premium</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">R$ 97</span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>
                <p className="text-center text-sm text-gray-600 mb-6">
                  Acesso completo a todos os recursos avançados
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Tudo do plano básico</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Biblioteca de referências oficiais</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Análises comparativas fiscais</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Simulações práticas de cenários</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Alertas de mudanças na legislação</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Link 
                  to="/register"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Obter plano premium
                </Link>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm mt-8 opacity-80">
            Cancele a qualquer momento, sem compromissos de permanência.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left p-4 bg-white flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <ChevronDown
                    className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                
                {openFaq === index && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold inline-flex items-center"
            >
              Comece a esclarecer suas dúvidas agora
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center mb-4">
            <MessageSquareText size={28} />
            <span className="ml-2 text-xl font-bold">tributarIA</span>
          </div>
          <p className="text-center text-sm text-gray-400">
            © 2023 tributarIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;