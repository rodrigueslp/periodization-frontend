import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { periodizationService } from '../../services/periodization';
import { strengthTrainingService } from '../../services/strengthTraining';
import GeneratingProgress from '../../components/training/GeneratingProgress';
import { formatDateSafely } from '../../utils/dateUtils';

const PlanList = ({ plans, loading, error }) => {

  const [downloadError, setDownloadError] = useState(null);
  const [errorPlanId, setErrorPlanId] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-600">Carregando planos...</span>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum plano encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece criando seu primeiro plano de treinamento.
        </p>
        <div className="mt-6">
          <Link
            to="/create-plan"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Criar Plano
          </Link>
        </div>
      </div>
    );
  }

  // Função para obter o caminho correto com base no tipo de plano
  const getPlanViewPath = (planId, planType) => {
    return planType === 'STRENGTH' ? `/view-strength-plan/${planId}` : `/view-plan/${planId}`;
  };

  // Ordenar planos: Primeiro os que estão em geração, depois os mais recentes
  const sortedPlans = [...plans].sort((a, b) => {
    // Colocar planos em geração primeiro
    if (a.status === 'QUEUED' || a.status === 'GENERATING') {
      if (b.status !== 'QUEUED' && b.status !== 'GENERATING') {
        return -1;
      }
    } else if (b.status === 'QUEUED' || b.status === 'GENERATING') {
      return 1;
    }
    
    // Depois ordenar por data (mais recentes primeiro)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleDownloadPlan = async (planId, planType) => {
    try {
      setDownloadError(null);
      setErrorPlanId(null);
      setTooltipVisible(false);
      
      if (planType === 'STRENGTH') {
        await strengthTrainingService.downloadPlan(planId);
      } else {
        await periodizationService.downloadPlan(planId);
      }
    } catch (err) {
      console.error('Erro download Excel:', err);
      setDownloadError(err.message || 'Erro ao baixar o arquivo Excel. Por favor, tente novamente.');
      setErrorPlanId(planId);
      setTooltipVisible(true);
      
      // Esconder o tooltip após 5 segundos
      setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
  };
  

  const handleDownloadPlanPdf = async (planId, planType) => {
    try {
      setDownloadError(null);
      setErrorPlanId(null);
      setTooltipVisible(false);
      
      if (planType === 'STRENGTH') {
        await strengthTrainingService.downloadPlanPdf(planId);
      } else {
        await periodizationService.downloadPlanPdf(planId);
      }
    } catch (err) {
      console.error('Erro download PDF:', err);
      setDownloadError(err.message || 'Erro ao baixar o arquivo PDF. Por favor, tente novamente.');
      setErrorPlanId(planId);
      setTooltipVisible(true);
      
      // Esconder o tooltip após 5 segundos
      setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
  };

  // Função para gerar o badge de status
  const renderStatusBadge = (status) => {
    let bgColor, textColor, text, icon;
    
    switch (status) {
      case 'PAYMENT_PENDING':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        text = 'Aguardando Pagamento';
        icon = (
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
        break;
      case 'PAYMENT_APPROVED':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        text = 'Pagamento Aprovado';
        icon = (
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
        break;
      case 'QUEUED':
        bgColor = 'bg-indigo-100';
        textColor = 'text-indigo-800';
        text = 'Na fila';
        icon = (
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
        break;
      case 'GENERATING':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        text = 'Gerando';
        icon = (
          <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
        break;
      case 'COMPLETED':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        text = 'Concluído';
        icon = (
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
        break;
      case 'FAILED':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        text = 'Falha na Geração';
        icon = (
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        text = status || 'Desconhecido';
        icon = (
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${bgColor} ${textColor}`}>
        {icon}
        {text}
      </span>
    );
  };

  // Função para renderizar o badge de tipo de plano
  const renderTypeBadge = (planType) => {
    if (planType === 'STRENGTH') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800 ml-2">
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Musculação
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 ml-2">
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          CrossFit
        </span>
      );
    }
  };

  // Função para gerar a ação adequada com base no status
  const renderActionButton = (plan) => {
    const planType = plan.planType || 'CROSSFIT';
    const viewPath = getPlanViewPath(plan.planId, planType);
    
    switch (plan.status) {
      case 'PAYMENT_PENDING':
        return (
          <Link
            to={viewPath}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            Realizar Pagamento
          </Link>
        );
      case 'PAYMENT_APPROVED':
        return (
          <Link
            to={viewPath}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Iniciar Geração
          </Link>
        );
        case 'QUEUED':
        case 'GENERATING':
          return (
            <div className="w-full">
              <GeneratingProgress status={plan.status} compact={true} />
            </div>
          );
        case 'COMPLETED':
          return (
            <div className="relative">
              <div className="flex space-x-2">
                <Link
                  to={viewPath}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Ver Plano
                </Link>
                <div className="flex space-x-2">
                  {/* {plan.excelFilePath && (
                    <button
                      onClick={() => handleDownloadPlan(plan.planId, planType)}
                      className="text-sm text-green-600 hover:text-green-900"
                    >
                      Excel
                    </button>
                  )} */}
                  {plan.pdfFilePath && (
                    <button
                      onClick={() => handleDownloadPlanPdf(plan.planId, planType)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      PDF
                    </button>
                  )}
                </div>
              </div>
              
              {/* Tooltip para exibir mensagem de erro */}
              {tooltipVisible && errorPlanId === plan.planId && downloadError && (
                <div className="absolute z-10 -bottom-12 right-0 bg-amber-50 text-amber-700 border border-amber-200 rounded-md shadow-lg px-3 py-1 max-w-xs animate-fade-in-up">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-3 w-3 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-1.5">
                      <p className="text-xs">{downloadError}</p>
                    </div>
                    <button 
                      onClick={() => setTooltipVisible(false)}
                      className="ml-1.5 text-amber-400 hover:text-amber-600"
                    >
                      <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
      case 'FAILED':
        return (
          <Link
            to={viewPath}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            Tentar Novamente
          </Link>
        );
      default:
        return (
          <Link
            to={viewPath}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            Ver Detalhes
          </Link>
        );
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {sortedPlans.map((plan) => (
          <li key={plan.planId} className={`px-6 py-4 ${(plan.status === 'QUEUED' || plan.status === 'GENERATING') ? 'bg-indigo-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Plano para {plan.athleteName}
                  </h3>
                  {renderTypeBadge(plan.planType)}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {plan.startDate && plan.endDate ? 
                      `${formatDateSafely(plan.startDate)} a ${formatDateSafely(plan.endDate)}` : 
                      `Criado em ${formatDateSafely(plan.createdAt)}`}
                  </span>
                </div>
                <div className="mt-2">
                  {renderStatusBadge(plan.status)}
                </div>
              </div>
              <div>
                {renderActionButton(plan)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanList;
