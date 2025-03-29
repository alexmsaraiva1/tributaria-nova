import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { PlusCircle, MessageSquare } from 'lucide-react';

export default function ChatList() {
  const { chatList, currentChat, loading, createChat, setCurrentChat } = useChat();

  const handleCreateNewChat = async () => {
    try {
      // Cria um novo chat com título automático baseado na data
      const dateStr = new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      await createChat(`Nova conversa ${dateStr}`);
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={handleCreateNewChat}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors"
          disabled={loading}
        >
          <PlusCircle size={18} className="mr-2" />
          Nova Conversa
        </button>
      </div>

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
                onClick={() => setCurrentChat(chat)}
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