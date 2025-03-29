import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { LogOut } from 'lucide-react';

export default function ChatContainer() {
  const { user, profile, signOut } = useAuth();
  const { currentChat, loading } = useChat();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <h2 className="text-lg font-semibold truncate">{profile?.full_name || user?.email}</h2>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
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
        </div>
        <ChatList />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
              <h2 className="text-lg font-semibold truncate">{currentChat.title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <p className="text-gray-500 mb-2">Selecione ou crie uma nova conversa</p>
                <p className="text-sm text-gray-400">
                  Todas as perguntas e respostas sobre a reforma tributária ficam salvas no histórico.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 