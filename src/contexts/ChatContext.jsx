import React, { createContext, useContext, useState, useEffect } from 'react';
import { chats } from '../config/supabase';
import { useAuth } from './AuthContext';

const ChatContext = createContext({});

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [chatList, setChatList] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setChatList([]);
      setCurrentChat(null);
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  async function loadChats() {
    try {
      setLoading(true);
      const { data, error } = await chats.list();
      if (error) throw error;
      setChatList(data);
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(chatId) {
    try {
      setLoading(true);
      const { data, error } = await chats.getMessages(chatId);
      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createChat(title) {
    try {
      const { data, error } = await chats.create(title);
      if (error) throw error;
      setChatList([data, ...chatList]);
      setCurrentChat(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function sendMessage(message) {
    try {
      if (!currentChat) throw new Error('Nenhum chat selecionado');
      const { data, error } = await chats.sendMessage(currentChat.id, message);
      if (error) throw error;
      setMessages([...messages, data]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function sendAssistantMessage(message) {
    try {
      if (!currentChat) throw new Error('Nenhum chat selecionado');
      const { data, error } = await chats.sendMessage(currentChat.id, message, 'assistant');
      if (error) throw error;
      setMessages([...messages, data]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  const value = {
    chatList,
    currentChat,
    messages,
    loading,
    setCurrentChat,
    createChat,
    sendMessage,
    sendAssistantMessage,
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