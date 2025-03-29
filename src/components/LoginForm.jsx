import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquareText, Mail, Lock, Eye, EyeOff, ArrowRight, Check, ArrowLeft } from 'lucide-react';

export function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) throw error;
      
      // Redirecionar para a página do app após login bem-sucedido
      navigate('/app');
    } catch (error) {
      setError(`Email ou senha inválidos: ${error.message || 'Tente novamente'}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex">
      {/* Botão voltar para home */}
      <div className="fixed bottom-4 left-4 z-10">
        <Link
          to="/"
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
      </div>

      {/* Lado esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center text-blue-600 mb-8">
            <MessageSquareText size={32} className="text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold">tributarIA</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-600 mb-8">Acesse sua conta e tire suas dúvidas sobre a reforma tributária</p>
          
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seuemail@exemplo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                  rememberMe 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                {rememberMe && <Check size={14} className="text-white" />}
              </button>
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar de mim
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center font-medium"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                <>
                  Entrar
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Criar agora
            </Link>
          </div>
        </div>
      </div>

      {/* Lado direito - Imagem e informações */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
        
        {/* Elementos geométricos de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-bl-full opacity-20 transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700 rounded-tr-full opacity-20 transform -translate-x-20 translate-y-20"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6">Transforme suas ideias em realidade</h2>
            <p className="text-xl opacity-90 mb-8">
              Entenda a reforma tributária de forma simples e prática, com respostas precisas e atualizadas para suas dúvidas.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Recompensas</h3>
              <p className="opacity-80">Acumule pontos a cada consulta realizada</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">$</span>
              </div>
              <div>
                <span className="text-2xl font-bold">172.832</span>
                <p className="text-sm opacity-70">Pontos acumulados</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span>1</span>
              </div>
              <p className="text-sm">Perguntas ilimitadas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span>2</span>
              </div>
              <p className="text-sm">Atualizações constantes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span>3</span>
              </div>
              <p className="text-sm">Respostas precisas</p>
            </div>
          </div>
          
          <div className="mt-auto">
            <p className="text-sm opacity-70 text-center">© 2023 tributarIA. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 