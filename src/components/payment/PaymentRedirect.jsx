import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import RunningFormStepper from '../running/RunningFormStepper';
import StrengthFormStepper from '../strenght/StrengthFormStepper';
import FormStepper from '../periodization/FormStepper';
import { periodizationService } from '../../services/periodization';
import { strengthTrainingService } from '../../services/strengthTraining';
import { runningTrainingService } from '../../services/runningTraining';

const PaymentRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        // Obter o planId dos parâmetros de estado ou localStorage
        const planId = location.state?.planId || 
                     JSON.parse(localStorage.getItem('pendingPlan') || '{}').planId;
        
        if (!planId) {
          throw new Error('ID do plano não encontrado');
        }

        // Primeiro, tentar encontrar o plano nos diferentes serviços
        let plan = null;
        let planType = null;

        // Tentar buscar como plano de CrossFit
        try {
          plan = await periodizationService.getPlan(planId);
          planType = 'CROSSFIT';
        } catch (e) {
          // Se não for CrossFit, tentar buscar como plano de musculação
          try {
            plan = await strengthTrainingService.getPlan(planId);
            planType = 'STRENGTH';
          } catch (e2) {
            // Se não for musculação, tentar buscar como plano de corrida
            try {
              plan = await runningTrainingService.getPlan(planId);
              planType = 'RUNNING';
            } catch (e3) {
              throw new Error('Plano não encontrado em nenhum serviço');
            }
          }
        }

        if (!plan) {
          throw new Error('Plano não encontrado');
        }

        // Verificar se o plano precisa de pagamento
        if (plan.status !== 'PAYMENT_PENDING') {
          // Se o pagamento já foi processado, redirecionar para a visualização do plano
          const viewPath = planType === 'STRENGTH' 
            ? `/view-strength-plan/${planId}` 
            : planType === 'RUNNING'
            ? `/view-running-plan/${planId}`
            : `/view-plan/${planId}`;
          navigate(viewPath);
          return;
        }

        // Converter os dados do plano para o formato do formulário
        const formData = convertPlanToFormData(plan, planType);
        formData.planId = planId;
        formData.planType = planType;

        setPlanData(formData);
      } catch (err) {
        console.error('Erro ao buscar dados do plano:', err);
        setError(err.message || 'Erro ao carregar dados do plano');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [location.state, navigate]);

  const convertPlanToFormData = (plan, planType) => {
    if (planType === 'RUNNING') {
      return {
        nome: plan.athleteName,
        idade: plan.athleteAge,
        peso: plan.athleteWeight,
        altura: plan.athleteHeight,
        experiencia: plan.experienceLevel,
        objetivo: plan.trainingGoal,
        diasDisponiveis: plan.diasDisponiveis,
        volumeSemanalAtual: plan.volumeSemanalAtual,
        paceAtual5k: plan.paceAtual5k || '',
        paceAtual10k: plan.paceAtual10k || '',
        melhorTempo5k: plan.melhorTempo5k || '',
        melhorTempo10k: plan.melhorTempo10k || '',
        melhorTempo21k: plan.melhorTempo21k || '',
        melhorTempo42k: plan.melhorTempo42k || '',
        tempoObjetivo: plan.tempoObjetivo || '',
        dataProva: plan.dataProva || '',
        historicoLesoes: plan.historicoLesoes || '',
        experienciaAnterior: plan.experienciaAnterior || '',
        preferenciaTreino: plan.preferenciaTreino || '',
        localTreino: plan.localTreino || '',
        equipamentosDisponiveis: plan.equipamentosDisponiveis || '',
        planDuration: plan.planDuration,
        startDate: plan.startDate || ''
      };
    } else if (planType === 'STRENGTH') {
      return {
        nome: plan.athleteName,
        idade: plan.athleteAge,
        peso: plan.athleteWeight,
        altura: plan.athleteHeight,
        experiencia: plan.experienceLevel,
        objetivo: plan.trainingGoal,
        disponibilidade: plan.availability,
        lesoes: plan.injuries || '',
        historico: plan.trainingHistory || '',
        objetivoDetalhado: plan.detailedGoal || '',
        trainingFocus: plan.trainingFocus,
        equipmentAvailable: plan.equipmentAvailable || '',
        sessionsPerWeek: plan.sessionsPerWeek,
        sessionDuration: plan.sessionDuration,
        planDuration: plan.planDuration,
        startDate: plan.startDate || ''
      };
    } else {
      // CrossFit
      return {
        nome: plan.athleteName,
        idade: plan.athleteAge,
        peso: plan.athleteWeight,
        altura: plan.athleteHeight,
        experiencia: plan.experienceLevel,
        objetivo: plan.trainingGoal,
        disponibilidade: plan.availability,
        lesoes: plan.injuries || '',
        historico: plan.trainingHistory || '',
        objetivoDetalhado: plan.detailedGoal || '',
        planDuration: plan.planDuration,
        startDate: plan.startDate || ''
      };
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // O pagamento será processado no componente FormStepper
      // Após o pagamento bem-sucedido, navegar para a visualização do plano
      const viewPath = formData.planType === 'STRENGTH' 
        ? `/view-strength-plan/${formData.planId}` 
        : formData.planType === 'RUNNING'
        ? `/view-running-plan/${formData.planId}`
        : `/view-plan/${formData.planId}`;
      navigate(viewPath);
    } catch (error) {
      console.error('Erro no processo de pagamento:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Carregando dados do plano...</p>
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

  if (!planData) {
    return (
      <Layout>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <p className="text-gray-500">Dados do plano não encontrados</p>
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
            Complete o pagamento para gerar seu plano de treinamento personalizado
          </p>
        </div>

        {planData.planType === 'RUNNING' && (
          <RunningFormStepper 
            initialStep={4} 
            formData={planData} 
            onSubmit={handleSubmit} 
          />
        )}
        
        {planData.planType === 'STRENGTH' && (
          <StrengthFormStepper 
            initialStep={4} 
            formData={planData} 
            onSubmit={handleSubmit} 
          />
        )}
        
        {planData.planType === 'CROSSFIT' && (
          <FormStepper 
            initialStep={4} 
            formData={planData} 
            onSubmit={handleSubmit} 
          />
        )}
      </div>
    </Layout>
  );
};

export default PaymentRedirect;
