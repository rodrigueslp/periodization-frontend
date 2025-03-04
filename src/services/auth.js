import api from './api';

export const authService = {
  // Função de login tradicional
  login: async (email, password) => {
    // Implementar quando/se você adicionar login tradicional
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      return { success: true };
    }
    throw new Error('Email e senha são obrigatórios');
  },
  
  // Valida token Google e retorna JWT do backend
  validateGoogleToken: async (googleToken) => {
    try {
      const response = await api.get(`/api/auth/validate?token=${googleToken}`);
      return response;
    } catch (error) {
      console.error('Erro ao validar token Google:', error);
      throw error;
    }
  },
  
  // Obter informações do usuário logado
  getUserInfo: async () => {
    try {
      return api.get('/api/auth/me');
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      throw error;
    }
  },
  
  // Verificar status da assinatura
  checkSubscription: async () => {
    try {
      return api.get('/api/auth/check-subscription');
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      throw error;
    }
  },
  
  // Função de logout
  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },
  
  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  // Obter dados do usuário do localStorage
  getUserData: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }
};
