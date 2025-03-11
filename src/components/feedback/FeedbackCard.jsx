import React, { useState } from 'react';

const FeedbackCard = ({ onSubmit }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 500;

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxCharacters) {
      setFeedbackText(text);
      setCharacterCount(text.length);
    }
  };

  const handleSubmit = async () => {
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Implementar chamada à API de feedback
      await onSubmit({
        feedbackText,
        feedbackType
      });
      
      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      setFeedbackText('');
      setFeedbackType('GENERAL');
      setCharacterCount(0);
      
      // Esconder mensagem após 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Envie sua Sugestão ou Feedback
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Sua opinião é muito importante para continuarmos melhorando nossa plataforma.
        </p>
      </div>
      
      <div className="px-6 py-5">
        {showSuccess ? (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Feedback enviado com sucesso! Agradecemos sua contribuição.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Feedback
              </label>
              <select
                id="feedbackType"
                name="feedbackType"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="GENERAL">Feedback Geral</option>
                <option value="BUG">Reportar Problema</option>
                <option value="FEATURE_REQUEST">Sugestão de Nova Funcionalidade</option>
                <option value="IMPROVEMENT">Melhoria em Funcionalidade Existente</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="feedbackText" className="block text-sm font-medium text-gray-700 mb-1">
                Sua Mensagem
              </label>
              <textarea
                id="feedbackText"
                name="feedbackText"
                rows={4}
                value={feedbackText}
                onChange={handleTextChange}
                placeholder={
                  feedbackType === 'BUG' 
                    ? 'Descreva o problema que encontrou. Se possível, inclua passos para reproduzi-lo...'
                    : feedbackType === 'FEATURE_REQUEST'
                    ? 'Que nova funcionalidade você gostaria de ver no sistema? Por que ela seria útil?'
                    : feedbackType === 'IMPROVEMENT'
                    ? 'Qual funcionalidade existente você acha que poderia ser melhorada e como?'
                    : 'Digite sua mensagem, sugestão ou comentário aqui...'
                }
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {characterCount}/{maxCharacters} caracteres
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !feedbackText.trim()}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                  ${(isSubmitting || !feedbackText.trim()) 
                    ? 'bg-indigo-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : 'Enviar Feedback'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;