import React, { useState } from 'react';

const StrengthPlanSummary = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.planDuration || formData.planDuration < 1 || formData.planDuration > 52) {
      newErrors.planDuration = 'Duração deve estar entre 1 e 52 semanas';
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

  const formatExperience = (exp) => {
    const experiences = {
      'iniciante': 'Iniciante (0-6 meses)',
      'intermediario': 'Intermediário (6 meses - 2 anos)',
      'avancado': 'Avançado (2+ anos)',
      'elite': 'Elite/Competidor'
    };
    return experiences[exp] || exp;
  };

  const formatObjective = (obj) => {
    const objectives = {
      'hipertrofia': 'Hipertrofia',
      'forca': 'Ganho de Força',
      'resistencia': 'Resistência Muscular',
      'potencia': 'Potência',
      'emagrecimento': 'Emagrecimento',
      'definicao': 'Definição Muscular',
      'condicionamento': 'Condicionamento Geral'
    };
    return objectives[obj] || obj;
  };

  const formatTrainingFocus = (focus) => {
    const focuses = {
      'fullBody': 'Full Body',
      'upperLower': 'Upper/Lower',
      'pushPullLegs': 'Push/Pull/Legs',
      'abcde': 'Divisão por Grupos (A/B/C/D/E)'
    };
    return focuses[focus] || focus;
  };

  const formatPeriodo = (periodo) => {
    const periodos = {
      'manha': 'Manhã',
      'tarde': 'Tarde',
      'noite': 'Noite',
      'variado': 'Variado'
    };
    return periodos[periodo] || periodo;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo do Plano</h2>

        {/* Resumo das informações */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-green-900 mb-4">Informações Pessoais</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Nome:</span>
              <p className="text-sm text-gray-900">{formData.nome}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Idade:</span>
              <p className="text-sm text-gray-900">{formData.idade} anos</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Peso:</span>
              <p className="text-sm text-gray-900">{formData.peso} kg</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Altura:</span>
              <p className="text-sm text-gray-900">{formData.altura} cm</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Experiência:</span>
              <p className="text-sm text-gray-900">{formatExperience(formData.experiencia)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Informações de Treino</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Objetivo:</span>
              <p className="text-sm text-gray-900">{formatObjective(formData.objetivo)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Dias por semana:</span>
              <p className="text-sm text-gray-900">{formData.disponibilidade} dias</p>
            </div>
            {formData.trainingFocus && (
              <div>
                <span className="text-sm font-medium text-gray-700">Foco do treino:</span>
                <p className="text-sm text-gray-900">{formatTrainingFocus(formData.trainingFocus)}</p>
              </div>
            )}
            {formData.sessionDuration && (
              <div>
                <span className="text-sm font-medium text-gray-700">Duração por sessão:</span>
                <p className="text-sm text-gray-900">{formData.sessionDuration} minutos</p>
              </div>
            )}
            {formData.sessionsPerWeek && (
              <div>
                <span className="text-sm font-medium text-gray-700">Sessões por semana:</span>
                <p className="text-sm text-gray-900">{formData.sessionsPerWeek} sessões</p>
              </div>
            )}
            {formData.periodoTreino && (
              <div>
                <span className="text-sm font-medium text-gray-700">Período:</span>
                <p className="text-sm text-gray-900">{formatPeriodo(formData.periodoTreino)}</p>
              </div>
            )}
            {formData.equipmentAvailable && (
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Equipamentos:</span>
                <p className="text-sm text-gray-900">{formData.equipmentAvailable}</p>
              </div>
            )}
            {formData.objetivoDetalhado && (
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Objetivo detalhado:</span>
                <p className="text-sm text-gray-900">{formData.objetivoDetalhado}</p>
              </div>
            )}
            {formData.lesoes && (
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Lesões/Limitações:</span>
                <p className="text-sm text-gray-900">{formData.lesoes}</p>
              </div>
            )}
            {formData.historico && (
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Histórico:</span>
                <p className="text-sm text-gray-900">{formData.historico}</p>
              </div>
            )}
          </div>
        </div>

        {/* Configurações do plano */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Configurações do Plano</h4>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Duração do plano */}
            <div>
              <label htmlFor="planDuration" className="block text-sm font-medium text-gray-700">
                Duração do plano (semanas) *
              </label>
              <input
                type="number"
                id="planDuration"
                value={formData.planDuration || ''}
                onChange={(e) => handleInputChange('planDuration', parseInt(e.target.value))}
                className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  errors.planDuration ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: 8"
                min="1"
                max="52"
              />
              {errors.planDuration && <p className="mt-1 text-sm text-red-600">{errors.planDuration}</p>}
            </div>
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
            Prosseguir para pagamento
          </button>
        </div>
      </div>
    </form>
  );
};

export default StrengthPlanSummary;