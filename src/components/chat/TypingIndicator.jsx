import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  const [dots, setDots] = useState('.');
  
  // Atualiza os pontos a cada 500ms para criar a animação
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-start space-x-3 justify-start">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot size={20} className="text-blue-600" />
        </div>
      </div>
      
      <div className="max-w-[70%] rounded-lg p-4 bg-gray-100 text-gray-800">
        <p className="text-sm text-gray-600 font-medium animate-pulse">
          Digitando{dots}
        </p>
      </div>
    </div>
  );
} 