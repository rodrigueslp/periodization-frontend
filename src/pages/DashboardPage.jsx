import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { periodizationService } from '../services/periodization';
import { feedbackService } from '../services/feedback';
import { useNavigate } from 'react-router-dom';
import GeneratingProgress from '../components/training/GeneratingProgress';
import MiniProgress from '../components/ui/MiniProgress';
import FeedbackCard from '../components/feedback/FeedbackCard';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    completedPlans: 0,
    recentPlans: []
  });
  const [loading, setLoading] = useState(true);
  const [generatingPlanId, setGeneratingPlanId] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleGeneratePlan = async (planId) => {
    try {
      setGeneratingPlanId(planId);
      await periodizationService.generateApprovedPlan(planId);
      
      // Redirecionar para a página de visualização do plano
      navigate(`/view-plan/${planId}`);
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      // Mostrar mensagem de erro se necessário
    } finally {
      setGeneratingPlanId(null);
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await feedbackService.submitFeedback(feedbackData);
      setFeedbackSuccess(true);
      
      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 5000);
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Buscar todos os planos
        const plans = await periodizationService.getAllPlans();
        
        // Calcular estatísticas (simulado - ajuste conforme sua API)
        const activePlans = plans.filter(plan => !plan.isCompleted).length;
        const completedPlans = plans.filter(plan => plan.isCompleted).length;
        
        // Pegar os 3 planos mais recentes
        const recentPlans = [...plans]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        
        setStats({
          totalPlans: plans.length,
          activePlans,
          completedPlans,
          recentPlans
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mapear objetivos para cores
  const goalColors = {
    forca: 'bg-blue-100 text-blue-800',
    resistencia: 'bg-green-100 text-green-800',
    potencia: 'bg-purple-100 text-purple-800',
    emagrecimento: 'bg-yellow-100 text-yellow-800',
    competicao: 'bg-red-100 text-red-800',
    hipertrofia: 'bg-indigo-100 text-indigo-800',
    geral: 'bg-gray-100 text-gray-800'
  };

  // Mapeando valores para exibição mais amigável
  const goalLabels = {
    forca: 'Ganho de Força',
    resistencia: 'Resistência',
    potencia: 'Potência',
    emagrecimento: 'Emagrecimento',
    competicao: 'Preparação para Competição',
    hipertrofia: 'Hipertrofia',
    geral: 'Condicionamento Geral'
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visão geral das suas periodizações de treino
        </p>
      </div>

      {feedbackSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Feedback enviado com sucesso! Obrigado por contribuir para a evolução da plataforma.</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Cards de estatísticas - Responsivo para 1, 2 ou 3 colunas dependendo do tamanho da tela */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm">Total de Periodizações</p>
                  <h3 className="font-bold text-xl sm:text-2xl">{stats.totalPlans}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm">Periodizações Ativas</p>
                  <h3 className="font-bold text-xl sm:text-2xl">{stats.activePlans}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm">Periodizações Concluídas</p>
                  <h3 className="font-bold text-xl sm:text-2xl">{stats.completedPlans}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Planos Pendentes de Geração */}
          {stats.recentPlans.some(plan => plan.canGenerate) && (
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6 sm:mb-8">
              <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Planos Pendentes de Geração
                </h3>
                <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">
                  Planos que foram pagos mas ainda não foram gerados
                </p>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {stats.recentPlans
                  .filter(plan => plan.canGenerate)
                  .map((plan) => (
                    <li key={plan.planId} className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-2 sm:mb-0">
                          <h4 className="text-sm font-medium text-indigo-600">{plan.athleteName}</h4>
                          <p className="text-xs text-gray-500">
                            Criado em {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {generatingPlanId === plan.planId ? (
                          <>
                            <button
                              disabled
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-500 opacity-90"
                            >
                              <MiniProgress text="Iniciando..." />
                            </button>
                            <div className="w-full mt-3">
                              <GeneratingProgress status="GENERATING" compact={true} />
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() => handleGeneratePlan(plan.planId)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                          >
                            Gerar Plano
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Periodizações Recentes */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6 sm:mb-8">
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Periodizações Recentes
              </h3>
            </div>
            
            {stats.recentPlans.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.recentPlans.map((plan) => (
                  <li key={plan.planId}>
                    <Link to={`/view-plan/${plan.planId}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {plan.athleteName}
                          </p>
                          <div className="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${goalColors[plan.trainingGoal] || 'bg-gray-100 text-gray-800'}`}>
                              {goalLabels[plan.trainingGoal] || plan.trainingGoal}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              {plan.planDuration} semanas
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <p>
                              {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                          {(plan.status === 'QUEUED' || plan.status === 'GENERATING') && (
                          <div className="mt-3">
                            <GeneratingProgress status={plan.status} />
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Nenhuma periodização criada ainda</p>
                <Link
                  to="/create-plan"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Criar Nova Periodização
                </Link>
              </div>
            )}
            
            {stats.totalPlans > 3 && (
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <Link
                  to="/view-plans"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Ver todas as periodizações →
                </Link>
              </div>
            )}
          </div>

          {/* Componente de Feedback (agora colocado por último) */}
          <div className="mb-6 sm:mb-8">
            <FeedbackCard onSubmit={handleFeedbackSubmit} />
          </div>
        </>
      )}
    </Layout>
  );
};

export default DashboardPage;