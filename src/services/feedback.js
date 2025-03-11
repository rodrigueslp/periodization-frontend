// src/services/feedback.js

import api from './api';

export const feedbackService = {
  /**
   * Envia feedback do usuário para o servidor
   * @param {Object} data - Dados do feedback
   * @param {string} data.feedbackText - Texto do feedback
   * @param {string} data.feedbackType - Tipo de feedback (GENERAL, BUG, FEATURE_REQUEST, IMPROVEMENT)
   * @param {string} [data.planId] - ID opcional do plano relacionado ao feedback
   * @returns {Promise<Object>} - Resposta da API
   */
  submitFeedback: async (data) => {
    try {
      const response = await api.post('/api/feedback', data);
      return response;
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      throw error;
    }
  },

  /**
   * Obtém feedbacks enviados pelo usuário (para uso futuro)
   * @returns {Promise<Array>} - Lista de feedbacks
   */
  getUserFeedbacks: async () => {
    try {
      const response = await api.get('/api/feedback/user');
      return response;
    } catch (error) {
      console.error('Erro ao buscar feedbacks do usuário:', error);
      throw error;
    }
  }
};

export default feedbackService;