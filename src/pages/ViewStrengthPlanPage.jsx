// ViewStrengthPlanPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import FormattedPlanContent from '../components/training/FormattedPlanContent';
import GeneratingProgress from '../components/training/GeneratingProgress';
import { strengthTrainingService } from '../services/strengthTraining';
import MiniProgress from '../components/ui/MiniProgress';
import { formatDateSafely } from '../utils/dateUtils';

const ViewStrengthPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const { planId } = useParams();
  const [downloadError, setDownloadError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Polling para atualização automática caso o plano esteja em geração
  useEffect(() => {
    let interval;
    
    const fetchPlan = async () => {
      try {
        const data = await strengthTrainingService.getPlan(planId);
        setPlan(data);
        
        // Se o plano estiver em geração, continuamos o polling
        if (data.status === 'QUEUED' || data.status === 'GENERATING') {
          if (!interval) {
            interval = setInterval(fetchPlan, 10000); // a cada 10 segundos
          }
        } else if (interval) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Erro ao buscar plano:', err);
        setError(err.message || 'Não foi possível carregar o plano. Por favor, tente novamente.');
        if (interval) {
          clearInterval(interval);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [planId]);

  const handleDownload = async () => {
    try {
      setDownloadError(null);
      setTooltipVisible(false);
      await strengthTrainingService.downloadPlan(planId);
    } catch (err) {
      console.error('Erro download Excel:', err);
      setDownloadError(err.message || 'Erro ao baixar o arquivo Excel. Por favor, tente novamente.');
      setTooltipVisible(true);
      
      // Esconder o tooltip após 5 segundos
      setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadError(null);
      setTooltipVisible(false);
      await strengthTrainingService.downloadPlanPdf(planId);
    } catch (err) {
      console.error('Erro download PDF:', err);
      setDownloadError(err.message || 'Erro ao baixar o arquivo PDF. Por favor, tente novamente.');
      setTooltipVisible(true);
      
      // Esconder o tooltip após 5 segundos
      setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setGeneratingPlan(true);
      await strengthTrainingService.generateApprovedPlan(planId);
      
      // Recarregar os dados do plano após iniciar a geração
      const updatedPlan = await strengthTrainingService.getPlan(planId);
      setPlan(updatedPlan);
      setGeneratingPlan(false);
    } catch (err) {
      setError('Erro ao iniciar geração do plano. Por favor, tente novamente.');
      setGeneratingPlan(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Carregando plano de musculação...</p>
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
            <Link
              to="/plans"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar para Meus Planos
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <p className="text-gray-500">Plano não encontrado</p>
        </div>
      </Layout>
    );
  }

  // Renderizar a interface baseada no status do plano
  const renderPlanStatusSection = () => {
    switch(plan.status) {
      case 'PAYMENT_PENDING':
        return (
          <div className="bg-yellow-50 p-4 rounded-md mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Aguardando Pagamento</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Este plano está aguardando pagamento para ser gerado.</p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/payment-redirect"
                    state={{ planId: plan.planId }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                  >
                    Ir para Pagamento
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'PAYMENT_APPROVED':
        return (
          <div className="bg-blue-50 p-4 rounded-md mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Pagamento Aprovado</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>O pagamento foi aprovado! Você pode iniciar a geração de seu plano personalizado.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleGeneratePlan}
                    disabled={generatingPlan}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {generatingPlan ? (
                      <MiniProgress className="mx-2" />
                    ) : (
                      'Gerar Meu Plano'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'QUEUED':
        return (
          <div className="bg-indigo-50 p-4 rounded-md mt-4">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
              </div>
              <div className="sm:ml-3 flex-grow">
                <h3 className="text-sm font-medium text-indigo-800">Plano na Fila de Processamento</h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <p>Seu plano está na fila e será gerado em breve. Esta página atualizará automaticamente quando o processo for concluído.</p>
                </div>
                <GeneratingProgress status={plan.status} compact={false} />
                <div className="mt-4">
                  <Link
                    to="/plans"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Ver Todos os Planos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'GENERATING':
        return (
          <div className="bg-purple-50 p-4 rounded-md mt-4">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                <svg className="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="sm:ml-3 flex-grow">
                <h3 className="text-sm font-medium text-purple-800">Gerando Seu Plano</h3>
                <div className="mt-2 text-sm text-purple-700">
                  <p>Estamos gerando seu plano personalizado. Isso pode levar alguns minutos.</p>
                </div>
                <GeneratingProgress status={plan.status} compact={false} />
                <div className="mt-4">
                  <Link
                    to="/plans"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                  >
                    Ver Todos os Planos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'FAILED':
        return (
          <div className="bg-red-50 p-4 rounded-md mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 01-1 1H9a1 1 0 01-1-1V9a1 1 0 011-1h1a1 1 0 011 1v5zm0-8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Falha na Geração</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Houve um problema ao gerar seu plano. Por favor, tente iniciar a geração novamente.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleGeneratePlan}
                    disabled={generatingPlan}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {generatingPlan ? 'Iniciando Geração...' : 'Tentar Novamente'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Objeto para traduzir as chaves para português
  const labels = {
    experienceLevel: 'Nível de Experiência',
    trainingGoal: 'Objetivo',
    trainingFocus: 'Foco do Treino',
    equipmentAvailable: 'Equipamentos Disponíveis',
    sessionsPerWeek: 'Sessões por Semana',
    sessionDuration: 'Duração de Cada Sessão',
    availability: 'Disponibilidade',
    injuries: 'Lesões',
    trainingHistory: 'Histórico de Treino',
    planDuration: 'Duração do Plano',
    startDate: 'Data de Início',
    endDate: 'Data do Término',
    createdAt: 'Data de Criação'
  };

  // Mapeando valores para exibição mais amigável
  const experienceLabels = {
    iniciante: 'Iniciante (0-6 meses)',
    intermediario: 'Intermediário (6 meses - 2 anos)',
    avancado: 'Avançado (2+ anos)',
    elite: 'Elite/Competidor'
  };

  const goalLabels = {
    hipertrofia: 'Hipertrofia',
    forca: 'Força',
    resistencia: 'Resistência Muscular',
    emagrecimento: 'Emagrecimento',
    definicao: 'Definição Muscular',
    reabilitacao: 'Reabilitação'
  };

  // Verifica se há planContent antes de renderizar
  const planContent = plan.planContent || '';
  const showContent = plan.status === 'COMPLETED';
  
  return (
    <Layout>
      {/* Seção de status do plano */}
      {renderPlanStatusSection()}

      {/* Exibir mensagem de erro de download se houver */}
      {downloadError && (
        <div className="mt-3 rounded-md bg-amber-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">{downloadError}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Plano de Musculação para {plan.athleteName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Criado em {plan.createdAt}
            </p>
          </div>
          {showContent && (
            <div className="relative">
              <div className="flex space-x-2">
                {plan.pdfFilePath && (
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                )}
              </div>
              {/* Tooltip de erro */}
              {tooltipVisible && downloadError && (
                <div className="absolute z-10 -bottom-16 right-0 bg-amber-50 text-amber-700 border border-amber-200 rounded-md shadow-lg px-4 py-2 max-w-xs animate-fade-in-up">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-4 w-4 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs">{downloadError}</p>
                    </div>
                    <button 
                      onClick={() => setTooltipVisible(false)}
                      className="ml-2 text-amber-400 hover:text-amber-600"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome do Atleta</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.athleteName}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Idade</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.athleteAge} anos</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Peso</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.athleteWeight} kg</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Altura</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.athleteHeight} cm</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{labels.experienceLevel}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {experienceLabels[plan.experienceLevel] || plan.experienceLevel}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{labels.trainingGoal}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {goalLabels[plan.trainingGoal] || plan.trainingGoal}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{labels.trainingFocus}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.trainingFocus}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{labels.sessionsPerWeek}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.sessionsPerWeek} dias por semana</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{labels.sessionDuration}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.sessionDuration} minutos</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{labels.planDuration}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.planDuration} semanas</dd>
            </div>
            {plan.startDate && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{labels.startDate}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDateSafely(plan.startDate)}
                </dd>
              </div>
            )}
            {plan.endDate && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{labels.endDate}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDateSafely(plan.endDate)}
                </dd>
              </div>
            )}
            {plan.equipmentAvailable && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{labels.equipmentAvailable}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.equipmentAvailable}</dd>
              </div>
            )}
            {plan.injuries && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{labels.injuries}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.injuries}</dd>
              </div>
            )}
            {plan.trainingHistory && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{labels.trainingHistory}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.trainingHistory}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {showContent && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Plano de Musculação</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="prose max-w-none">
              <FormattedPlanContent content={planContent} />
            </div>
          </div>
        </div>
      )}

      {!showContent && plan.status !== 'PAYMENT_PENDING' && (
        <div className="mt-6 flex justify-center">
          <Link
            to="/plans"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Voltar para Listagem de Planos
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default ViewStrengthPlanPage;
