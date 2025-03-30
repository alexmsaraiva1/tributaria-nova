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
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
          </div>
        ) : chatList.length === 0 ? (
          <div className="text-center text-gray-500 py-6 px-4">
            <p>Nenhuma conversa encontrada</p>
            <p className="text-sm mt-2">Clique em "Nova Conversa" para começar a interagir com o tributarIA</p>
          </div>
        ) : (
          <div className="px-2 space-y-1.5">
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full px-3 py-2.5 text-left rounded-lg transition-colors border ${
                  currentChat?.id === chat.id
                    ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-sm'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full ${
                    currentChat?.id === chat.id ? 'bg-blue-100' : 'bg-gray-100'
                  } flex items-center justify-center mr-2.5`}>
                    <MessageSquare size={14} className={`${
                      currentChat?.id === chat.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      currentChat?.id === chat.id ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {chat.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {new Date(chat.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 