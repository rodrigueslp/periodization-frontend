import React from 'react';

const PlanSummary = ({ formData, prevStep, nextStep }) => {
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
    forca: 'Ganho de Força',
    resistencia: 'Resistência',
    potencia: 'Potência',
    emagrecimento: 'Emagrecimento',
    competicao: 'Preparação para Competição',
    hipertrofia: 'Hipertrofia',
    geral: 'Condicionamento Geral'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumo da Periodização
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
              <dt className="text-sm font-medium text-gray-500">Disponibilidade Semanal</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.disponibilidade} dias por semana</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duração da Periodização</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.planDuration} semanas</dd>
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
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 mb-2">Benchmarks</dt>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <dt className="text-xs text-gray-500">Back Squat 1RM</dt>
                  <dd className="text-sm text-gray-900">{formData.benchmarks.backSquat ? `${formData.benchmarks.backSquat} kg` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Deadlift 1RM</dt>
                  <dd className="text-sm text-gray-900">{formData.benchmarks.deadlift ? `${formData.benchmarks.deadlift} kg` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Clean 1RM</dt>
                  <dd className="text-sm text-gray-900">{formData.benchmarks.clean ? `${formData.benchmarks.clean} kg` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Snatch 1RM</dt>
                  <dd className="text-sm text-gray-900">{formData.benchmarks.snatch ? `${formData.benchmarks.snatch} kg` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Fran</dt>
                  <dd className="text-sm text-gray-900">{formData.benchmarks.fran || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Grace</dt>
                  <dd className="text-sm text-gray-900">{formData.benchmarks.grace || '-'}</dd>
                </div>
              </div>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Prosseguir para Pagamento
        </button>
      </div>
    </form>
  );
};

export default PlanSummary;