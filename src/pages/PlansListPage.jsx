import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PlanList from '../components/training/PlanList';
import { periodizationService } from '../services/periodization';

const PlansListPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const location = useLocation();

  // Implementar atualização automática da lista
  useEffect(() => {
    // Verificar se há mensagem passada pela navegação
    if (location.state?.message) {
      setNotification(location.state.message);
      // Limpar a mensagem do histórico para não reaparecer ao atualizar
      window.history.replaceState({}, document.title);
    }

    // Função para buscar planos
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

    // Buscar planos imediatamente
    fetchPlans();

    // Configurar intervalo para atualizar a lista a cada 30 segundos
    // Isso permitirá ver atualizações de status sem precisar recarregar a página
    const interval = setInterval(fetchPlans, 30000);

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [location.state]);

  // Fechar notificação
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {/* Notificação */}
        {notification && (
          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">{notification}</p>
                <button 
                  onClick={closeNotification}
                  className="ml-3 text-sm text-blue-700 hover:text-blue-500"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Periodizações</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visualize todas as suas periodizações de treino
          </p>
          <p className="text-xs text-gray-500 mt-2">
            A lista é atualizada automaticamente. Os planos em geração podem levar alguns minutos para ficarem prontos.
          </p>
        </div>

        <PlanList plans={plans} loading={loading} error={error} />
      </div>
    </Layout>
  );
};

export default PlansListPage;