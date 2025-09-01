import React, { useState } from 'react';

const BikeTrainingInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.objetivo) {
      newErrors.objetivo = 'Objetivo é obrigatório';
    }

    if (!formData.diasDisponiveis || formData.diasDisponiveis < 3 || formData.diasDisponiveis > 7) {
      newErrors.diasDisponiveis = 'Dias disponíveis deve estar entre 3 e 7';
    }

    if (!formData.volumeSemanalAtual || formData.volumeSemanalAtual < 0 || formData.volumeSemanalAtual > 30) {
      newErrors.volumeSemanalAtual = 'Volume semanal deve estar entre 0 e 30 horas';
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
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                errors.objetivo ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione seu objetivo</option>
              <option value="condicionamento">Condicionamento geral</option>
              <option value="speed">Ciclismo de estrada/speed</option>
              <option value="mountain_bike">Mountain bike</option>
              <option value="triathlon">Triathlon</option>
              <option value="competicao">Competição/Performance</option>
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
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
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
              Volume semanal atual (horas) *
            </label>
            <input
              type="number"
              id="volumeSemanalAtual"
              value={formData.volumeSemanalAtual || ''}
              onChange={(e) => handleInputChange('volumeSemanalAtual', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                errors.volumeSemanalAtual ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: 6"
              min="0"
              max="30"
            />
            {errors.volumeSemanalAtual && <p className="mt-1 text-sm text-red-600">{errors.volumeSemanalAtual}</p>}
          </div>

          {/* Tipo de bike */}
          <div className="sm:col-span-3">
            <label htmlFor="tipoBike" className="block text-sm font-medium text-gray-700">
              Tipo de bike principal
            </label>
            <select
              id="tipoBike"
              value={formData.tipoBike || ''}
              onChange={(e) => handleInputChange('tipoBike', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Selecione o tipo</option>
              <option value="speed">Speed/Estrada</option>
              <option value="mountain_bike">Mountain bike</option>
              <option value="indoor">Indoor/Smart trainer</option>
              <option value="gravel">Gravel</option>
              <option value="hibrida">Híbrida</option>
              <option value="urbana">Urbana</option>
            </select>
          </div>

          {/* FTP atual */}
          <div className="sm:col-span-3">
            <label htmlFor="ftpAtual" className="block text-sm font-medium text-gray-700">
              FTP atual (watts)
            </label>
            <input
              type="number"
              id="ftpAtual"
              value={formData.ftpAtual || ''}
              onChange={(e) => handleInputChange('ftpAtual', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 250"
            />
            <p className="mt-1 text-xs text-gray-500">Functional Threshold Power (se souber)</p>
          </div>

          {/* Potência média atual */}
          <div className="sm:col-span-3">
            <label htmlFor="potenciaMediaAtual" className="block text-sm font-medium text-gray-700">
              Potência média atual (watts)
            </label>
            <input
              type="number"
              id="potenciaMediaAtual"
              value={formData.potenciaMediaAtual || ''}
              onChange={(e) => handleInputChange('potenciaMediaAtual', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 200"
            />
          </div>

          {/* Melhor tempo 40km */}
          <div className="sm:col-span-3">
            <label htmlFor="melhorTempo40km" className="block text-sm font-medium text-gray-700">
              Melhor tempo 40km
            </label>
            <input
              type="text"
              id="melhorTempo40km"
              value={formData.melhorTempo40km || ''}
              onChange={(e) => handleInputChange('melhorTempo40km', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 01:15:30"
            />
          </div>

          {/* Melhor tempo 100km */}
          <div className="sm:col-span-3">
            <label htmlFor="melhorTempo100km" className="block text-sm font-medium text-gray-700">
              Melhor tempo 100km
            </label>
            <input
              type="text"
              id="melhorTempo100km"
              value={formData.melhorTempo100km || ''}
              onChange={(e) => handleInputChange('melhorTempo100km', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 03:30:00"
            />
          </div>

          {/* Melhor tempo 160km */}
          <div className="sm:col-span-3">
            <label htmlFor="melhorTempo160km" className="block text-sm font-medium text-gray-700">
              Melhor tempo 160km
            </label>
            <input
              type="text"
              id="melhorTempo160km"
              value={formData.melhorTempo160km || ''}
              onChange={(e) => handleInputChange('melhorTempo160km', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 05:45:00"
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: Sub 1h nos 40km"
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Selecione</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="misto">Misto</option>
            </select>
          </div>

          {/* Zona de treino preferida */}
          <div className="sm:col-span-3">
            <label htmlFor="zonaTreinoPreferida" className="block text-sm font-medium text-gray-700">
              Zona de treino preferida
            </label>
            <select
              id="zonaTreinoPreferida"
              value={formData.zonaTreinoPreferida || ''}
              onChange={(e) => handleInputChange('zonaTreinoPreferida', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Selecione</option>
              <option value="resistencia">Resistência</option>
              <option value="forca">Força</option>
              <option value="velocidade">Velocidade</option>
              <option value="hiit">HIIT</option>
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              rows="3"
              placeholder="Ex: Smart trainer, power meter, monitor cardíaco, bike computer..."
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              rows="3"
              placeholder="Conte sobre sua experiência no ciclismo, provas participadas, outros esportes..."
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
              name="startDate"
              value={formData.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </form>
  );
};

export default BikeTrainingInfoStep;
