// Funções de validação
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone) => {
  // Formato brasileiro de telefone
  const phoneRegex = /^(\+55|55)?\s*\(?[1-9]{2}\)?\s*9?\d{4}[-\s]?\d{4}$/;
  return phoneRegex.test(phone);
};

// Funções de sanitização
export const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .slice(0, 1000); // Limita o tamanho do input
};

export const sanitizeMessage = (message) => {
  return message
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 5000); // Limite maior para mensagens
};

// Funções de validação de formulário
export const validateRegistrationForm = (formData) => {
  const errors = {};

  if (!formData.fullName || formData.fullName.length < 3) {
    errors.fullName = 'Nome completo deve ter pelo menos 3 caracteres';
  }

  if (!validatePhone(formData.phone)) {
    errors.phone = 'Telefone inválido';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }

  if (!formData.username || formData.username.length < 3) {
    errors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem';
  }

  if (!formData.acceptTerms) {
    errors.acceptTerms = 'Você precisa aceitar os termos de uso';
  }

  return errors;
};

// Funções de segurança
export const generateSessionToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const isSessionValid = (sessionToken) => {
  // Implementar lógica de validação de sessão
  return true;
}; 