import React, { useState } from 'react';

const StrengthTrainingInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
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
              Nível de Experiência *
            </label>
            <select
              id="experiencia"
              value={formData.experiencia || ''}
              onChange={(e) => handleInputChange('experiencia', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                errors.experiencia ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione um nível</option>
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
              Objetivo Principal *
            </label>
            <select
              id="objetivo"
              value={formData.objetivo || ''}
              onChange={(e) => handleInputChange('objetivo', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                errors.objetivo ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione um objetivo</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="forca">Ganho de Força</option>
              <option value="resistencia">Resistência Muscular</option>
              <option value="emagrecimento">Emagrecimento</option>
              <option value="definicao">Definição Muscular</option>
              <option value="condicionamento">Condicionamento Geral</option>
            </select>
            {errors.objetivo && <p className="mt-1 text-sm text-red-600">{errors.objetivo}</p>}
          </div>

          {/* Foco do Treino */}
          <div className="sm:col-span-3">
            <label htmlFor="trainingFocus" className="block text-sm font-medium text-gray-700">
              Foco do Treino *
            </label>
            <select
              id="trainingFocus"
              value={formData.trainingFocus || ''}
              onChange={(e) => handleInputChange('trainingFocus', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione o foco do treino</option>
              <option value="fullBody">Full Body</option>
              <option value="upperLower">Upper/Lower</option>
              <option value="pushPullLegs">Push/Pull/Legs</option>
              <option value="abcde">Divisão por Grupos (A/B/C/D/E)</option>
            </select>
          </div>

          {/* Duração por Sessão */}
          <div className="sm:col-span-3">
            <label htmlFor="sessionDuration" className="block text-sm font-medium text-gray-700">
              Duração por Sessão (minutos) *
            </label>
            <select
              id="sessionDuration"
              value={formData.sessionDuration || ''}
              onChange={(e) => handleInputChange('sessionDuration', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione a duração</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
              <option value="90">90 minutos</option>
              <option value="120">120 minutos</option>
            </select>
          </div>

          {/* Sessões por Semana */}
          <div className="sm:col-span-3">
            <label htmlFor="sessionsPerWeek" className="block text-sm font-medium text-gray-700">
              Sessões por Semana *
            </label>
            <select
              id="sessionsPerWeek"
              value={formData.sessionsPerWeek || ''}
              onChange={(e) => handleInputChange('sessionsPerWeek', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione a frequência</option>
              <option value="3">3 sessões por semana</option>
              <option value="4">4 sessões por semana</option>
              <option value="5">5 sessões por semana</option>
              <option value="6">6 sessões por semana</option>
            </select>
          </div>

          {/* Dias Disponíveis por Semana */}
          <div className="sm:col-span-3">
            <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700">
              Dias Disponíveis por Semana *
            </label>
            <select
              id="disponibilidade"
              value={formData.disponibilidade || ''}
              onChange={(e) => handleInputChange('disponibilidade', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                errors.disponibilidade ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione a disponibilidade</option>
              <option value="3">3 dias por semana</option>
              <option value="4">4 dias por semana</option>
              <option value="5">5 dias por semana</option>
              <option value="6">6 dias por semana</option>
            </select>
            {errors.disponibilidade && <p className="mt-1 text-sm text-red-600">{errors.disponibilidade}</p>}
          </div>

          {/* Duração do Plano */}
          <div className="sm:col-span-3">
            <label htmlFor="planDuration" className="block text-sm font-medium text-gray-700">
              Duração do Plano (semanas)
            </label>
            <select
              id="planDuration"
              value={formData.planDuration || ''}
              onChange={(e) => handleInputChange('planDuration', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="4">4 semanas</option>
              <option value="8">8 semanas</option>
              <option value="12">12 semanas</option>
            </select>
          </div>

          {/* Data de Início */}
          <div className="sm:col-span-3">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data de Início do Plano
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <p className="mt-1 text-xs text-gray-500">Caso não informado, a data da segunda-feira mais próxima será utilizada</p>
          </div>

          {/* Período de Treino */}
          <div className="sm:col-span-3">
            <label htmlFor="periodoTreino" className="block text-sm font-medium text-gray-700">
              Período de Treino
            </label>
            <select
              id="periodoTreino"
              value={formData.periodoTreino || ''}
              onChange={(e) => handleInputChange('periodoTreino', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione o período</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="variado">Variado</option>
            </select>
          </div>

          {/* Equipamentos Disponíveis */}
          <div className="sm:col-span-6">
            <label htmlFor="equipmentAvailable" className="block text-sm font-medium text-gray-700">
              Equipamentos Disponíveis
            </label>
            <textarea
              id="equipmentAvailable"
              value={formData.equipmentAvailable || ''}
              onChange={(e) => handleInputChange('equipmentAvailable', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder="Liste os equipamentos que você tem disponíveis (ex: halteres, barras, máquinas, etc.)"
            />
          </div>

          {/* Objetivo Detalhado */}
          <div className="sm:col-span-6">
            <label htmlFor="objetivoDetalhado" className="block text-sm font-medium text-gray-700">
              Detalhe seu Objetivo
            </label>
            <textarea
              id="objetivoDetalhado"
              value={formData.objetivoDetalhado || ''}
              onChange={(e) => handleInputChange('objetivoDetalhado', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder='Descreva detalhadamente seu objetivo, como "Quero aumentar o volume muscular dos braços" ou "Preciso melhorar minha definição para o verão".'
            />
          </div>

          {/* Lesões ou Limitações */}
          <div className="sm:col-span-6">
            <label htmlFor="lesoes" className="block text-sm font-medium text-gray-700">
              Lesões ou Limitações
            </label>
            <textarea
              id="lesoes"
              value={formData.lesoes || ''}
              onChange={(e) => handleInputChange('lesoes', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder="Descreva qualquer lesão ou limitação física que você tenha"
            />
          </div>

          {/* Histórico de Treino */}
          <div className="sm:col-span-6">
            <label htmlFor="historico" className="block text-sm font-medium text-gray-700">
              Histórico de Treino
            </label>
            <textarea
              id="historico"
              value={formData.historico || ''}
              onChange={(e) => handleInputChange('historico', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder="Descreva brevemente sua experiência anterior com musculação ou outros esportes"
            />
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
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </form>
  );
};

export default StrengthTrainingInfoStep;