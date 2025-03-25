import React from 'react';
import { ArrowRight, CheckCircle2, Building, BookOpen, Calculator, TrendingUp, ChevronRight, MessageSquareText, LogIn, UserPlus, ShieldCheck, Clock, BarChart, Lightbulb, UserCheck } from 'lucide-react';

const LandingPage = ({ onLoginClick, onRegisterClick }) => {
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
              onClick={onLoginClick}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <LogIn size={18} className="mr-1" />
              Entrar
            </button>
            <button 
              onClick={onRegisterClick}
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
                onClick={onRegisterClick}
                className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 font-bold flex items-center justify-center"
              >
                Começar agora
                <ChevronRight size={20} className="ml-1" />
              </button>
              <button 
                onClick={onLoginClick}
                className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-900 font-bold flex items-center justify-center"
              >
                Acessar minha conta
                <ArrowRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Investimento acessível</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Assinatura Mensal</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">R$ 47</span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>
                <p className="text-gray-600 mt-4 mb-6">
                  Acesso completo à tributarIA com todas as funcionalidades
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
                  onClick={onRegisterClick}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold"
                >
                  Começar agora
                </button>
              </div>
            </div>
            <p className="mt-6 text-sm opacity-80">
              Cancele a qualquer momento. Sem compromisso de permanência.
            </p>
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