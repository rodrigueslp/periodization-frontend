import React from 'react';

const PersonalInfoStep = ({ formData, updateFormData, nextStep }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-6 py-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h2>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome Completo *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="nome"
                id="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="idade" className="block text-sm font-medium text-gray-700">
              Idade *
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="idade"
                id="idade"
                min="14"
                max="80"
                required
                value={formData.idade}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
              Peso (kg) *
            </label>
            <div className="mt-1">
              <input
                type="number"
                step="0.1"
                name="peso"
                id="peso"
                min="30"
                max="200"
                required
                value={formData.peso}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="altura" className="block text-sm font-medium text-gray-700">
              Altura (cm) *
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="altura"
                id="altura"
                min="100"
                max="220"
                required
                value={formData.altura}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Próximo
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoStep;