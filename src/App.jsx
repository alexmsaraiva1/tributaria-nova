import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquareText, Menu, LogIn, UserCircle, Send, PlusCircle, LogOut, UserPlus } from 'lucide-react';

const TributarIA = () => {
  // Estados para gerenciar a aplicação
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true); // Controla qual formulário está sendo exibido
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Novos estados para o formulário de registro
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados inicializados vazios
  const [chatHistory, setChatHistory] = useState([]);
  const [conversations, setConversations] = useState([]);
  
  // URL do webhook
  const WEBHOOK_URL = "https://webhooks.mllancamentos.com.br/webhook/demo-tributaria";
  
  // Função de login simplificada
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      console.log("Login realizado com sucesso:", username);
      setLoggedIn(true);
      // Não carrega dados fictícios após login, inicia com listas vazias
      setConversations([]);
      setActiveChat(null);
      setChatHistory([]);
    }
  };
  
  // Função para alternar entre os formulários
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    // Limpar os campos ao alternar
    setUsername('');
    setPassword('');
    setFullName('');
    setEmail('');
    setPhone('');
    setConfirmPassword('');
    setAcceptTerms(false);
  };
  
  // Função para lidar com o registro de nova conta
  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!fullName.trim() || !email.trim() || !phone.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    
    if (!acceptTerms) {
      alert('Você precisa aceitar os termos de uso e política de privacidade');
      return;
    }
    
    console.log("Registro realizado com sucesso:", {
      nome: fullName,
      email,
      telefone: phone,
      usuario: username
    });
    
    // Em uma implementação real, enviaria esses dados para um backend
    // Por enquanto, vamos apenas fazer login com o usuário registrado
    setLoggedIn(true);
    setConversations([]);
    setActiveChat(null);
    setChatHistory([]);
  };
  
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setChatHistory([]);
    setConversations([]);
    setActiveChat(null);
  };
  
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    
    try {
      // Verifica se existe um chat ativo, senão cria um novo
      if (!activeChat) {
        startNewChat();
      }
      
      // Adiciona mensagem do usuário
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: currentMessage,
        timestamp: new Date().toLocaleString('pt-BR')
      };
      
      // Adiciona mensagem do usuário ao histórico
      setChatHistory(prev => [...prev, userMessage]);
      
      // Atualiza o preview da conversa atual
      if (activeChat) {
        setConversations(prev => prev.map(conv => 
          conv.id === activeChat.id 
            ? {...conv, preview: currentMessage.substring(0, 30) + "..."} 
            : conv
        ));
      }
      
      // Salva a mensagem atual antes de limpar o campo
      const messageToSend = currentMessage;
      
      // Limpa o campo de entrada
      setCurrentMessage('');
      
      // Inicia o estado de carregamento
      setIsLoading(true);
      
      // Dados a serem enviados para o webhook
      const payload = {
        user_id: username,
        chat_id: activeChat ? activeChat.id : Date.now(),
        message: messageToSend,
        timestamp: new Date().toISOString()
      };
      
      console.log("Enviando mensagem para webhook:", WEBHOOK_URL);
      
      try {
        // Faz a requisição para o webhook
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`Erro na solicitação: ${response.status}`);
        }
        
        // Processa a resposta do webhook
        let responseData = await response.json();
        console.log("Resposta recebida:", responseData);
        
        // Verifica se a resposta é um array e pega o primeiro item
        if (Array.isArray(responseData)) {
          responseData = responseData[0];
        }
        
        // Processa a mensagem, que pode ser uma string ou um array de strings
        let botResponseText = "";
        
        if (Array.isArray(responseData.message)) {
          // Junta todas as partes da mensagem
          botResponseText = responseData.message.join('\n\n');
        } else {
          botResponseText = responseData.message || "Não foi possível obter uma resposta específica.";
        }
        
        // Cria objeto de mensagem do bot
        const botMessage = {
          id: Date.now(),
          sender: 'bot',
          text: botResponseText,
          timestamp: new Date().toLocaleString('pt-BR'),
          isMarkdown: true  // Flag para indicar que o texto contém markdown
        };
        
        // Adiciona resposta do bot ao histórico
        setChatHistory(prev => [...prev, botMessage]);
        
      } catch (error) {
        console.error("Erro ao processar resposta:", error);
        handleErrorResponse();
      }
      
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      handleErrorResponse();
    } finally {
      setIsLoading(false);
    }
    
    // Função para lidar com respostas de erro
    function handleErrorResponse() {
      const errorMessage = {
        id: Date.now(),
        sender: 'bot',
        text: "Estamos enfrentando dificuldades técnicas. Como alternativa, sugiro consultar o site da Receita Federal para informações oficiais sobre a reforma tributária.",
        timestamp: new Date().toLocaleString('pt-BR')
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };
  
  const startNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: 'Nova conversa',
      date: new Date().toLocaleDateString('pt-BR'),
      preview: 'Iniciar nova conversa sobre a reforma tributária'
    };
    setConversations([newChat, ...conversations]);
    setActiveChat(newChat);
    setChatHistory([]);
  };
  
  const selectChat = (chat) => {
    setActiveChat(chat);
    
    // Em um aplicativo real, recuperaria do banco de dados
    // Por enquanto, mantém o histórico como está ou vazio se for um novo chat
    if (!chatHistory.length) {
      setChatHistory([]);
    }
    
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-[100vh] bg-gray-50 overflow-hidden fixed inset-0">
      {!loggedIn ? (
        // Tela de login/registro
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-6">
              <div className="flex items-center text-blue-600">
                <MessageSquareText size={32} />
                <h1 className="ml-2 text-2xl font-bold">tributarIA</h1>
              </div>
            </div>
            <h2 className="mb-6 text-xl text-center text-gray-700">Seu assistente especializado em reforma tributária</h2>
            
            {isLoginForm ? (
              // Formulário de login
              <>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="username">Usuário</label>
                    <input
                      id="username"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Seu nome de usuário"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="password">Senha</label>
                    <input
                      id="password"
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mb-3"
                  >
                    <LogIn className="mr-2" size={20} />
                    Entrar
                  </button>
                </form>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center"
                >
                  <UserPlus className="mr-2" size={20} />
                  Criar nova conta
                </button>
                <div className="mt-4 text-sm text-center text-gray-600">
                  Para testar, use qualquer usuário e senha
                </div>
              </>
            ) : (
              // Formulário de registro
              <>
                <form onSubmit={handleRegister}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="fullName">Nome completo</label>
                    <input
                      id="fullName"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="phone">Telefone</label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="email">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="registerUsername">Nome de usuário</label>
                    <input
                      id="registerUsername"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nome de usuário desejado"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="registerPassword">Senha</label>
                    <input
                      id="registerPassword"
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Crie uma senha segura"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-700" htmlFor="confirmPassword">Confirmar senha</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                      />
                      <span>
                        Estou ciente e concordo com a coleta dos meus dados para criação de conta de acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD)
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mb-3"
                  >
                    <UserPlus className="mr-2" size={20} />
                    Cadastrar
                  </button>
                </form>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center"
                >
                  <LogIn className="mr-2" size={20} />
                  Já tenho uma conta
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        // Interface principal do app
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="bg-blue-600 text-white p-4 shadow-md w-full z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  className="mr-2 md:hidden" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu size={24} />
                </button>
                <div className="flex items-center">
                  <MessageSquareText size={24} />
                  <h1 className="ml-2 text-xl font-bold">tributarIA</h1>
                </div>
              </div>
              <div className="flex items-center">
                <UserCircle size={24} className="mr-2" />
                <span className="mr-4 hidden sm:inline">{username}</span>
                <button 
                  onClick={handleLogout}
                  className="p-1 hover:bg-blue-700 rounded-full"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </header>
          
          {/* Conteúdo principal */}
          <div className="flex flex-1 overflow-hidden relative w-full">
            {/* Sidebar */}
            <aside 
              className={`w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col ${
                sidebarOpen ? 'block' : 'hidden'
              } md:block absolute md:relative z-10 h-[calc(100%-4rem)] md:h-auto shadow-lg md:shadow-none`}
            >
              <div className="p-4 border-b border-gray-200">
                <button 
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  onClick={startNewChat}
                >
                  <PlusCircle size={20} className="mr-2" />
                  Nova conversa
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-16 md:pb-4">
                <div className="p-2">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Conversas recentes</h2>
                  {conversations.length === 0 ? (
                    <div className="text-sm text-gray-500 p-2">Nenhuma conversa iniciada</div>
                  ) : (
                    conversations.map((chat) => (
                      <div 
                        key={chat.id}
                        className={`p-2 rounded-md cursor-pointer mb-1 ${
                          activeChat && activeChat.id === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => selectChat(chat)}
                      >
                        <div className="font-medium truncate">{chat.title}</div>
                        <div className="text-xs text-gray-500">{chat.date}</div>
                        <div className="text-sm text-gray-600 truncate">{chat.preview}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
            
            {/* Área de chat */}
            <main className="flex-1 flex flex-col overflow-hidden relative h-full">
              {activeChat ? (
                <>
                  <div className="p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="font-medium">{activeChat.title}</h2>
                    <div className="text-xs text-gray-500">Iniciado em {activeChat.date}</div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 pb-24 absolute inset-x-0 top-[60px] bottom-0">
                   {chatHistory.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Digite uma mensagem para iniciar a conversa
                      </div>
                    ) : (
                      chatHistory.map((message) => (
                      <div 
                        key={message.id} 
                        className={`mb-4 max-w-[85%] sm:max-w-3xl ${
                          message.sender === 'user' ? 'ml-auto' : 'mr-auto'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}>
                          {message.isMarkdown ? (
                            <div className="markdown-content">
                              <ReactMarkdown>
                                {message.text}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            message.text
                          )}
                        </div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-right' : ''
                        } text-gray-500`}>
                          {message.timestamp}
                        </div>
                      </div>
                    ))
                    )}
                    {isLoading && (
                      <div className="mb-4 max-w-3xl mr-auto">
                        <div className="p-3 rounded-lg bg-gray-100 text-gray-500 rounded-bl-none flex items-center">
                          <span className="mr-2">Processando</span>
                          <span className="flex h-3 w-12">
                            <span className="animate-bounce mx-1 h-3 w-3 bg-gray-400 rounded-full"></span>
                            <span className="animate-bounce mx-1 h-3 w-3 bg-gray-400 rounded-full" style={{animationDelay: '0.2s'}}></span>
                            <span className="animate-bounce mx-1 h-3 w-3 bg-gray-400 rounded-full" style={{animationDelay: '0.4s'}}></span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-20">
                    <div className="flex max-w-screen-md mx-auto">
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite sua dúvida sobre a reforma tributária..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                      />
                      <button
                        className={`p-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-r-md`}
                        onClick={handleSendMessage}
                        disabled={isLoading}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center flex-col p-4">
                  <MessageSquareText size={48} className="text-gray-400 mb-4" />
                  <h2 className="text-xl font-medium text-gray-600 mb-2">Bem-vindo ao tributarIA</h2>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    Seu assistente especializado em reforma tributária brasileira.
                    Inicie uma nova conversa para começar.
                  </p>
                  <button 
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    onClick={startNewChat}
                  >
                    <PlusCircle size={20} className="mr-2" />
                    Iniciar nova conversa
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default TributarIA;