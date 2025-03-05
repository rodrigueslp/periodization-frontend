// src/components/payment/PaymentRedirect.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { periodizationService } from '../../services/periodization';
import FormStepper from '../periodization/FormStepper';

const PaymentRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planData, setPlanData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        // Obter o planId do estado da localização
        const planId = location.state?.planId;
        
        if (!planId) {
          throw new Error('ID do plano não encontrado');
        }
        
        // Buscar os detalhes do plano
        const plan = await periodizationService.getPlan(planId);
        
        if (plan.status !== 'PAYMENT_PENDING') {
          // Se o pagamento não estiver pendente, redirecionar para a página de visualização do plano
          navigate(`/view-plan/${planId}`);
          return;
        }
        
        // Formatar os dados do plano para corresponder à estrutura do formulário
        const formattedData = {
          planId: plan.planId,
          nome: plan.athleteName,
          idade: plan.athleteAge,
          peso: plan.athleteWeight,
          altura: plan.athleteHeight,
          experiencia: plan.experienceLevel,
          objetivo: plan.trainingGoal,
          objetivoDetalhado: plan.detailedGoal || '',
          disponibilidade: plan.availability,
          lesoes: plan.injuries || '',
          historico: plan.trainingHistory || '',
          planDuration: plan.planDuration,
          benchmarks: {
            backSquat: plan.benchmarks?.backSquat || '',
            deadlift: plan.benchmarks?.deadlift || '',
            clean: plan.benchmarks?.clean || '',
            snatch: plan.benchmarks?.snatch || '',
            fran: plan.benchmarks?.fran || '',
            grace: plan.benchmarks?.grace || ''
          }
        };
        
        setPlanData(formattedData);
      } catch (err) {
        console.error('Erro ao buscar dados do plano:', err);
        setError(err.message || 'Ocorreu um erro ao recuperar os dados do plano');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlanData();
  }, [location.state, navigate]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Carregando informações do plano...</p>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
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
          <div className="mt-6">
            <button
              onClick={() => navigate('/view-plans')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar para Meus Planos
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Pagamento</h1>
          <p className="mt-1 text-sm text-gray-600">
            Conclua o pagamento para gerar sua periodização personalizada
          </p>
        </div>
        
        {planData && (
          // Use FormStepper com initialStep=5 (etapa de pagamento)
          <FormStepper 
            initialStep={5} 
            formData={planData}
            onSubmit={() => {}} // Não precisamos de onSubmit aqui, pois o PaymentStep lida com tudo
          />
        )}
      </div>
    </Layout>
  );
};

export default PaymentRedirect;
