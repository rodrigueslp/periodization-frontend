// src/pages/ViewPlanPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import WeeklySchedule from '../components/training/WeeklySchedule';
import FormattedPlanContent from '../components/training/FormattedPlanContent';
import { periodizationService } from '../services/periodization';

const ViewPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { planId } = useParams();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await periodizationService.getPlan(planId);
        setPlan(data);
      } catch (err) {
        console.error('Erro ao buscar plano:', err);
        setError(err.message || 'Não foi possível carregar o plano. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handleDownload = async () => {
    try {
      await periodizationService.downloadPlan(planId);
    } catch (err) {
      setError('Erro ao baixar o arquivo. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Carregando plano de periodização...</p>
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
              to="/create-plan"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Criar Novo Plano
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

  // Objeto para traduzir as chaves para português
  const labels = {
    experienceLevel: 'Nível de Experiência',
    trainingGoal: 'Objetivo',
    availability: 'Disponibilidade',
    injuries: 'Lesões',
    trainingHistory: 'Histórico de Treino',
    planDuration: 'Duração do Plano',
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
    forca: 'Ganho de Força',
    resistencia: 'Resistência',
    potencia: 'Potência',
    emagrecimento: 'Emagrecimento',
    competicao: 'Preparação para Competição',
    hipertrofia: 'Hipertrofia',
    geral: 'Condicionamento Geral'
  };

  // Verifica se há planContent antes de renderizar
  const planContent = plan.planContent || '';
  
  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Plano de Periodização para {plan.athleteName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Criado em {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Excel
            </button>
          </div>
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
              <dt className="text-sm font-medium text-gray-500">{labels.availability}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.availability} dias por semana</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{labels.planDuration}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.planDuration} semanas</dd>
            </div>
            {plan.injuries && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{labels.injuries}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.injuries}</dd>
              </div>
            )}
            {plan.trainingHistory && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{labels.trainingHistory}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plan.trainingHistory}</dd>
              </div>
            )}
            {plan.benchmarks && Object.keys(plan.benchmarks).some(key => plan.benchmarks[key]) && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Benchmarks</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="grid grid-cols-2 gap-4">
                    {plan.benchmarks.backSquat && (
                      <li>Back Squat: {plan.benchmarks.backSquat} kg</li>
                    )}
                    {plan.benchmarks.deadlift && (
                      <li>Deadlift: {plan.benchmarks.deadlift} kg</li>
                    )}
                    {plan.benchmarks.clean && (
                      <li>Clean: {plan.benchmarks.clean} kg</li>
                    )}
                    {plan.benchmarks.snatch && (
                      <li>Snatch: {plan.benchmarks.snatch} kg</li>
                    )}
                    {plan.benchmarks.fran && (
                      <li>Fran: {plan.benchmarks.fran}</li>
                    )}
                    {plan.benchmarks.grace && (
                      <li>Grace: {plan.benchmarks.grace}</li>
                    )}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plano de Treinamento</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="prose max-w-none">
            <FormattedPlanContent content={planContent} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewPlanPage;