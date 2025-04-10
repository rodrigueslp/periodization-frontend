import api from './api';

export const strengthTrainingService = {
  // Obter todos os planos
  getAllPlans: async () => {
    return api.get('/api/strength-training');
  },
  
  // Obter um plano específico
  getPlan: async (planId) => {
    return api.get(`/api/strength-training/${planId}`);
  },
  
  // Criar um plano pendente de pagamento
  createPendingPlan: async (planData) => {
    return api.post('/api/strength-training', planData);
  },
  
  // Solicitar geração assíncrona de um plano que já foi pago
  generateApprovedPlan: async (planId) => {
    return api.post(`/api/strength-training/${planId}/generate`);
  },
  
  // Fazer download do plano
  downloadPlan: async (planId) => {
    try {
      const blob = await api.get(`/api/strength-training/${planId}/download`);
      // Cria um URL temporário para o blob
      const url = window.URL.createObjectURL(blob);
      // Cria um link e simula o clique
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `musculacao_${planId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      // Limpa o URL temporário
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      // Verificar se é um erro de arquivo não encontrado
      if (error.message && error.message.includes('não encontrado')) {
        throw new Error('O arquivo Excel deste plano ainda não foi gerado.');
      }
      throw error;
    }
  },
  
  downloadPlanPdf: async (planId) => {
    try {
      const blob = await api.get(`/api/strength-training/${planId}/download-pdf`);
      // Cria um URL temporário para o blob
      const url = window.URL.createObjectURL(blob);
      // Cria um link e simula o clique
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `musculacao_${planId}.pdf`;
      document.body.appendChild(a);
      a.click();
      // Limpa o URL temporário
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error);
      // Verificar se é um erro de arquivo não encontrado
      if (error.message && error.message.includes('não encontrado')) {
        throw new Error('O arquivo PDF deste plano ainda não foi gerado.');
      }
      throw error;
    }
  }
};