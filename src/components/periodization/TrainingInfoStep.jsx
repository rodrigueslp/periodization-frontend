import React from 'react';

const TrainingInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-6 py-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Treino</h2>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700">
              Nível de Experiência *
            </label>
            <div className="mt-1">
              <select
                id="experiencia"
                name="experiencia"
                required
                value={formData.experiencia}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione um nível</option>
                <option value="iniciante">Iniciante (0-6 meses)</option>
                <option value="intermediario">Intermediário (6 meses - 2 anos)</option>
                <option value="avancado">Avançado (2+ anos)</option>
                <option value="elite">Elite/Competidor</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700">
              Objetivo Principal *
            </label>
            <div className="mt-1">
              <select
                id="objetivo"
                name="objetivo"
                required
                value={formData.objetivo}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione um objetivo</option>
                <option value="forca">Ganho de Força</option>
                <option value="resistencia">Resistência</option>
                <option value="potencia">Potência</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="competicao">Preparação para Competição</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="geral">Condicionamento Geral</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700">
              Disponibilidade Semanal *
            </label>
            <div className="mt-1">
              <select
                id="disponibilidade"
                name="disponibilidade"
                required
                value={formData.disponibilidade}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione a frequência</option>
                <option value="3">3 dias por semana</option>
                <option value="4">4 dias por semana</option>
                <option value="5">5 dias por semana</option>
                <option value="6">6 dias por semana</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="planDuration" className="block text-sm font-medium text-gray-700">
              Duração do Plano (semanas)
            </label>
            <div className="mt-1">
              <select
                id="planDuration"
                name="planDuration"
                value={formData.planDuration}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="4">4 semanas</option>
                <option value="8">8 semanas</option>
                <option value="12">12 semanas</option>
                <option value="16">16 semanas</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="lesoes" className="block text-sm font-medium text-gray-700">
              Lesões ou Limitações
            </label>
            <div className="mt-1">
              <textarea
                id="lesoes"
                name="lesoes"
                rows={3}
                value={formData.lesoes}
                onChange={handleChange}
                placeholder="Descreva qualquer lesão ou limitação física que você tenha"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="historico" className="block text-sm font-medium text-gray-700">
              Histórico de Treino
            </label>
            <div className="mt-1">
              <textarea
                id="historico"
                name="historico"
                rows={3}
                value={formData.historico}
                onChange={handleChange}
                placeholder="Descreva brevemente sua experiência anterior com CrossFit ou outros esportes"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
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
          Próximo
        </button>
      </div>
    </form>
  );
};

export default TrainingInfoStep;