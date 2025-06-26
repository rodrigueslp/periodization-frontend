import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StrengthFormStepper from '../components/strenght/StrengthFormStepper';
import { strengthTrainingService } from '../services/strengthTraining';
import { paymentService } from '../services/payment';

const CreateStrengthPlanPage = () => {
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
          objetivoDetalhado: formData.objetivoDetalhado,
          disponibilidade: parseInt(formData.disponibilidade),
          lesoes: formData.lesoes,
          historico: formData.historico,
          periodoTreino: formData.periodoTreino,
          trainingFocus: formData.trainingFocus,
          equipmentAvailable: formData.equipmentAvailable,
          sessionsPerWeek: formData.sessionsPerWeek,
          sessionDuration: formData.sessionDuration
        },
        planDuration: formData.planDuration,
        startDate: formData.startDate
      };
  
      // Passo 1: Criar plano pendente
      const planResponse = await strengthTrainingService.createPendingPlan(requestData);
      const planId = planResponse.planId;
      
      // Passo 2: Iniciar pagamento para este plano
      const paymentRequest = {
        planId: planId,
        description: "Plano de Treino de Musculação",
        amount: 9.90
      };
      
      const paymentResponse = await paymentService.createPayment(paymentRequest);
      
      // Armazenar informações importantes no localStorage para recuperação
      localStorage.setItem('pendingPlan', JSON.stringify({
        planId: planId,
        externalReference: paymentResponse.externalReference,
        planType: 'STRENGTH'
      }));
      
      // Redirecionar para a página de pagamento
      navigate('/payment', { 
        state: { 
          paymentData: paymentResponse,
          planId: planId,
          planType: 'STRENGTH'
        } 
      });
      
    } catch (err) {
      console.error('Erro ao criar plano de musculação:', err);
      setError(
        err.message || 
        'Ocorreu um erro ao criar o plano de musculação. Por favor, tente novamente.'
      );
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Plano de Musculação</h1>
          <p className="mt-1 text-sm text-gray-600">
            Preencha as informações para gerar um plano personalizado de treino de musculação
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-green-600 font-medium">
              Gerando seu plano de musculação...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Isso pode levar alguns minutos. Estamos criando um plano personalizado para você.
            </p>
          </div>
        ) : (
          <StrengthFormStepper onSubmit={handleSubmit} />
        )}
      </div>
    </Layout>
  );
};

export default CreateStrengthPlanPage;
