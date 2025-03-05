import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { periodizationService } from '../services/periodization';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    completedPlans: 0,
    recentPlans: []
  });
  const [loading, setLoading] = useState(true);
  const [generatingPlanId, setGeneratingPlanId] = useState(null);
  
  const navigate = useNavigate();

  const handleGeneratePlan = async (planId) => {
    try {
      setLoading(true);
      await periodizationService.generateApprovedPlan(planId);
      
      // Redirecionar para a página de visualização do plano
      navigate(`/view-plan/${planId}`);
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      // Mostrar mensagem de erro se necessário
    } finally {
      setLoading(false);
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
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visão geral das suas periodizações de treino
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Total de Periodizações</p>
                    <h3 className="font-bold text-2xl">{stats.totalPlans}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Periodizações Ativas</p>
                    <h3 className="font-bold text-2xl">{stats.activePlans}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Periodizações Concluídas</p>
                    <h3 className="font-bold text-2xl">{stats.completedPlans}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de Distribuição de Objetivos */}
            {/* <div className="bg-white rounded-lg shadow p-5 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status das Periodizações</h2>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-100 text-green-800">
                          Ativas
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-800">
                          {stats.totalPlans > 0 ? Math.round((stats.activePlans / stats.totalPlans) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <div style={{ width: `${stats.totalPlans > 0 ? (stats.activePlans / stats.totalPlans) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                    </div>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-100 text-blue-800">
                          Concluídas
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-800">
                          {stats.totalPlans > 0 ? Math.round((stats.completedPlans / stats.totalPlans) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div style={{ width: `${stats.totalPlans > 0 ? (stats.completedPlans / stats.totalPlans) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Planos Pendentes de Geração */}
            {stats.recentPlans.some(plan => plan.canGenerate) && (
              <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Planos Pendentes de Geração
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Planos que foram pagos mas ainda não foram gerados
                  </p>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {stats.recentPlans
                    .filter(plan => plan.canGenerate)
                    .map((plan) => (
                      <li key={plan.planId} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-indigo-600">{plan.athleteName}</h4>
                            <p className="text-xs text-gray-500">
                              Criado em {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleGeneratePlan(plan.planId)}
                            disabled={generatingPlanId === plan.planId}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                          >
                            {generatingPlanId === plan.planId ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Gerando...
                              </>
                            ) : (
                              'Gerar Plano'
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Periodizações Recentes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Periodizações Recentes
                </h3>
              </div>
              
              {stats.recentPlans.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {stats.recentPlans.map((plan) => (
                    <li key={plan.planId}>
                      <Link to={`/view-plan/${plan.planId}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {plan.athleteName}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;