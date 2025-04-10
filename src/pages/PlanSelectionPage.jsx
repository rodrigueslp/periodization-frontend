import React from 'react';
import Layout from '../components/layout/Layout';
import PlanTypeSelector from '../components/plan/PlanTypeSelector';

const PlanSelectionPage = () => {
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Plano</h1>
          <p className="mt-1 text-sm text-gray-600">
            Escolha o tipo de plano que deseja criar
          </p>
        </div>

        <PlanTypeSelector />
      </div>
    </Layout>
  );
};

export default PlanSelectionPage;