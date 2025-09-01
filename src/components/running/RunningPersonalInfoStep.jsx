import React, { useState } from 'react';

const RunningPersonalInfoStep = ({ formData, updateFormData, nextStep }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.idade || formData.idade < 14 || formData.idade > 80) {
      newErrors.idade = 'Idade deve estar entre 14 e 80 anos';
    }

    if (!formData.peso || formData.peso < 30 || formData.peso > 200) {
      newErrors.peso = 'Peso deve estar entre 30 e 200 kg';
    }

    if (!formData.altura || formData.altura < 100 || formData.altura > 220) {
      newErrors.altura = 'Altura deve estar entre 100 e 220 cm';
    }

    if (!formData.experiencia) {
      newErrors.experiencia = 'Nível de experiência é obrigatório';
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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h2>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Nome */}
          <div className="sm:col-span-6">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome completo *
            </label>
            <input
              type="text"
              id="nome"
              value={formData.nome || ''}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.nome ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Digite seu nome completo"
            />
            {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
          </div>

          {/* Idade */}
          <div className="sm:col-span-3">
            <label htmlFor="idade" className="block text-sm font-medium text-gray-700">
              Idade *
            </label>
            <input
              type="number"
              id="idade"
              value={formData.idade || ''}
              onChange={(e) => handleInputChange('idade', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.idade ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: 30"
              min="14"
              max="80"
            />
            {errors.idade && <p className="mt-1 text-sm text-red-600">{errors.idade}</p>}
          </div>

          {/* Peso */}
          <div className="sm:col-span-3">
            <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
              Peso (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              id="peso"
              value={formData.peso || ''}
              onChange={(e) => handleInputChange('peso', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.peso ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: 70.5"
              min="30"
              max="200"
            />
            {errors.peso && <p className="mt-1 text-sm text-red-600">{errors.peso}</p>}
          </div>

          {/* Altura */}
          <div className="sm:col-span-3">
            <label htmlFor="altura" className="block text-sm font-medium text-gray-700">
              Altura (cm) *
            </label>
            <input
              type="number"
              id="altura"
              value={formData.altura || ''}
              onChange={(e) => handleInputChange('altura', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.altura ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: 175"
              min="100"
              max="220"
            />
            {errors.altura && <p className="mt-1 text-sm text-red-600">{errors.altura}</p>}
          </div>

          {/* Nível de Experiência */}
          <div className="sm:col-span-6">
            <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700">
              Nível de experiência na corrida *
            </label>
            <select
              id="experiencia"
              value={formData.experiencia || ''}
              onChange={(e) => handleInputChange('experiencia', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.experiencia ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione seu nível</option>
              <option value="iniciante">Iniciante (0-1 ano)</option>
              <option value="intermediario">Intermediário (1-3 anos)</option>
              <option value="avancado">Avançado (3+ anos)</option>
              <option value="competitivo">Competitivo/Elite</option>
            </select>
            {errors.experiencia && <p className="mt-1 text-sm text-red-600">{errors.experiencia}</p>}
          </div>
        </div>

        {/* Botão de continuar */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Continuar
          </button>
        </div>
    </form>
  );
};

export default RunningPersonalInfoStep;
