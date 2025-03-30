import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { LogOut, ArrowLeft, MenuIcon, PlusCircle, MessageSquare } from 'lucide-react';
import LogoTributaria from '../../assets/logo-tributaria';

export default function ChatContainer() {
  const { user, profile, signOut } = useAuth();
  const { currentChat, loading, createChat, setCurrentChat } = useChat();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é um dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar na inicialização
    checkIfMobile();
    
    // Adicionar evento para redimensionamento
    window.addEventListener('resize', checkIfMobile);
    
    // Limpar o evento
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Em dispositivos móveis, mostrar o chat quando houver um chat ativo
  useEffect(() => {
    if (isMobile && currentChat) {
      setShowSidebar(false);
    }
  }, [currentChat, isMobile]);

  // Função para criar nova conversa
  const handleNewChat = async () => {
    try {
      await createChat();
      if (isMobile) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  // Voltar para a lista de conversas (apenas mobile)
  const handleBackToList = () => {
    setShowSidebar(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar - visível apenas quando showSidebar=true em mobile ou sempre visível em desktop */}
      {(showSidebar || !isMobile) && (
        <div className={`${isMobile ? 'w-full' : 'w-64'} bg-white border-r border-gray-200 z-10 ${isMobile ? 'absolute inset-0' : 'relative'} flex flex-col h-full`}>
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LogoTributaria width={28} height={28} />
                <h2 className="ml-2 text-lg font-semibold text-blue-600">tributarIA</h2>
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
            <div className="mt-1 text-sm text-gray-500 truncate">{profile?.full_name || user?.email}</div>
          </div>
          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors"
              disabled={loading}
            >
              <PlusCircle size={16} className="mr-2" />
              Nova Conversa
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatList onChatSelect={() => isMobile && setShowSidebar(false)} />
          </div>
        </div>
      )}

      {/* Chat Area - visível apenas quando showSidebar=false em mobile ou sempre visível em desktop */}
      {(!showSidebar || !isMobile) && (
        <div className={`flex-1 flex flex-col h-full w-full overflow-hidden ${isMobile ? 'absolute inset-0 z-20' : ''}`}>
          {currentChat ? (
            <>
              <div className="px-3 py-3 border-b border-gray-200 bg-white shadow-sm flex items-center">
                {isMobile && (
                  <button 
                    onClick={handleBackToList}
                    className="mr-2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0 mr-2">
                    <LogoTributaria width={22} height={22} />
                  </div>
                  <h2 className="text-base font-medium truncate">{currentChat.title}</h2>
                </div>
                {isMobile && (
                  <button
                    onClick={handleNewChat}
                    className="ml-2 p-1 rounded-full text-blue-600 hover:bg-blue-50"
                    title="Nova Conversa"
                  >
                    <PlusCircle size={18} />
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <ChatMessages />
              </div>
              <div className="px-2 py-2 border-t border-gray-200 bg-white w-full">
                <ChatInput />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {loading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
              ) : (
                <div className="text-center">
                  {isMobile && (
                    <button 
                      onClick={handleBackToList}
                      className="mb-6 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 block mx-auto"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div className="flex justify-center mb-4">
                    <LogoTributaria width={56} height={56} />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">tributarIA</h3>
                  <p className="text-gray-600 mb-2">Selecione ou crie uma nova conversa</p>
                  <p className="text-sm text-gray-500 px-6 mb-4">
                    Todas as perguntas e respostas sobre a reforma tributária ficam salvas no histórico.
                  </p>
                  <button
                    onClick={handleNewChat}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Nova Conversa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 