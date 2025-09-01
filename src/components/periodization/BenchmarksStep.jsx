import React from 'react';

const BenchmarksStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      benchmarks: {
        ...formData.benchmarks,
        [name]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Benchmarks (Opcional)</h2>
        <p className="mb-4 text-sm text-gray-600">
          Informar seus benchmarks ajuda a personalizar melhor seu plano de treinamento. 
          Preencha os que você souber.
        </p>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="backSquat" className="block text-sm font-medium text-gray-700">
              Back Squat 1RM (kg)
            </label>
            <input
              type="number"
              step="0.5"
              name="backSquat"
              id="backSquat"
              value={formData.benchmarks.backSquat || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 100"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="deadlift" className="block text-sm font-medium text-gray-700">
              Deadlift 1RM (kg)
            </label>
            <input
              type="number"
              step="0.5"
              name="deadlift"
              id="deadlift"
              value={formData.benchmarks.deadlift || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 120"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="clean" className="block text-sm font-medium text-gray-700">
              Clean 1RM (kg)
            </label>
            <input
              type="number"
              step="0.5"
              name="clean"
              id="clean"
              value={formData.benchmarks.clean || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 80"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="snatch" className="block text-sm font-medium text-gray-700">
              Snatch 1RM (kg)
            </label>
            <input
              type="number"
              step="0.5"
              name="snatch"
              id="snatch"
              value={formData.benchmarks.snatch || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 60"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="fran" className="block text-sm font-medium text-gray-700">
              Fran (tempo)
            </label>
            <input
              type="text"
              name="fran"
              id="fran"
              value={formData.benchmarks.fran || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 3:45"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="grace" className="block text-sm font-medium text-gray-700">
              Grace (tempo)
            </label>
            <input
              type="text"
              name="grace"
              id="grace"
              value={formData.benchmarks.grace || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 2:30"
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
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </form>
  );
};

export default BenchmarksStep;