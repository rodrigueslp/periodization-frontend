import api from './api';

export const periodizationService = {
  // Obter todos os planos
  getAllPlans: async () => {
    return api.get('/api/periodization');
  },
  
  // Obter um plano específico
  getPlan: async (planId) => {
    return api.get(`/api/periodization/${planId}`);
  },
  
  // Criar um novo plano
  createPlan: async (planData) => {
    return api.post('/api/periodization', planData);
  },

  createPendingPlan: async (planData) => {
    return api.post('/api/periodization', planData);
  },
  
  // Gerar conteúdo para um plano que já foi pago
  generateApprovedPlan: async (planId) => {
    return api.post(`/api/periodization/${planId}/generate`);
  },
  
  // Fazer download do plano
  downloadPlan: async (planId) => {
    try {
      const blob = await api.get(`/api/periodization/${planId}/download`);
      // Cria um URL temporário para o blob
      const url = window.URL.createObjectURL(blob);
      // Cria um link e simula o clique
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `periodizacao_crossfit_${planId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      // Limpa o URL temporário
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      throw error;
    }
  }
};