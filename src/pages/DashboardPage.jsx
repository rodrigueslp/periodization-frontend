import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { periodizationService } from '../services/periodization';
import { strengthTrainingService } from '../services/strengthTraining';
import { runningTrainingService } from '../services/runningTraining';
import { feedbackService } from '../services/feedback';
import GeneratingProgress from '../components/training/GeneratingProgress';
import MiniProgress from '../components/ui/MiniProgress';
import FeedbackCard from '../components/feedback/FeedbackCard';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    completedPlans: 0,
    crossfitPlans: 0,
    strengthPlans: 0,
    runningPlans: 0,
    recentPlans: []
  });
  const [loading, setLoading] = useState(true);
  const [generatingPlanId, setGeneratingPlanId] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleGeneratePlan = async (planId, planType) => {
    try {
      setGeneratingPlanId(planId);
      
      if (planType === 'STRENGTH') {
        await strengthTrainingService.generateApprovedPlan(planId);
        navigate(`/view-strength-plan/${planId}`);
      } else if (planType === 'RUNNING') {
        await runningTrainingService.generateApprovedPlan(planId);
        navigate(`/view-running-plan/${planId}`);
      } else {
        await periodizationService.generateApprovedPlan(planId);
        navigate(`/view-plan/${planId}`);
      }
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
        // Buscar todos os tipos de planos em paralelo
        const [crossfitPlans, strengthPlans, runningPlans] = await Promise.all([
          periodizationService.getAllPlans().catch(() => []),
          strengthTrainingService.getAllPlans().catch(() => []),
          runningTrainingService.getAllPlans().catch(() => [])
        ]);

        // Marcar cada plano com seu tipo para facilitar o processamento
        const markedCrossfitPlans = crossfitPlans.map(plan => ({
          ...plan,
          planType: 'CROSSFIT'
        }));

        const markedStrengthPlans = strengthPlans.map(plan => ({
          ...plan,
          planType: 'STRENGTH'
        }));

        const markedRunningPlans = runningPlans.map(plan => ({
          ...plan,
          planType: 'RUNNING'
        }));

        // Combinar todos os planos
        const allPlans = [...markedCrossfitPlans, ...markedStrengthPlans, ...markedRunningPlans];
        
        // Calcular estatísticas
        const activePlans = allPlans.filter(plan => !plan.isCompleted).length;
        const completedPlans = allPlans.filter(plan => plan.isCompleted).length;
        
        // Pegar os 5 planos mais recentes
        const recentPlans = [...allPlans]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        setStats({
          totalPlans: allPlans.length,
          activePlans,
          completedPlans,
          crossfitPlans: markedCrossfitPlans.length,
          strengthPlans: markedStrengthPlans.length,
          runningPlans: markedRunningPlans.length,
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

  // Mapear objetivos para cores (incluindo objetivos de corrida)
  const goalColors = {
    // Objetivos de CrossFit
    forca: 'bg-blue-100 text-blue-800',
    resistencia: 'bg-green-100 text-green-800',
    potencia: 'bg-purple-100 text-purple-800',
    emagrecimento: 'bg-yellow-100 text-yellow-800',
    competicao: 'bg-red-100 text-red-800',
    geral: 'bg-gray-100 text-gray-800',
    
    // Objetivos de Musculação
    hipertrofia: 'bg-indigo-100 text-indigo-800',
    definicao: 'bg-orange-100 text-orange-800',
    condicionamento: 'bg-teal-100 text-teal-800',
    
    // Objetivos de Corrida
    '5k': 'bg-pink-100 text-pink-800',
    '10k': 'bg-cyan-100 text-cyan-800',
    '21k': 'bg-amber-100 text-amber-800',
    '42k': 'bg-red-100 text-red-800',
    'condicionamento geral': 'bg-slate-100 text-slate-800'
  };

  // Mapeando valores para exibição mais amigável
  const goalLabels = {
    // Objetivos de CrossFit
    forca: 'Ganho de Força',
    resistencia: 'Resistência',
    potencia: 'Potência',
    emagrecimento: 'Emagrecimento',
    competicao: 'Preparação para Competição',
    geral: 'Condicionamento Geral',
    
    // Objetivos de Musculação
    hipertrofia: 'Hipertrofia',
    definicao: 'Definição Muscular',
    condicionamento: 'Condicionamento Geral',
    
    // Objetivos de Corrida
    '5k': '5K',
    '10k': '10K',
    '21k': '21K (Meia Maratona)',
    '42k': '42K (Maratona)',
    'condicionamento geral': 'Condicionamento Geral'
  };

  // Função para obter o caminho correto da visualização do plano
  const getPlanViewPath = (plan) => {
    if (plan.planType === 'STRENGTH') {
      return `/view-strength-plan/${plan.planId}`;
    } else if (plan.planType === 'RUNNING') {
      return `/view-running-plan/${plan.planId}`;
    } else {
      return `/view-plan/${plan.planId}`;
    }
  };

  // Função para renderizar o badge do tipo de plano
  const renderPlanTypeBadge = (planType) => {
    if (planType === 'STRENGTH') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 ml-2">
          <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Musculação
        </span>
      );
    } else if (planType === 'RUNNING') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 ml-2">
          <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Corrida
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 ml-2">
          <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          CrossFit
        </span>
      );
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visão geral dos seus planos de treinamento
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
          {/* Cards de estatísticas - Agora com 6 cards incluindo corrida */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-500 text-xs">Total de Planos</p>
                  <h3 className="font-bold text-lg sm:text-xl">{stats.totalPlans}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-500 text-xs">CrossFit</p>
                  <h3 className="font-bold text-lg sm:text-xl">{stats.crossfitPlans}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-500 text-xs">Musculação</p>
                  <h3 className="font-bold text-lg sm:text-xl">{stats.strengthPlans}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-500 text-xs">Corrida</p>
                  <h3 className="font-bold text-lg sm:text-xl">{stats.runningPlans}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-500 text-xs">Ativos</p>
                  <h3 className="font-bold text-lg sm:text-xl">{stats.activePlans}</h3>
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
                <div className="ml-3">
                  <p className="text-gray-500 text-xs">Concluídos</p>
                  <h3 className="font-bold text-lg sm:text-xl">{stats.completedPlans}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/create-crossfit-plan"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Novo Plano CrossFit
              </Link>
              <Link
                to="/create-strength-plan"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Novo Plano Musculação
              </Link>
              <Link
                to="/create-running-plan"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Novo Plano Corrida
              </Link>
            </div>
          </div>

          {/* Planos recentes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Planos Recentes</h2>
                <Link
                  to="/view-plans"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Ver todos
                </Link>
              </div>
              
              {stats.recentPlans.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum plano criado</h3>
                  <p className="mt-1 text-sm text-gray-500">Comece criando seu primeiro plano de treinamento.</p>
                  <div className="mt-6">
                    <Link
                      to="/create-plan"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Criar primeiro plano
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {stats.recentPlans.map((plan) => (
                      <li key={plan.planId} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {plan.athleteName}
                              </p>
                              {renderPlanTypeBadge(plan.planType)}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${goalColors[plan.trainingGoal] || 'bg-gray-100 text-gray-800'}`}>
                                {goalLabels[plan.trainingGoal] || plan.trainingGoal}
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <p className="text-xs text-gray-500">
                                {plan.createdAt}
                              </p>
                            </div>
                            
                            {(plan.status === 'QUEUED' || plan.status === 'GENERATING') && (
                              <div className="mt-2">
                                <GeneratingProgress status={plan.status} compact={true} />
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {plan.canGenerate && (
                              <button
                                onClick={() => handleGeneratePlan(plan.planId, plan.planType)}
                                disabled={generatingPlanId === plan.planId}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                              >
                                {generatingPlanId === plan.planId ? (
                                  <MiniProgress className="mx-1" />
                                ) : (
                                  'Gerar'
                                )}
                              </button>
                            )}
                            <Link
                              to={getPlanViewPath(plan)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Ver
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Card de Feedback */}
          <div className="mt-6 sm:mt-8">
            <FeedbackCard onSubmit={handleFeedbackSubmit} />
          </div>
        </>
      )}
    </Layout>
  );
};

export default DashboardPage;
