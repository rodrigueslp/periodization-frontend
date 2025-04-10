import React from 'react';

const StrengthPlanSummary = ({ formData, prevStep, nextStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const experienceLabels = {
    iniciante: 'Iniciante (0-6 meses)',
    intermediario: 'Intermediário (6 meses - 2 anos)',
    avancado: 'Avançado (2+ anos)',
    elite: 'Elite/Competidor'
  };

  const goalLabels = {
    hipertrofia: 'Hipertrofia',
    forca: 'Ganho de Força',
    resistencia: 'Resistência Muscular',
    emagrecimento: 'Emagrecimento',
    definicao: 'Definição Muscular',
    condicionamento: 'Condicionamento Geral'
  };

  const trainingFocusLabels = {
    fullBody: 'Full Body',
    upperLower: 'Upper/Lower',
    pushPullLegs: 'Push/Pull/Legs',
    abcde: 'Divisão por Grupos (A/B/C/D/E)'
  };

  const periodoTreinoLabels = {
    manha: 'Manhã',
    tarde: 'Tarde',
    noite: 'Noite',
    variado: 'Variado'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumo do Plano de Musculação
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Verifique as informações antes de prosseguir para o pagamento.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Idade</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.idade} anos</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Peso</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.peso} kg</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Altura</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.altura} cm</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nível de Experiência</dt>
              <dd className="mt-1 text-sm text-gray-900">{experienceLabels[formData.experiencia]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Objetivo Principal</dt>
              <dd className="mt-1 text-sm text-gray-900">{goalLabels[formData.objetivo]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Foco do Treino</dt>
              <dd className="mt-1 text-sm text-gray-900">{trainingFocusLabels[formData.trainingFocus]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Sessões por Semana</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.sessionsPerWeek} sessões</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duração por Sessão</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.sessionDuration} minutos</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Disponibilidade Semanal</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.disponibilidade} dias por semana</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Período de Treino</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.periodoTreino ? periodoTreinoLabels[formData.periodoTreino] : 'Não informado'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.startDate ? new Date(formData.startDate).toLocaleDateString('pt-BR') : 'Data atual'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Término Estimada</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.startDate ? 
                  new Date(new Date(formData.startDate).setDate(
                    new Date(formData.startDate).getDate() + formData.planDuration * 7
                  )).toLocaleDateString('pt-BR') : 
                  new Date(new Date().setDate(
                    new Date().getDate() + formData.planDuration * 7
                  )).toLocaleDateString('pt-BR')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duração da Periodização</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.planDuration} semanas</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Equipamentos Disponíveis</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.equipmentAvailable || 'Nenhum informado'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Objetivo Detalhado</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.objetivoDetalhado || 'Nenhum informado'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Lesões ou Limitações</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.lesoes || 'Nenhuma informada'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Histórico de Treino</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.historico || 'Nenhum informado'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Prosseguir para Pagamento
        </button>
      </div>
    </form>
  );
};

export default StrengthPlanSummary;
