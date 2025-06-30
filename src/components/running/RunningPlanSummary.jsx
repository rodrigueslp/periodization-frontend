import React from 'react';

const RunningPlanSummary = ({ formData, prevStep, nextStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const experienceLabels = {
    iniciante: 'Iniciante (0-6 meses)',
    intermediario: 'Intermediário (6 meses - 2 anos)',
    avancado: 'Avançado (2+ anos)'
  };

  const goalLabels = {
    '5k': '5K',
    '10k': '10K',
    '21k': '21K (Meia Maratona)',
    '42k': '42K (Maratona)',
    'condicionamento geral': 'Condicionamento Geral'
  };

  const localTreinoLabels = {
    rua: 'Rua',
    esteira: 'Esteira',
    pista: 'Pista',
    trilha: 'Trilha',
    variado: 'Variado'
  };

  const preferenciaTreinoLabels = {
    'manhã': 'Manhã',
    'tarde': 'Tarde',
    'noite': 'Noite'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumo do Plano de Corrida
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
              <dt className="text-sm font-medium text-gray-500">Dias Disponíveis por Semana</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.diasDisponiveis} dias</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Volume Semanal Atual</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.volumeSemanalAtual} km</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duração da Periodização</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.planDuration} semanas</dd>
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
            {formData.dataProva && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Data da Prova Alvo</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(formData.dataProva).toLocaleDateString('pt-BR')}
                </dd>
              </div>
            )}
            {formData.preferenciaTreino && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Período de Treino</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {preferenciaTreinoLabels[formData.preferenciaTreino]}
                </dd>
              </div>
            )}
            {formData.localTreino && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Local de Treino</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {localTreinoLabels[formData.localTreino]}
                </dd>
              </div>
            )}
            
            {/* Tempos e Paces */}
            {(formData.paceAtual5k || formData.paceAtual10k || formData.melhorTempo5k || formData.melhorTempo10k || formData.melhorTempo21k || formData.melhorTempo42k) && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 mb-2">Tempos e Paces</dt>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {formData.paceAtual5k && (
                    <div>
                      <dt className="text-xs text-gray-500">Pace Atual 5K</dt>
                      <dd className="text-sm text-gray-900">{formData.paceAtual5k}</dd>
                    </div>
                  )}
                  {formData.paceAtual10k && (
                    <div>
                      <dt className="text-xs text-gray-500">Pace Atual 10K</dt>
                      <dd className="text-sm text-gray-900">{formData.paceAtual10k}</dd>
                    </div>
                  )}
                  {formData.melhorTempo5k && (
                    <div>
                      <dt className="text-xs text-gray-500">Melhor Tempo 5K</dt>
                      <dd className="text-sm text-gray-900">{formData.melhorTempo5k}</dd>
                    </div>
                  )}
                  {formData.melhorTempo10k && (
                    <div>
                      <dt className="text-xs text-gray-500">Melhor Tempo 10K</dt>
                      <dd className="text-sm text-gray-900">{formData.melhorTempo10k}</dd>
                    </div>
                  )}
                  {formData.melhorTempo21k && (
                    <div>
                      <dt className="text-xs text-gray-500">Melhor Tempo 21K</dt>
                      <dd className="text-sm text-gray-900">{formData.melhorTempo21k}</dd>
                    </div>
                  )}
                  {formData.melhorTempo42k && (
                    <div>
                      <dt className="text-xs text-gray-500">Melhor Tempo 42K</dt>
                      <dd className="text-sm text-gray-900">{formData.melhorTempo42k}</dd>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.tempoObjetivo && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Tempo Objetivo</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.tempoObjetivo}</dd>
              </div>
            )}
            {formData.equipamentosDisponiveis && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Equipamentos Disponíveis</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.equipamentosDisponiveis}</dd>
              </div>
            )}
            {formData.historicoLesoes && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Histórico de Lesões</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.historicoLesoes}</dd>
              </div>
            )}
            {formData.experienciaAnterior && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Experiência Anterior</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.experienciaAnterior}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Prosseguir para Pagamento
        </button>
      </div>
    </form>
  );
};

export default RunningPlanSummary;
