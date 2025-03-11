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
      
      // Salvar token JWT e refresh token
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Calcular expiração (assumindo 1 hora de validade)
      const expiresAt = Date.now() + 3600000; // 1 hora em milissegundos
      localStorage.setItem('expiresAt', expiresAt.toString());
      
      // Salvar informações do usuário
      const userInfo = {
        id: response.id,
        email: response.email,
        name: response.name,
        roles: response.roles,
        profilePicture: response.profilePicture,
        subscriptionPlan: response.subscriptionPlan,
        hasActiveSubscription: response.hasActiveSubscription
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      return response;
    } catch (error) {
      console.error('Erro ao validar token Google:', error);
      throw error;
    }
  },
  
  // Renovar token
  refreshToken: async () => {
    try {
      return await api.refreshToken();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
    }
  },
  
  // Obter informações do usuário logado
  getUserInfo: async () => {
    try {
      const response = await api.get('/api/auth/me');
      
      // Atualizar informações no localStorage
      const userInfo = {
        id: response.id,
        email: response.email,
        name: response.fullName,
        roles: response.roles,
        profilePicture: response.profilePicture,
        subscriptionPlan: response.subscriptionPlan,
        hasActiveSubscription: response.hasActiveSubscription
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      return response;
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
  logout: async () => {
    try {
      // Tentar fazer logout no servidor (invalidar refresh token)
      if (localStorage.getItem('token')) {
        await api.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      // Limpar todos os dados de autenticação locais
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('userInfo');
    }
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
