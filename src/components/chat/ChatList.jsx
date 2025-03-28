import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';

export default function ChatList() {
  const { chatList, currentChat, loading, createChat, setCurrentChat } = useChat();
  const [newChatTitle, setNewChatTitle] = useState('');
  const [showNewChatInput, setShowNewChatInput] = useState(false);

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (!newChatTitle.trim()) return;

    try {
      await createChat(newChatTitle.trim());
      setNewChatTitle('');
      setShowNewChatInput(false);
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        {showNewChatInput ? (
          <form onSubmit={handleCreateChat} className="space-y-2">
            <input
              type="text"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              placeholder="Digite o título da conversa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Criar
              </button>
              <button
                type="button"
                onClick={() => setShowNewChatInput(false)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowNewChatInput(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nova Conversa
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : chatList.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Nenhuma conversa encontrada</p>
            <p className="text-sm">Crie uma nova conversa para começar</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentChat(chat)}
                className={`w-full px-4 py-2 text-left rounded-md transition-colors ${
                  currentChat?.id === chat.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">{chat.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 