import React, { useState } from 'react';

const TrainingInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.experiencia) {
      newErrors.experiencia = 'Nível de experiência é obrigatório';
    }

    if (!formData.objetivo) {
      newErrors.objetivo = 'Objetivo é obrigatório';
    }

    if (!formData.disponibilidade || formData.disponibilidade < 3 || formData.disponibilidade > 6) {
      newErrors.disponibilidade = 'Disponibilidade deve estar entre 3 e 6 dias';
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
          {/* Experiência */}
          <div className="sm:col-span-3">
            <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700">
              Nível de experiência *
            </label>
            <select
              id="experiencia"
              value={formData.experiencia || ''}
              onChange={(e) => handleInputChange('experiencia', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.experiencia ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione seu nível</option>
              <option value="iniciante">Iniciante (0-6 meses)</option>
              <option value="intermediario">Intermediário (6 meses - 2 anos)</option>
              <option value="avancado">Avançado (2+ anos)</option>
              <option value="elite">Elite/Competidor</option>
            </select>
            {errors.experiencia && <p className="mt-1 text-sm text-red-600">{errors.experiencia}</p>}
          </div>

          {/* Objetivo */}
          <div className="sm:col-span-3">
            <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700">
              Objetivo principal *
            </label>
            <select
              id="objetivo"
              value={formData.objetivo || ''}
              onChange={(e) => handleInputChange('objetivo', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.objetivo ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione seu objetivo</option>
              <option value="forca">Ganho de Força</option>
              <option value="resistencia">Resistência</option>
              <option value="potencia">Potência</option>
              <option value="emagrecimento">Emagrecimento</option>
              <option value="competicao">Preparação para Competição</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="geral">Condicionamento Geral</option>
            </select>
            {errors.objetivo && <p className="mt-1 text-sm text-red-600">{errors.objetivo}</p>}
          </div>

          {/* Disponibilidade */}
          <div className="sm:col-span-3">
            <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700">
              Dias disponíveis por semana *
            </label>
            <input
              type="number"
              id="disponibilidade"
              value={formData.disponibilidade || ''}
              onChange={(e) => handleInputChange('disponibilidade', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.disponibilidade ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: 4"
              min="3"
              max="6"
            />
            {errors.disponibilidade && <p className="mt-1 text-sm text-red-600">{errors.disponibilidade}</p>}
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="4">4 semanas</option>
              <option value="8">8 semanas</option>
            </select>
          </div>

          {/* Período de treino */}
          <div className="sm:col-span-3">
            <label htmlFor="periodoTreino" className="block text-sm font-medium text-gray-700">
              Período de treino
            </label>
            <select
              id="periodoTreino"
              value={formData.periodoTreino || ''}
              onChange={(e) => handleInputChange('periodoTreino', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione o período</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="variado">Variado</option>
            </select>
          </div>

          {/* Treino principal */}
          <div className="sm:col-span-6">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="treinoPrincipal"
                  type="checkbox"
                  checked={formData.treinoPrincipal || false}
                  onChange={(e) => handleInputChange('treinoPrincipal', e.target.checked)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="treinoPrincipal" className="font-medium text-gray-700">Treino Principal</label>
                <p className="text-gray-500">Marque esta opção se esta periodização será sua principal fonte de treino. Desmarque se ela será complementar ao treino do seu box.</p>
              </div>
            </div>
          </div>

          {/* Objetivo detalhado */}
          <div className="sm:col-span-6">
            <label htmlFor="objetivoDetalhado" className="block text-sm font-medium text-gray-700">
              Detalhe seu objetivo
            </label>
            <textarea
              id="objetivoDetalhado"
              value={formData.objetivoDetalhado || ''}
              onChange={(e) => handleInputChange('objetivoDetalhado', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder='Descreva detalhadamente seu objetivo, como "Quero aumentar minhas cargas em CLEAN and JERK". Preencha apenas se você quiser focar em algum objetivo específico.'
            />
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Ex: Barra, halteres, kettlebells, corda naval, medicine ball, anilhas, caixa pliométrica..."
            />
          </div>

          {/* Histórico de lesões */}
          <div className="sm:col-span-6">
            <label htmlFor="lesoes" className="block text-sm font-medium text-gray-700">
              Histórico de lesões
            </label>
            <textarea
              id="lesoes"
              value={formData.lesoes || ''}
              onChange={(e) => handleInputChange('lesoes', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Descreva lesões anteriores ou limitações físicas..."
            />
          </div>

          {/* Histórico de treinamento */}
          <div className="sm:col-span-6">
            <label htmlFor="historico" className="block text-sm font-medium text-gray-700">
              Histórico de treinamento
            </label>
            <textarea
              id="historico"
              value={formData.historico || ''}
              onChange={(e) => handleInputChange('historico', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Conte sobre sua experiência com CrossFit e outros esportes..."
            />
          </div>

          {/* Data de início */}
          <div className="sm:col-span-6">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data de início do treino (opcional)
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </form>
  );
};

export default TrainingInfoStep;