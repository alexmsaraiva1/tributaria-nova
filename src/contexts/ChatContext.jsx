import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chats } from '../config/supabase';
import { useAuth } from './AuthContext';

const ChatContext = createContext({});

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [chatList, setChatList] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Limpar erros quando mudar de chat
  useEffect(() => {
    setError(null);
  }, [currentChat]);

  // Carregar chats quando o usuário mudar
  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setChatList([]);
      setCurrentChat(null);
      setMessages([]);
    }
  }, [user]);

  // Carregar mensagens quando o chat atual mudar
  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  // Função para carregar a lista de chats
  const loadChats = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await chats.list();
      if (error) throw error;
      setChatList(data || []);
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
      setError('Não foi possível carregar as conversas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Função para carregar mensagens de um chat
  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await chats.getMessages(chatId);
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setError('Não foi possível carregar as mensagens. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar um novo chat
  const createChat = async (title) => {
    if (!user) return { data: null, error: new Error('Usuário não autenticado') };
    
    // Se não houver título, criar um padrão
    const chatTitle = title?.trim() || `Nova conversa ${new Date().toLocaleString('pt-BR')}`;
    
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await chats.create(chatTitle);
      if (error) throw error;
      
      // Atualizar a lista de chats com o novo chat no topo
      setChatList(prev => [data, ...prev]);
      setCurrentChat(data);
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      setError('Não foi possível criar uma nova conversa. Por favor, tente novamente.');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar mensagem do usuário
  const sendMessage = async (message) => {
    if (!message?.trim() || !currentChat) {
      return { 
        data: null, 
        error: new Error(currentChat ? 'Mensagem vazia' : 'Nenhum chat selecionado') 
      };
    }
    
    try {
      setError(null);
      const { data, error } = await chats.sendMessage(currentChat.id, message.trim());
      if (error) throw error;
      
      // Adicionar a nova mensagem ao histórico
      setMessages(prev => [...prev, data]);
      
      // Ativar o estado de digitação quando a mensagem do usuário é enviada
      setIsTyping(true);
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError('Não foi possível enviar a mensagem. Por favor, tente novamente.');
      // Garantir que isTyping seja desativado em caso de erro
      setIsTyping(false);
      return { data: null, error };
    }
  };

  // Função para adicionar resposta do assistente
  const sendAssistantMessage = async (message) => {
    if (!message || !currentChat) {
      setIsTyping(false); // Garantir que isTyping seja desativado
      return { 
        data: null, 
        error: new Error('Mensagem inválida ou nenhum chat selecionado') 
      };
    }
    
    try {
      // Desativar o estado de digitação quando a resposta do assistente chegar
      setIsTyping(false);
      setError(null);
      
      const { data, error } = await chats.sendMessage(currentChat.id, message, 'assistant');
      if (error) throw error;
      
      // Adicionar a resposta do assistente ao histórico
      setMessages(prev => [...prev, data]);
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao enviar resposta do assistente:', error);
      setError('Não foi possível salvar a resposta. A resposta foi recebida, mas não foi salva no histórico.');
      // Certificar-se de desativar o estado de digitação em caso de erro
      setIsTyping(false);
      return { data: null, error };
    }
  };
  
  // Atualizar título do chat atual
  const updateChatTitle = async (title) => {
    if (!title?.trim() || !currentChat) return { success: false };
    
    try {
      setError(null);
      // Implementar no futuro quando houver endpoint para atualizar chat
      // Por enquanto, atualizar apenas o estado local
      setChatList(prev => 
        prev.map(chat => 
          chat.id === currentChat.id ? { ...chat, title: title.trim() } : chat
        )
      );
      setCurrentChat(prev => ({ ...prev, title: title.trim() }));
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
      setError('Não foi possível atualizar o título da conversa.');
      return { success: false, error };
    }
  };

  const value = {
    chatList,
    currentChat,
    messages,
    loading,
    isTyping,
    error,
    setCurrentChat,
    createChat,
    sendMessage,
    sendAssistantMessage,
    loadChats,
    updateChatTitle
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
} 