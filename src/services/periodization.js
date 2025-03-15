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

  // Criar um plano pendente de pagamento
  createPendingPlan: async (planData) => {
    return api.post('/api/periodization', planData);
  },
  
  // Solicitar geração assíncrona de um plano que já foi pago
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
      // Verificar se é um erro de arquivo não encontrado
      if (error.message && error.message.includes('não encontrado')) {
        throw new Error('O arquivo Excel desta periodização ainda não foi gerado.');
      }
      throw error;
    }
  },
  
  downloadPlanPdf: async (planId) => {
    try {
      const blob = await api.get(`/api/periodization/${planId}/download-pdf`);
      // Cria um URL temporário para o blob
      const url = window.URL.createObjectURL(blob);
      // Cria um link e simula o clique
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `periodizacao_crossfit_${planId}.pdf`;
      document.body.appendChild(a);
      a.click();
      // Limpa o URL temporário
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error);
      // Verificar se é um erro de arquivo não encontrado
      if (error.message && error.message.includes('não encontrado')) {
        throw new Error('O arquivo PDF desta periodização ainda não foi gerado.');
      }
      throw error;
    }
  }
};