import React, { useState, useEffect } from 'react';

const StrengthTrainingInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  // Estado para controlar os contadores de caracteres
  const [charCounts, setCharCounts] = useState({
    objetivoDetalhado: formData.objetivoDetalhado ? formData.objetivoDetalhado.length : 0,
    lesoes: formData.lesoes ? formData.lesoes.length : 0,
    historico: formData.historico ? formData.historico.length : 0,
    equipmentAvailable: formData.equipmentAvailable ? formData.equipmentAvailable.length : 0
  });

  // Atualiza os contadores quando o formData mudar
  useEffect(() => {
    setCharCounts({
      objetivoDetalhado: formData.objetivoDetalhado ? formData.objetivoDetalhado.length : 0,
      lesoes: formData.lesoes ? formData.lesoes.length : 0,
      historico: formData.historico ? formData.historico.length : 0,
      equipmentAvailable: formData.equipmentAvailable ? formData.equipmentAvailable.length : 0
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Para inputs do tipo checkbox, usar o valor checked
    if (type === 'checkbox') {
      updateFormData({ [name]: checked });
      return;
    }
    
    // Limita o texto a 250 caracteres para os campos específicos
    if (['objetivoDetalhado', 'lesoes', 'historico', 'equipmentAvailable'].includes(name)) {
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
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione um objetivo</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="forca">Ganho de Força</option>
                <option value="resistencia">Resistência Muscular</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="definicao">Definição Muscular</option>
                <option value="condicionamento">Condicionamento Geral</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="trainingFocus" className="block text-sm font-medium text-gray-700">
              Foco do Treino *
            </label>
            <div className="mt-1">
              <select
                id="trainingFocus"
                name="trainingFocus"
                required
                value={formData.trainingFocus}
                onChange={handleChange}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione o foco do treino</option>
                <option value="fullBody">Full Body</option>
                <option value="upperLower">Upper/Lower</option>
                <option value="pushPullLegs">Push/Pull/Legs</option>
                <option value="abcde">Divisão por Grupos (A/B/C/D/E)</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="sessionDuration" className="block text-sm font-medium text-gray-700">
              Duração por Sessão (minutos) *
            </label>
            <div className="mt-1">
              <select
                id="sessionDuration"
                name="sessionDuration"
                required
                value={formData.sessionDuration}
                onChange={handleChange}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione a duração</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
                <option value="90">90 minutos</option>
                <option value="120">120 minutos</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="sessionsPerWeek" className="block text-sm font-medium text-gray-700">
              Sessões por Semana *
            </label>
            <div className="mt-1">
              <select
                id="sessionsPerWeek"
                name="sessionsPerWeek"
                required
                value={formData.sessionsPerWeek}
                onChange={handleChange}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione a frequência</option>
                <option value="3">3 sessões por semana</option>
                <option value="4">4 sessões por semana</option>
                <option value="5">5 sessões por semana</option>
                <option value="6">6 sessões por semana</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700">
              Dias Disponíveis por Semana *
            </label>
            <div className="mt-1">
              <select
                id="disponibilidade"
                name="disponibilidade"
                required
                value={formData.disponibilidade}
                onChange={handleChange}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione a disponibilidade</option>
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
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="4">4 semanas</option>
                <option value="8">8 semanas</option>
                <option value="12">12 semanas</option>
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
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Caso não informado, a data da segunda-feira mais próxima será utilizada</p>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="periodoTreino" className="block text-sm font-medium text-gray-700">
              Período de Treino
            </label>
            <div className="mt-1">
              <select
                id="periodoTreino"
                name="periodoTreino"
                value={formData.periodoTreino || ''}
                onChange={handleChange}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Selecione o período</option>
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
                <option value="variado">Variado</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="equipmentAvailable" className="block text-sm font-medium text-gray-700">
              Equipamentos Disponíveis
            </label>
            <div className="mt-1">
              <textarea
                id="equipmentAvailable"
                name="equipmentAvailable"
                rows={3}
                maxLength={250}
                value={formData.equipmentAvailable || ''}
                onChange={handleChange}
                placeholder="Liste os equipamentos que você tem disponíveis (ex: halteres, barras, máquinas, etc.)"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.equipmentAvailable}/250 caracteres
            </p>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="objetivoDetalhado" className="block text-sm font-medium text-gray-700">
              Detalhe seu Objetivo
            </label>
            <div className="mt-1">
              <textarea
                id="objetivoDetalhado"
                name="objetivoDetalhado"
                rows={3}
                maxLength={250}
                value={formData.objetivoDetalhado || ''}
                onChange={handleChange}
                placeholder='Descreva detalhadamente seu objetivo, como "Quero aumentar o volume muscular dos braços" ou "Preciso melhorar minha definição para o verão".'
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.objetivoDetalhado}/250 caracteres
            </p>
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
                maxLength={250}
                value={formData.lesoes || ''}
                onChange={handleChange}
                placeholder="Descreva qualquer lesão ou limitação física que você tenha"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.lesoes}/250 caracteres
            </p>
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
                maxLength={250}
                value={formData.historico || ''}
                onChange={handleChange}
                placeholder="Descreva brevemente sua experiência anterior com musculação ou outros esportes"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">
              {charCounts.historico}/250 caracteres
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Próximo
        </button>
      </div>
    </form>
  );
};

export default StrengthTrainingInfoStep;
