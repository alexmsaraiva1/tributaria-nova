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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - visível apenas quando showSidebar=true em mobile ou sempre visível em desktop */}
      {(showSidebar || !isMobile) && (
        <div className={`${isMobile ? 'w-full' : 'w-64'} bg-white border-r border-gray-200 z-10 ${isMobile ? 'absolute inset-0' : 'relative'}`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LogoTributaria width={32} height={32} />
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
            <div className="mt-2 text-sm text-gray-500 truncate">{profile?.full_name || user?.email}</div>
          </div>
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors"
              disabled={loading}
            >
              <PlusCircle size={18} className="mr-2" />
              Nova Conversa
            </button>
          </div>
          <ChatList onChatSelect={() => isMobile && setShowSidebar(false)} />
        </div>
      )}

      {/* Chat Area - visível apenas quando showSidebar=false em mobile ou sempre visível em desktop */}
      {(!showSidebar || !isMobile) && (
        <div className={`flex-1 flex flex-col overflow-hidden ${isMobile ? 'absolute inset-0 z-20' : ''}`}>
          {currentChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center">
                {isMobile && (
                  <button 
                    onClick={handleBackToList}
                    className="mr-3 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div className="flex items-center flex-1">
                  <MessageSquare size={18} className="mr-2 text-blue-600" />
                  <h2 className="text-lg font-semibold truncate">{currentChat.title}</h2>
                </div>
                {isMobile && (
                  <button
                    onClick={handleNewChat}
                    className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50"
                    title="Nova Conversa"
                  >
                    <PlusCircle size={20} />
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <ChatMessages />
              </div>
              <div className="p-3 border-t border-gray-200 bg-white">
                <ChatInput />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                <div className="text-center p-6">
                  {isMobile && (
                    <button 
                      onClick={handleBackToList}
                      className="mb-4 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 block mx-auto"
                    >
                      <ArrowLeft size={24} />
                    </button>
                  )}
                  <div className="flex justify-center mb-4">
                    <LogoTributaria width={64} height={64} />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">tributarIA</h3>
                  <p className="text-gray-500 mb-2">Selecione ou crie uma nova conversa</p>
                  <p className="text-sm text-gray-400">
                    Todas as perguntas e respostas sobre a reforma tributária ficam salvas no histórico.
                  </p>
                  <button
                    onClick={handleNewChat}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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