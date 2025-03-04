import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PlanList from '../components/training/PlanList';
import { periodizationService } from '../services/periodization';

const PlansListPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await periodizationService.getAllPlans();
        setPlans(data);
      } catch (err) {
        console.error('Erro ao buscar periodizações:', err);
        setError(err.message || 'Não foi possível carregar as periodizações. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Periodizações</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visualize todas as suas periodizações de treino
          </p>
        </div>

        <PlanList plans={plans} loading={loading} error={error} />
      </div>
    </Layout>
  );
};

export default PlansListPage;