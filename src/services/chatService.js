import axios from 'axios';

// URL do webhook fixa para o serviço mllancamentos.com.br
const WEBHOOK_URL = "https://webhooks.mllancamentos.com.br/webhook/demo-tributaria";

/**
 * Formata o texto da resposta para markdown adequado
 * @param {string} text - Texto original 
 * @returns {string} - Texto formatado
 */
const formatResponseText = (text) => {
  if (!text) return "";
  
  // Substitui as marcações "### Número. ..." por "## Número. ..." para títulos de seção
  let formattedText = text.replace(/###\s+(\d+\.?\s+\*\*.*?\*\*)/g, "## $1");
  
  // Substitui "- " por "* " para listas
  formattedText = formattedText.replace(/^-\s+/gm, "* ");
  
  // Garante espaçamento adequado entre parágrafos
  formattedText = formattedText.replace(/\n{3,}/g, "\n\n");
  
  return formattedText;
};

/**
 * Serviço para lidar com chamadas à API do chatbot
 */
const chatService = {
  /**
   * Envia uma mensagem para a API de IA e obtém uma resposta
   * @param {string} message - A mensagem do usuário
   * @param {string} chatId - ID da conversa atual
   * @returns {Promise<object>} - Promessa com a resposta da API
   */
  sendMessageToAI: async (message, chatId) => {
    try {
      // Adiciona um timeout de 30 segundos
      const response = await axios.post(WEBHOOK_URL, {
        message,
        chat_id: chatId,
        user_id: localStorage.getItem('userId'),
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 segundos
      });
      
      let responseData = response.data;
      
      // Verifica se a resposta é um array e pega o primeiro item
      if (Array.isArray(responseData)) {
        responseData = responseData[0];
      }
      
      // Processa a mensagem, que pode ser uma string ou um array de strings
      let botResponseText = "";
      
      if (Array.isArray(responseData.message)) {
        // Junta todas as partes da mensagem
        botResponseText = responseData.message.join('\n\n');
      } else {
        botResponseText = responseData.message || "Não foi possível obter uma resposta específica.";
      }
      
      // Formata o texto para markdown adequado
      const formattedText = formatResponseText(botResponseText);
      
      return {
        reply: formattedText,
        success: true
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem para o webhook:', error);
      
      // Em caso de falha, retorna uma resposta de fallback
      return {
        reply: "Estamos enfrentando dificuldades técnicas. Como alternativa, sugiro consultar o site da Receita Federal para informações oficiais sobre a reforma tributária.",
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Função alternativa que simula uma resposta da API (fallback)
   * @param {string} message - A mensagem do usuário 
   * @returns {Promise<object>} - Promessa com a resposta simulada
   */
  getSimulatedResponse: async (message) => {
    // Simula um tempo de processamento de 1-2 segundos
    const delay = 1000 + Math.random() * 1000;
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Palavras-chave para identificar o tipo de pergunta
        let reply = '';
        
        if (message.toLowerCase().includes('reforma tributária')) {
          reply = 'A Reforma Tributária (PEC 45/2019) propõe substituir cinco tributos (PIS, Cofins, IPI, ICMS e ISS) por um Imposto sobre Bens e Serviços (IBS) e um Imposto Seletivo. O objetivo é simplificar o sistema tributário brasileiro, reduzir a burocracia e aumentar a transparência.';
        } else if (message.toLowerCase().includes('imposto') || message.toLowerCase().includes('tributo')) {
          reply = 'Os principais impostos no Brasil incluem o ICMS (estadual), ISS (municipal), IPI, PIS e COFINS (federais). A reforma tributária visa unificar alguns destes tributos para simplificar o sistema.';
        } else if (message.toLowerCase().includes('nota fiscal') || message.toLowerCase().includes('nfe')) {
          reply = 'A Nota Fiscal Eletrônica (NF-e) é um documento digital emitido e armazenado eletronicamente para documentar operações de circulação de mercadorias ou prestações de serviços. É obrigatória para a maioria das empresas.';
        } else if (message.toLowerCase().includes('mei') || message.toLowerCase().includes('microempreendedor')) {
          reply = 'O Microempreendedor Individual (MEI) é uma categoria empresarial com faturamento anual de até R$ 81.000 e possui tratamento tributário simplificado, pagando apenas um valor fixo mensal que inclui INSS, ISS e ICMS.';
        } else {
          reply = 'Entendi sua pergunta. A tributação brasileira é um sistema complexo com diversos impostos federais, estaduais e municipais. Posso ajudar com informações específicas sobre algum aspecto particular da tributação?';
        }
        
        resolve({
          reply,
          success: true,
          sources: [
            'Lei Complementar nº 123/2006',
            'Constituição Federal, art. 145-162',
            'Proposta de Emenda à Constituição (PEC) 45/2019'
          ]
        });
      }, delay);
    });
  }
};

export default chatService; 