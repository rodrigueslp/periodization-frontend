import React, { useState } from 'react';

const RunningTrainingInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.objetivo) {
      newErrors.objetivo = 'Objetivo é obrigatório';
    }

    if (!formData.diasDisponiveis || formData.diasDisponiveis < 3 || formData.diasDisponiveis > 7) {
      newErrors.diasDisponiveis = 'Dias disponíveis deve estar entre 3 e 7';
    }

    if (!formData.volumeSemanalAtual || formData.volumeSemanalAtual < 0 || formData.volumeSemanalAtual > 200) {
      newErrors.volumeSemanalAtual = 'Volume semanal deve estar entre 0 e 200 km';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
    // Limpar erro quando o campo for corrigido
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Treino</h2>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Objetivo */}
          <div className="sm:col-span-6">
            <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700">
              Objetivo principal *
            </label>
            <select
              id="objetivo"
              value={formData.objetivo || ''}
              onChange={(e) => handleInputChange('objetivo', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.objetivo ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione seu objetivo</option>
              <option value="5k">5K</option>
              <option value="10k">10K</option>
              <option value="21k">21K (Meia Maratona)</option>
              <option value="42k">42K (Maratona)</option>
              <option value="condicionamento_geral">Condicionamento Geral</option>
              <option value="perda_peso">Perda de peso</option>
              <option value="resistencia">Resistência de longa distância</option>
            </select>
            {errors.objetivo && <p className="mt-1 text-sm text-red-600">{errors.objetivo}</p>}
          </div>

          {/* Dias disponíveis */}
          <div className="sm:col-span-3">
            <label htmlFor="diasDisponiveis" className="block text-sm font-medium text-gray-700">
              Dias disponíveis por semana *
            </label>
            <input
              type="number"
              id="diasDisponiveis"
              value={formData.diasDisponiveis || ''}
              onChange={(e) => handleInputChange('diasDisponiveis', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.diasDisponiveis ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: 4"
              min="3"
              max="7"
            />
            {errors.diasDisponiveis && <p className="mt-1 text-sm text-red-600">{errors.diasDisponiveis}</p>}
          </div>

          {/* Volume semanal atual */}
          <div className="sm:col-span-3">
            <label htmlFor="volumeSemanalAtual" className="block text-sm font-medium text-gray-700">
              Volume semanal atual (km) *
            </label>
            <input
              type="number"
              id="volumeSemanalAtual"
              value={formData.volumeSemanalAtual || ''}
              onChange={(e) => handleInputChange('volumeSemanalAtual', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.volumeSemanalAtual ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: 20"
              min="0"
              max="200"
            />
            {errors.volumeSemanalAtual && <p className="mt-1 text-sm text-red-600">{errors.volumeSemanalAtual}</p>}
          </div>

          {/* Experiência (movido para cá) */}
          <div className="sm:col-span-3">
            <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700">
              Nível de experiência na corrida
            </label>
            <select
              id="experiencia"
              value={formData.experiencia || ''}
              onChange={(e) => handleInputChange('experiencia', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Selecione seu nível</option>
              <option value="iniciante">Iniciante (0-6 meses)</option>
              <option value="intermediario">Intermediário (6 meses - 2 anos)</option>
              <option value="avancado">Avançado (2+ anos)</option>
            </select>
          </div>

          {/* Melhor tempo 5k */}
          <div className="sm:col-span-3">
            <label htmlFor="melhorTempo5k" className="block text-sm font-medium text-gray-700">
              Melhor tempo 5K
            </label>
            <input
              type="text"
              id="melhorTempo5k"
              value={formData.melhorTempo5k || ''}
              onChange={(e) => handleInputChange('melhorTempo5k', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 25:30"
            />
          </div>

          {/* Melhor tempo 10k */}
          <div className="sm:col-span-3">
            <label htmlFor="melhorTempo10k" className="block text-sm font-medium text-gray-700">
              Melhor tempo 10K
            </label>
            <input
              type="text"
              id="melhorTempo10k"
              value={formData.melhorTempo10k || ''}
              onChange={(e) => handleInputChange('melhorTempo10k', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 52:15"
            />
          </div>

          {/* Tempo objetivo */}
          <div className="sm:col-span-3">
            <label htmlFor="tempoObjetivo" className="block text-sm font-medium text-gray-700">
              Tempo objetivo
            </label>
            <input
              type="text"
              id="tempoObjetivo"
              value={formData.tempoObjetivo || ''}
              onChange={(e) => handleInputChange('tempoObjetivo', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: Sub 20min nos 5K"
            />
          </div>

          {/* Data da prova */}
          <div className="sm:col-span-3">
            <label htmlFor="dataProva" className="block text-sm font-medium text-gray-700">
              Data da prova alvo
            </label>
            <input
              type="text"
              id="dataProva"
              value={formData.dataProva || ''}
              onChange={(e) => handleInputChange('dataProva', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: Maio 2024"
            />
          </div>

          {/* Preferência de treino */}
          <div className="sm:col-span-3">
            <label htmlFor="preferenciaTreino" className="block text-sm font-medium text-gray-700">
              Preferência de treino
            </label>
            <select
              id="preferenciaTreino"
              value={formData.preferenciaTreino || ''}
              onChange={(e) => handleInputChange('preferenciaTreino', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Selecione</option>
              <option value="manhã">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
          </div>

          {/* Local de treino */}
          <div className="sm:col-span-3">
            <label htmlFor="localTreino" className="block text-sm font-medium text-gray-700">
              Local de treino
            </label>
            <select
              id="localTreino"
              value={formData.localTreino || ''}
              onChange={(e) => handleInputChange('localTreino', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Selecione</option>
              <option value="rua">Rua</option>
              <option value="esteira">Esteira</option>
              <option value="pista">Pista</option>
              <option value="trilha">Trilha</option>
              <option value="variado">Variado</option>
            </select>
          </div>

          {/* Equipamentos disponíveis */}
          <div className="sm:col-span-6">
            <label htmlFor="equipamentosDisponiveis" className="block text-sm font-medium text-gray-700">
              Equipamentos disponíveis
            </label>
            <textarea
              id="equipamentosDisponiveis"
              value={formData.equipamentosDisponiveis || ''}
              onChange={(e) => handleInputChange('equipamentosDisponiveis', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              rows="3"
              placeholder="Ex: GPS, monitor cardíaco, esteira, etc."
            />
          </div>

          {/* Histórico de lesões */}
          <div className="sm:col-span-6">
            <label htmlFor="historicoLesoes" className="block text-sm font-medium text-gray-700">
              Histórico de lesões
            </label>
            <textarea
              id="historicoLesoes"
              value={formData.historicoLesoes || ''}
              onChange={(e) => handleInputChange('historicoLesoes', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              rows="3"
              placeholder="Descreva lesões anteriores ou atuais..."
            />
          </div>

          {/* Experiência anterior */}
          <div className="sm:col-span-6">
            <label htmlFor="experienciaAnterior" className="block text-sm font-medium text-gray-700">
              Experiência anterior
            </label>
            <textarea
              id="experienciaAnterior"
              value={formData.experienciaAnterior || ''}
              onChange={(e) => handleInputChange('experienciaAnterior', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              rows="3"
              placeholder="Conte sobre sua experiência na corrida, provas participadas, outros esportes..."
            />
          </div>

          {/* Melhor tempo 21k */}
          <div className="sm:col-span-3">
            <label htmlFor="melhorTempo21k" className="block text-sm font-medium text-gray-700">
              Melhor tempo 21K
            </label>
            <input
              type="text"
              id="melhorTempo21k"
              value={formData.melhorTempo21k || ''}
              onChange={(e) => handleInputChange('melhorTempo21k', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 1:55:30"
            />
          </div>

          {/* Melhor tempo 42k */}
          <div className="sm:col-span-3">
            <label htmlFor="melhorTempo42k" className="block text-sm font-medium text-gray-700">
              Melhor tempo 42K
            </label>
            <input
              type="text"
              id="melhorTempo42k"
              value={formData.melhorTempo42k || ''}
              onChange={(e) => handleInputChange('melhorTempo42k', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 4:15:45"
            />
          </div>

          {/* Pace atual 5k */}
          <div className="sm:col-span-3">
            <label htmlFor="paceAtual5k" className="block text-sm font-medium text-gray-700">
              Pace atual 5K
            </label>
            <input
              type="text"
              id="paceAtual5k"
              value={formData.paceAtual5k || ''}
              onChange={(e) => handleInputChange('paceAtual5k', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 05:30"
            />
          </div>

          {/* Pace atual 10k */}
          <div className="sm:col-span-3">
            <label htmlFor="paceAtual10k" className="block text-sm font-medium text-gray-700">
              Pace atual 10K
            </label>
            <input
              type="text"
              id="paceAtual10k"
              value={formData.paceAtual10k || ''}
              onChange={(e) => handleInputChange('paceAtual10k', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 05:45"
            />
          </div>

          {/* Duração do plano */}
          <div className="sm:col-span-3">
            <label htmlFor="planDuration" className="block text-sm font-medium text-gray-700">
              Duração do plano (semanas)
            </label>
            <select
              id="planDuration"
              value={formData.planDuration || ''}
              onChange={(e) => handleInputChange('planDuration', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="4">4 semanas</option>
              <option value="8">8 semanas</option>
            </select>
          </div>

          {/* Data de início */}
          <div className="sm:col-span-3">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data de início do treino (opcional)
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Se não informado, o plano começará na próxima segunda-feira
            </p>
          </div>


        </div>

        {/* Botões */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </form>
  );
};

export default RunningTrainingInfoStep;
