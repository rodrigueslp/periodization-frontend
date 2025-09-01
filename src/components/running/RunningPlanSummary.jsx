import React, { useState } from 'react';

const RunningPlanSummary = ({ formData, updateFormData, nextStep, prevStep }) => {
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
      'avancado': 'Avançado (2+ anos)'
    };
    return experiences[exp] || exp;
  };

  const formatObjective = (obj) => {
    const objectives = {
      '5k': '5K',
      '10k': '10K',
      '21k': '21K (Meia Maratona)',
      '42k': '42K (Maratona)',
      'condicionamento_geral': 'Condicionamento Geral',
      'perda_peso': 'Perda de peso',
      'resistencia': 'Resistência de longa distância'
    };
    return objectives[obj] || obj;
  };

  const formatLocalTreino = (local) => {
    const locais = {
      'rua': 'Rua',
      'esteira': 'Esteira',
      'pista': 'Pista',
      'trilha': 'Trilha',
      'variado': 'Variado'
    };
    return locais[local] || local;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo do Plano</h2>

        {/* Resumo das informações */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-orange-900 mb-4">Informações Pessoais</h4>
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
              <p className="text-sm text-gray-900">{formData.diasDisponiveis} dias</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Volume atual:</span>
              <p className="text-sm text-gray-900">{formData.volumeSemanalAtual} km/semana</p>
            </div>
            {formData.localTreino && (
              <div>
                <span className="text-sm font-medium text-gray-700">Local de treino:</span>
                <p className="text-sm text-gray-900">{formatLocalTreino(formData.localTreino)}</p>
              </div>
            )}
            {formData.melhorTempo5k && (
              <div>
                <span className="text-sm font-medium text-gray-700">Melhor 5K:</span>
                <p className="text-sm text-gray-900">{formData.melhorTempo5k}</p>
              </div>
            )}
            {formData.melhorTempo10k && (
              <div>
                <span className="text-sm font-medium text-gray-700">Melhor 10K:</span>
                <p className="text-sm text-gray-900">{formData.melhorTempo10k}</p>
              </div>
            )}
            {formData.melhorTempo21k && (
              <div>
                <span className="text-sm font-medium text-gray-700">Melhor 21K:</span>
                <p className="text-sm text-gray-900">{formData.melhorTempo21k}</p>
              </div>
            )}
            {formData.melhorTempo42k && (
              <div>
                <span className="text-sm font-medium text-gray-700">Melhor 42K:</span>
                <p className="text-sm text-gray-900">{formData.melhorTempo42k}</p>
              </div>
            )}
            {formData.tempoObjetivo && (
              <div>
                <span className="text-sm font-medium text-gray-700">Tempo objetivo:</span>
                <p className="text-sm text-gray-900">{formData.tempoObjetivo}</p>
              </div>
            )}
            {formData.dataProva && (
              <div>
                <span className="text-sm font-medium text-gray-700">Data da prova:</span>
                <p className="text-sm text-gray-900">{formData.dataProva}</p>
              </div>
            )}
            {formData.paceAtual5k && (
              <div>
                <span className="text-sm font-medium text-gray-700">Pace atual 5K:</span>
                <p className="text-sm text-gray-900">{formData.paceAtual5k}</p>
              </div>
            )}
            {formData.paceAtual10k && (
              <div>
                <span className="text-sm font-medium text-gray-700">Pace atual 10K:</span>
                <p className="text-sm text-gray-900">{formData.paceAtual10k}</p>
              </div>
            )}
            {formData.preferenciaTreino && (
              <div>
                <span className="text-sm font-medium text-gray-700">Preferência:</span>
                <p className="text-sm text-gray-900">{formData.preferenciaTreino}</p>
              </div>
            )}
            {formData.equipamentosDisponiveis && (
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Equipamentos:</span>
                <p className="text-sm text-gray-900">{formData.equipamentosDisponiveis}</p>
              </div>
            )}
            {formData.historicoLesoes && (
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Histórico de lesões:</span>
                <p className="text-sm text-gray-900">{formData.historicoLesoes}</p>
              </div>
            )}
            {formData.experienciaAnterior && (
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Experiência anterior:</span>
                <p className="text-sm text-gray-900">{formData.experienciaAnterior}</p>
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
                className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
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
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Prosseguir para pagamento
          </button>
        </div>
      </div>
    </form>
  );
};

export default RunningPlanSummary;