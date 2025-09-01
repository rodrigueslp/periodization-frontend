import React, { useState } from 'react';

const BikePlanSummary = ({ formData, updateFormData, nextStep, prevStep }) => {
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
      'iniciante': 'Iniciante (0-1 ano)',
      'intermediario': 'Intermediário (1-3 anos)',
      'avancado': 'Avançado (3+ anos)',
      'competitivo': 'Competitivo/Elite'
    };
    return experiences[exp] || exp;
  };

  const formatObjective = (obj) => {
    const objectives = {
      'condicionamento': 'Condicionamento geral',
      'speed': 'Ciclismo de estrada/speed',
      'mountain_bike': 'Mountain bike',
      'triathlon': 'Triathlon',
      'competicao': 'Competição/Performance',
      'perda_peso': 'Perda de peso',
      'resistencia': 'Resistência de longa distância'
    };
    return objectives[obj] || obj;
  };

  const formatBikeType = (type) => {
    const types = {
      'speed': 'Speed/Estrada',
      'mountain_bike': 'Mountain bike',
      'indoor': 'Indoor/Smart trainer',
      'gravel': 'Gravel',
      'hibrida': 'Híbrida',
      'urbana': 'Urbana'
    };
    return types[type] || type;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo do Plano</h2>

        {/* Resumo das informações */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-purple-900 mb-4">Informações Pessoais</h4>
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
              <p className="text-sm text-gray-900">{formData.volumeSemanalAtual} horas/semana</p>
            </div>
            {formData.tipoBike && (
              <div>
                <span className="text-sm font-medium text-gray-700">Tipo de bike:</span>
                <p className="text-sm text-gray-900">{formatBikeType(formData.tipoBike)}</p>
              </div>
            )}
            {formData.ftpAtual && (
              <div>
                <span className="text-sm font-medium text-gray-700">FTP:</span>
                <p className="text-sm text-gray-900">{formData.ftpAtual}W</p>
              </div>
            )}
            {formData.potenciaMediaAtual && (
              <div>
                <span className="text-sm font-medium text-gray-700">Potência média:</span>
                <p className="text-sm text-gray-900">{formData.potenciaMediaAtual}W</p>
              </div>
            )}
            {formData.melhorTempo40km && (
              <div>
                <span className="text-sm font-medium text-gray-700">Melhor 40km:</span>
                <p className="text-sm text-gray-900">{formData.melhorTempo40km}</p>
              </div>
            )}
            {formData.melhorTempo100km && (
              <div>
                <span className="text-sm font-medium text-gray-700">Melhor 100km:</span>
                <p className="text-sm text-gray-900">{formData.melhorTempo100km}</p>
              </div>
            )}
            {formData.tempoObjetivo && (
              <div>
                <span className="text-sm font-medium text-gray-700">Objetivo:</span>
                <p className="text-sm text-gray-900">{formData.tempoObjetivo}</p>
              </div>
            )}
            {formData.dataProva && (
              <div>
                <span className="text-sm font-medium text-gray-700">Data da prova:</span>
                <p className="text-sm text-gray-900">{formData.dataProva}</p>
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
                className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
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
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Prosseguir para pagamento
          </button>
        </div>
      </div>
    </form>
  );
};

export default BikePlanSummary;
