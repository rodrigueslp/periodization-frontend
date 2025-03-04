import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import FormStepper from '../components/periodization/FormStepper';
import { periodizationService } from '../services/periodization';

const CreatePlanPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Construir o objeto de requisição
      const requestData = {
        athleteData: {
          nome: formData.nome,
          idade: formData.idade,
          peso: formData.peso,
          altura: formData.altura,
          experiencia: formData.experiencia,
          objetivo: formData.objetivo,
          disponibilidade: formData.disponibilidade,
          lesoes: formData.lesoes,
          historico: formData.historico,
          benchmarks: formData.benchmarks
        },
        planDuration: formData.planDuration,
        paymentStatus: 'completed' // Adicionar informação de pagamento (este valor seria validado pelo backend)
      };

      // Usar o serviço de periodização em vez de chamar axios diretamente
      const response = await periodizationService.createPlan(requestData);
      
      // Redirecionar para a página de visualização do plano
      navigate(`/view-plan/${response.planId}`);
    } catch (err) {
      console.error('Erro ao criar periodização:', err);
      setError(
        err.message || 
        'Ocorreu um erro ao gerar a periodização. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nova Periodização</h1>
          <p className="mt-1 text-sm text-gray-600">
            Preencha as informações para gerar uma periodização personalizada de CrossFit
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-indigo-600 font-medium">
              Gerando sua periodização...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Isso pode levar alguns minutos. Estamos criando uma periodização personalizada para você.
            </p>
          </div>
        ) : (
          <FormStepper onSubmit={handleSubmit} />
        )}
      </div>
    </Layout>
  );
};

export default CreatePlanPage;