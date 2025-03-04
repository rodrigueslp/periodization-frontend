import api from './api';

export const paymentService = {
  // Criar um pagamento e obter o código Pix ou URL de pagamento
  createPayment: async (planId) => {
    const paymentData = {
      planId,
      description: "Plano de Periodização CrossFit",
      amount: 9.90
    };
    
    return api.post('/api/payments', paymentData);
  },
  
  // Verificar o status de um pagamento
  checkPaymentStatus: async (externalReference) => {
    return api.get(`/api/payments/status/${externalReference}`);
  },

  // Simular aprovação de pagamento (apenas para ambiente de desenvolvimento)
  simulatePaymentApproval: async (externalReference) => {
    return api.post(`/api/payments/simulate-approval/${externalReference}`);
  },
  
  // Obter histórico de pagamentos do usuário
  getUserPayments: async () => {
    return api.get('/api/payments');
  }
};