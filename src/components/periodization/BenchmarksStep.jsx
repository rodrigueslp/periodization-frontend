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
      <div className="bg-white shadow px-6 py-6 rounded-lg">
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
            <div className="mt-1">
              <input
                type="number"
                step="0.5"
                name="backSquat"
                id="backSquat"
                value={formData.benchmarks.backSquat}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="deadlift" className="block text-sm font-medium text-gray-700">
              Deadlift 1RM (kg)
            </label>
            <div className="mt-1">
              <input
                type="number"
                step="0.5"
                name="deadlift"
                id="deadlift"
                value={formData.benchmarks.deadlift}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="clean" className="block text-sm font-medium text-gray-700">
              Clean 1RM (kg)
            </label>
            <div className="mt-1">
              <input
                type="number"
                step="0.5"
                name="clean"
                id="clean"
                value={formData.benchmarks.clean}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="snatch" className="block text-sm font-medium text-gray-700">
              Snatch 1RM (kg)
            </label>
            <div className="mt-1">
              <input
                type="number"
                step="0.5"
                name="snatch"
                id="snatch"
                value={formData.benchmarks.snatch}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="fran" className="block text-sm font-medium text-gray-700">
              Fran (tempo)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="fran"
                id="fran"
                placeholder="ex: 3:45"
                value={formData.benchmarks.fran}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="grace" className="block text-sm font-medium text-gray-700">
              Grace (tempo)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="grace"
                id="grace"
                placeholder="ex: 2:30"
                value={formData.benchmarks.grace}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Revisar
        </button>
      </div>
    </form>
  );
};

export default BenchmarksStep;