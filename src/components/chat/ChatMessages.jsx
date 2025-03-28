import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { User, Bot } from 'lucide-react';

export default function ChatMessages() {
  const { messages, loading } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex items-start space-x-3 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot size={20} className="text-blue-600" />
              </div>
            </div>
          )}
          
          <div
            className={`max-w-[70%] rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.message}</p>
            {message.role === 'assistant' && message.sources && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Fontes:</p>
                <ul className="list-disc list-inside">
                  {message.sources.map((source, idx) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
} 