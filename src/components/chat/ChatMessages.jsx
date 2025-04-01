import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TypingIndicator from './TypingIndicator';

export default function ChatMessages() {
  const { messages, loading, isTyping } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  // Função segura para processar mensagens
  const safeProcessMessage = (messageText) => {
    try {
      if (!messageText) return '';
      return messageText.replace(/###/g, "##");
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      return 'Erro ao exibir a mensagem.';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex items-start space-x-2 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot size={16} className="text-blue-600" />
              </div>
            </div>
          )}
          
          <div
            className={`max-w-[85%] rounded-lg p-2.5 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {message.role === 'user' ? (
              <p className="whitespace-pre-wrap text-sm">{message.message}</p>
            ) : (
              <div className="markdown-content prose prose-sm max-w-none text-gray-800">
                {message.message ? (
                  <ReactMarkdown className="text-sm break-words">
                    {safeProcessMessage(message.message)}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm">Carregando resposta...</p>
                )}
              </div>
            )}
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Indicador de digitação */}
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
} 