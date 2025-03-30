import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import chatService from '../../services/chatService';
import { Send } from 'lucide-react';

export default function ChatInput() {
  const { sendMessage, sendAssistantMessage, currentChat, loading, isTyping: contextIsTyping } = useChat();
  const [message, setMessage] = useState('');
  const [processingResponse, setProcessingResponse] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  // Função para obter resposta da IA
  const getAIResponse = async (userMessage) => {
    if (!currentChat) return;
    
    setProcessingResponse(true);
    
    try {
      // Chamar o webhook para obter a resposta
      const response = await chatService.sendMessageToAI(userMessage, currentChat.id);
      
      // Envia a resposta do assistente para o banco de dados
      if (response.success) {
        await sendAssistantMessage(response.reply);
      } else {
        console.error('Erro na resposta da IA:', response);
        await sendAssistantMessage("Estamos enfrentando dificuldades técnicas. Como alternativa, sugiro consultar o site da Receita Federal para informações oficiais sobre a reforma tributária.");
      }
    } catch (error) {
      console.error('Erro geral ao obter resposta da IA:', error);
      await sendAssistantMessage("Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para resolver o problema.");
    } finally {
      setProcessingResponse(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading || processingResponse || !currentChat) return;

    const userMessage = message.trim();
    try {
      // Limpa o input antes de enviar a mensagem
      setMessage('');
      
      // Envia a mensagem do usuário para o banco de dados
      const result = await sendMessage(userMessage);
      
      // Se a mensagem foi enviada com sucesso, consulta a IA
      if (result && !result.error) {
        await getAIResponse(userMessage);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isInputDisabled = loading || processingResponse || !currentChat;

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua dúvida sobre a reforma tributária..."
          className={`w-full resize-none rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 p-2 md:p-3 pr-10 min-h-[40px] md:min-h-[44px] max-h-[120px] text-sm md:text-base ${isInputDisabled ? 'bg-gray-50 text-gray-500' : ''}`}
          rows={1}
          disabled={isInputDisabled}
        />
        <button
          type="submit"
          disabled={!message.trim() || isInputDisabled}
          className="absolute right-2 bottom-2 p-1 md:p-1.5 rounded-full text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          {loading || processingResponse ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
          ) : (
            <Send size={16} className="md:size-18" />
          )}
        </button>
      </div>
    </form>
  );
} 