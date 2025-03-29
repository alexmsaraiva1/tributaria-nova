import React from 'react';

// Componente SVG para o logo da Tributária
const LogoTributaria = ({ width = 40, height = 40, className = '' }) => {
  return (
    <svg 
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fundo circular */}
      <circle cx="20" cy="20" r="20" fill="#1E40AF" />
      
      {/* Letra T estilizada */}
      <path
        d="M11 10H29V14H23V30H17V14H11V10Z"
        fill="white"
      />
      
      {/* Símbolo $ (cifrão) estilizado */}
      <path
        d="M20 16C22.2091 16 24 17.7909 24 20C24 22.2091 22.2091 24 20 24C17.7909 24 16 22.2091 16 20C16 17.7909 17.7909 16 20 16Z"
        fill="#4ADE80"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
};

export default LogoTributaria; 