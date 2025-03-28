import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatContainer() {
  const { user, profile, signOut } = useAuth();
  const { currentChat, loading } = useChat();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{profile?.full_name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <ChatList />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold">{currentChat.title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ChatMessages />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
              <ChatInput />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            ) : (
              <p className="text-gray-500">Selecione ou crie uma nova conversa</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 