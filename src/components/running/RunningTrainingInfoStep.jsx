import React, { useState, useEffect } from 'react';

const RunningTrainingInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  // Estado para controlar os contadores de caracteres
  const [charCounts, setCharCounts] = useState({
    tempoObjetivo: formData.tempoObjetivo ? formData.tempoObjetivo.length : 0,
    historicoLesoes: formData.historicoLesoes ? formData.historicoLesoes.length : 0,
    experienciaAnterior: formData.experienciaAnterior ? formData.experienciaAnterior.length : 0,
    equipamentosDisponiveis: formData.equipamentosDisponiveis ? formData.equipamentosDisponiveis.length : 0
  });

  // Atualiza os contadores quando o formData mudar
  useEffect(() => {
    setCharCounts({
      tempoObjetivo: formData.tempoObjetivo ? formData.tempoObjetivo.length : 0,
      historicoLesoes: formData.historicoLesoes ? formData.historicoLesoes.length : 0,
      experienciaAnterior: formData.experienciaAnterior ? formData.experienciaAnterior.length : 0,
      equipamentosDisponiveis: formData.equipamentosDisponiveis ? formData.equipamentosDisponiveis.length : 0
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limita o texto a 250 caracteres para os campos específicos
    if (['tempoObjetivo', 'historicoLesoes', 'experienciaAnterior', 'equipamentosDisponiveis'].includes(name)) {
      if (value.length <= 250) {
        updateFormData({ [name]: value });
        setCharCounts(prev => ({ ...prev, [name]: value.length }));
      }
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-6 py-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Corrida</h2>

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
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione um nível</option>
                <option value="iniciante">Iniciante (0-6 meses)</option>
                <option value="intermediario">Intermediário (6 meses - 2 anos)</option>
                <option value="avancado">Avançado (2+ anos)</option>
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
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione um objetivo</option>
                <option value="5k">5K</option>
                <option value="10k">10K</option>
                <option value="21k">21K (Meia Maratona)</option>
                <option value="42k">42K (Maratona)</option>
                <option value="condicionamento geral">Condicionamento Geral</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="diasDisponiveis" className="block text-sm font-medium text-gray-700">
              Dias Disponíveis por Semana *
            </label>
            <div className="mt-1">
              <select
                id="diasDisponiveis"
                name="diasDisponiveis"
                required
                value={formData.diasDisponiveis}
                onChange={handleChange}
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione a frequência</option>
                <option value="3">3 dias por semana</option>
                <option value="4">4 dias por semana</option>
                <option value="5">5 dias por semana</option>
                <option value="6">6 dias por semana</option>
                <option value="7">7 dias por semana</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="volumeSemanalAtual" className="block text-sm font-medium text-gray-700">
              Volume Semanal Atual (km) *
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="volumeSemanalAtual"
                id="volumeSemanalAtual"
                min="0"
                max="200"
                required
                value={formData.volumeSemanalAtual}
                onChange={handleChange}
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Quantos quilômetros você corre por semana atualmente</p>
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
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="4">4 semanas</option>
                <option value="8">8 semanas</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data de Início do Plano
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Caso não informado, a data da segunda-feira mais próxima será utilizada</p>
          </div>

          {/* Seção de Tempos e Paces */}
          <div className="sm:col-span-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tempos e Paces (Opcional)</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="paceAtual5k" className="block text-sm font-medium text-gray-700">
                  Pace Atual 5K
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="paceAtual5k"
                    id="paceAtual5k"
                    placeholder="Ex: 05:30"
                    value={formData.paceAtual5k || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="paceAtual10k" className="block text-sm font-medium text-gray-700">
                  Pace Atual 10K
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="paceAtual10k"
                    id="paceAtual10k"
                    placeholder="Ex: 05:45"
                    value={formData.paceAtual10k || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="melhorTempo5k" className="block text-sm font-medium text-gray-700">
                  Melhor Tempo 5K
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="melhorTempo5k"
                    id="melhorTempo5k"
                    placeholder="Ex: 25:30"
                    value={formData.melhorTempo5k || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="melhorTempo10k" className="block text-sm font-medium text-gray-700">
                  Melhor Tempo 10K
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="melhorTempo10k"
                    id="melhorTempo10k"
                    placeholder="Ex: 52:15"
                    value={formData.melhorTempo10k || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="melhorTempo21k" className="block text-sm font-medium text-gray-700">
                  Melhor Tempo 21K
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="melhorTempo21k"
                    id="melhorTempo21k"
                    placeholder="Ex: 1:55:30"
                    value={formData.melhorTempo21k || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="melhorTempo42k" className="block text-sm font-medium text-gray-700">
                  Melhor Tempo 42K
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="melhorTempo42k"
                    id="melhorTempo42k"
                    placeholder="Ex: 4:15:45"
                    value={formData.melhorTempo42k || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Preferências */}
          <div className="sm:col-span-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferências de Treino (Opcional)</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="preferenciaTreino" className="block text-sm font-medium text-gray-700">
                  Período de Treino
                </label>
                <div className="mt-1">
                  <select
                    id="preferenciaTreino"
                    name="preferenciaTreino"
                    value={formData.preferenciaTreino || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Selecione o período</option>
                    <option value="manhã">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="localTreino" className="block text-sm font-medium text-gray-700">
                  Local de Treino
                </label>
                <div className="mt-1">
                  <select
                    id="localTreino"
                    name="localTreino"
                    value={formData.localTreino || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Selecione o local</option>
                    <option value="rua">Rua</option>
                    <option value="esteira">Esteira</option>
                    <option value="pista">Pista</option>
                    <option value="trilha">Trilha</option>
                    <option value="variado">Variado</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="dataProva" className="block text-sm font-medium text-gray-700">
                  Data da Prova Alvo
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="dataProva"
                    id="dataProva"
                    value={formData.dataProva || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Data da prova para a qual você está se preparando</p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="tempoObjetivo" className="block text-sm font-medium text-gray-700">
              Tempo Objetivo
            </label>
            <div className="mt-1">
              <textarea
                id="tempoObjetivo"
                name="tempoObjetivo"
                rows={2}
                maxLength={250}
                value={formData.tempoObjetivo || ''}
                onChange={handleChange}
                placeholder='Ex: "Sub 20min nos 5K" ou "Terminar uma meia maratona"'
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.tempoObjetivo}/250 caracteres
            </p>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="equipamentosDisponiveis" className="block text-sm font-medium text-gray-700">
              Equipamentos Disponíveis
            </label>
            <div className="mt-1">
              <textarea
                id="equipamentosDisponiveis"
                name="equipamentosDisponiveis"
                rows={2}
                maxLength={250}
                value={formData.equipamentosDisponiveis || ''}
                onChange={handleChange}
                placeholder="GPS, monitor cardíaco, esteira, etc."
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.equipamentosDisponiveis}/250 caracteres
            </p>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="historicoLesoes" className="block text-sm font-medium text-gray-700">
              Histórico de Lesões
            </label>
            <div className="mt-1">
              <textarea
                id="historicoLesoes"
                name="historicoLesoes"
                rows={3}
                maxLength={250}
                value={formData.historicoLesoes || ''}
                onChange={handleChange}
                placeholder="Descreva qualquer lesão ou problema físico que você tenha ou já teve"
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.historicoLesoes}/250 caracteres
            </p>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="experienciaAnterior" className="block text-sm font-medium text-gray-700">
              Experiência Anterior
            </label>
            <div className="mt-1">
              <textarea
                id="experienciaAnterior"
                name="experienciaAnterior"
                rows={3}
                maxLength={250}
                value={formData.experienciaAnterior || ''}
                onChange={handleChange}
                placeholder="Descreva brevemente sua experiência anterior com corrida ou outros esportes"
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.experienciaAnterior}/250 caracteres
            </p>
          </div>
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
          Próximo
        </button>
      </div>
    </form>
  );
};

export default RunningTrainingInfoStep;
