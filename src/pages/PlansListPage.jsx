import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { periodizationService } from '../services/periodization';
import { strengthTrainingService } from '../services/strengthTraining';
import { runningTrainingService } from '../services/runningTraining';
import GeneratingProgress from '../components/training/GeneratingProgress';
import MiniProgress from '../components/ui/MiniProgress';

const PlansListPage = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPlanId, setGeneratingPlanId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
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
      setError('Erro ao iniciar geração do plano. Por favor, tente novamente.');
    } finally {
      setGeneratingPlanId(null);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

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

        // Combinar todos os planos e ordenar por data de criação (mais recentes primeiro)
        const combinedPlans = [...markedCrossfitPlans, ...markedStrengthPlans, ...markedRunningPlans]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setAllPlans(combinedPlans);
        setFilteredPlans(combinedPlans);
      } catch (err) {
        console.error('Erro ao buscar planos:', err);
        setError('Não foi possível carregar os planos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Aplicar filtros quando filterType ou filterStatus mudarem
  useEffect(() => {
    let filtered = [...allPlans];

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(plan => plan.planType === filterType);
    }

    // Filtro por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(plan => {
        if (filterStatus === 'active') {
          return !plan.isCompleted && plan.status === 'COMPLETED';
        } else if (filterStatus === 'completed') {
          return plan.isCompleted;
        } else if (filterStatus === 'pending') {
          return plan.status === 'PAYMENT_PENDING';
        } else if (filterStatus === 'approved') {
          return plan.status === 'PAYMENT_APPROVED';
        } else if (filterStatus === 'generating') {
          return plan.status === 'QUEUED' || plan.status === 'GENERATING';
        } else if (filterStatus === 'failed') {
          return plan.status === 'FAILED';
        }
        return true;
      });
    }

    setFilteredPlans(filtered);
  }, [allPlans, filterType, filterStatus]);

  // Mapear objetivos para cores
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

  // Status colors
  const statusColors = {
    'PAYMENT_PENDING': 'bg-yellow-100 text-yellow-800',
    'PAYMENT_APPROVED': 'bg-blue-100 text-blue-800',
    'QUEUED': 'bg-indigo-100 text-indigo-800',
    'GENERATING': 'bg-purple-100 text-purple-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    'PAYMENT_PENDING': 'Pagamento Pendente',
    'PAYMENT_APPROVED': 'Pagamento Aprovado',
    'QUEUED': 'Na Fila',
    'GENERATING': 'Gerando',
    'COMPLETED': 'Concluído',
    'FAILED': 'Falhou'
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
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Musculação
        </span>
      );
    } else if (planType === 'RUNNING') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
          <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Corrida
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          CrossFit
        </span>
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Carregando seus planos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meus Planos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Visualize e gerencie todos os seus planos de treinamento
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/create-plan"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Novo Plano
            </Link>
          </div>
        </div>
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

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">
              Filtrar por Tipo
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">Todos os tipos</option>
              <option value="CROSSFIT">CrossFit</option>
              <option value="STRENGTH">Musculação</option>
              <option value="RUNNING">Corrida</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">
              Filtrar por Status
            </label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pagamento Pendente</option>
              <option value="approved">Pagamento Aprovado</option>
              <option value="generating">Em Geração</option>
              <option value="active">Ativos</option>
              <option value="completed">Concluídos</option>
              <option value="failed">Falharam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de planos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {allPlans.length === 0 ? 'Nenhum plano criado' : 'Nenhum plano encontrado'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {allPlans.length === 0 
                ? 'Comece criando seu primeiro plano de treinamento.' 
                : 'Tente ajustar os filtros para encontrar seus planos.'
              }
            </p>
            {allPlans.length === 0 && (
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
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredPlans.map((plan) => (
              <li key={plan.planId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {plan.athleteName}
                          </p>
                          <div className="ml-2">
                            {renderPlanTypeBadge(plan.planType)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${goalColors[plan.trainingGoal] || 'bg-gray-100 text-gray-800'}`}>
                              {goalLabels[plan.trainingGoal] || plan.trainingGoal}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <p className="truncate">{plan.createdAt}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[plan.status] || 'bg-gray-100 text-gray-800'}`}>
                              {statusLabels[plan.status] || plan.status}
                            </span>
                          </div>
                        </div>
                        
                        {(plan.status === 'QUEUED' || plan.status === 'GENERATING') && (
                          <div className="mt-3">
                            <GeneratingProgress status={plan.status} compact={true} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {plan.canGenerate && (
                        <button
                          onClick={() => handleGeneratePlan(plan.planId, plan.planType)}
                          disabled={generatingPlanId === plan.planId}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          {generatingPlanId === plan.planId ? (
                            <MiniProgress className="mx-1" />
                          ) : (
                            <>
                              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Gerar
                            </>
                          )}
                        </button>
                      )}
                      <Link
                        to={getPlanViewPath(plan)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Estatísticas */}
      {filteredPlans.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Mostrando {filteredPlans.length} de {allPlans.length} planos
            {filterType !== 'all' && (
              <span className="ml-1">
                • Filtro: {filterType === 'CROSSFIT' ? 'CrossFit' : filterType === 'STRENGTH' ? 'Musculação' : 'Corrida'}
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="ml-1">
                • Status: {statusLabels[filterStatus] || filterStatus}
              </span>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlansListPage;
