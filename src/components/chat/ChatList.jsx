import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { MessageSquare } from 'lucide-react';

export default function ChatList({ onChatSelect }) {
  const { chatList, currentChat, loading, setCurrentChat } = useChat();

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    // Chamar o callback onChatSelect, se fornecido
    if (onChatSelect) onChatSelect(chat);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : chatList.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 px-4">
            <p>Nenhuma conversa encontrada</p>
            <p className="text-sm mt-2">Clique em "Nova Conversa" para começar a interagir com o tributarIA</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full px-4 py-2 text-left rounded-md transition-colors ${
                  currentChat?.id === chat.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <MessageSquare size={18} className="mr-2 text-gray-500" />
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