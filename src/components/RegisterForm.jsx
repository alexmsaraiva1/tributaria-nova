import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MessageSquareText, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check, ArrowLeft } from 'lucide-react'
import { validateRegistrationForm } from '../utils/validation'

export function RegisterForm() {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    // Limpar o erro específico quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar o formulário
    const validationErrors = validateRegistrationForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      return
    }
    
    setLoading(true)
    console.log('Iniciando cadastro com:', { email: formData.email, metadata: { full_name: formData.fullName, phone: formData.phone } })

    try {
      const metadata = {
        full_name: formData.fullName,
        phone: formData.phone
      }
      
      const { data, error } = await signUp(formData.email, formData.password, metadata)
      console.log('Resposta do cadastro:', { data, error })
      
      if (error) throw error
      
      // Exibe mensagem de sucesso
      console.log('Cadastro realizado com sucesso!')
      
      // Redirecionar para a página inicial após cadastro bem-sucedido
      window.location.href = '/'
    } catch (error) {
      console.error('Erro no cadastro:', error)
      setFormErrors({ 
        submit: `Erro ao criar conta: ${error.message || error.toString() || 'Erro desconhecido'}`
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

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
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Criar Conta</h2>
          <p className="text-gray-600 mb-8">Cadastre-se para acessar todas as funcionalidades</p>
          
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome completo */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Seu nome completo"
                />
              </div>
              {formErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="seuemail@exemplo.com"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 8 caracteres"
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
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* Termos e Condições */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <button
                  type="button"
                  onClick={() => handleInputChange({
                    target: {
                      name: 'acceptTerms',
                      type: 'checkbox',
                      checked: !formData.acceptTerms
                    }
                  })}
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    formData.acceptTerms 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {formData.acceptTerms && <Check size={14} className="text-white" />}
                </button>
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="text-gray-600">
                  Concordo com os <a href="#" className="text-blue-600 hover:text-blue-500">Termos de Serviço</a> e <a href="#" className="text-blue-600 hover:text-blue-500">Política de Privacidade</a>
                </label>
              </div>
            </div>
            {formErrors.acceptTerms && (
              <p className="text-sm text-red-600">{formErrors.acceptTerms}</p>
            )}

            {formErrors.submit && (
              <div className="text-red-600 text-sm">{formErrors.submit}</div>
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
                  Criando conta...
                </span>
              ) : (
                <>
                  Criar conta
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Faça login
            </Link>
          </div>
        </div>
      </div>

      {/* Lado direito - Imagem e informações */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
        
        {/* Elementos geométricos de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-bl-full opacity-20 transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-700 rounded-tr-full opacity-20 transform -translate-x-20 translate-y-20"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6">Comece sua jornada aqui</h2>
            <p className="text-xl opacity-90 mb-8">
              Tenha acesso a informações precisas sobre a reforma tributária. Pergunte, aprenda e tome decisões mais informadas.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <MessageSquareText size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Perguntas ilimitadas</h3>
                <p className="opacity-80">Tire todas as suas dúvidas sobre a reforma</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Check size={20} className="text-white" />
              </div>
              <p>Suporte contínuo da nossa equipe</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Check size={20} className="text-white" />
              </div>
              <p>Atualizações constantes da legislação</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Check size={20} className="text-white" />
              </div>
              <p>Informações sempre verificadas por especialistas</p>
            </div>
          </div>
          
          <div className="mt-auto">
            <p className="text-sm opacity-70 text-center">© 2023 tributarIA. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 