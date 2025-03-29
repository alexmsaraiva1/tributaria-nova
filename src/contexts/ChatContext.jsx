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
      const { data, error } = await chats.list();
      if (error) throw error;
      setChatList(data || []);
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Função para carregar mensagens de um chat
  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      const { data, error } = await chats.getMessages(chatId);
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar um novo chat
  const createChat = async (title) => {
    if (!title?.trim() || !user) return { data: null, error: new Error('Título inválido ou usuário não autenticado') };
    
    try {
      const { data, error } = await chats.create(title.trim());
      if (error) throw error;
      
      // Atualizar a lista de chats com o novo chat no topo
      setChatList(prev => [data, ...prev]);
      setCurrentChat(data);
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
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
      const { data, error } = await chats.sendMessage(currentChat.id, message.trim());
      if (error) throw error;
      
      // Adicionar a nova mensagem ao histórico
      setMessages(prev => [...prev, data]);
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Função para adicionar resposta do assistente
  const sendAssistantMessage = async (message) => {
    if (!message || !currentChat) return { data: null, error: new Error('Mensagem inválida ou nenhum chat selecionado') };
    
    try {
      const { data, error } = await chats.sendMessage(currentChat.id, message, 'assistant');
      if (error) throw error;
      
      // Adicionar a resposta do assistente ao histórico
      setMessages(prev => [...prev, data]);
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
  
  // Atualizar título do chat atual
  const updateChatTitle = async (title) => {
    if (!title?.trim() || !currentChat) return { success: false };
    
    try {
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
      return { success: false, error };
    }
  };

  const value = {
    chatList,
    currentChat,
    messages,
    loading,
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