import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { authService } from '../services/auth';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Tentar buscar informações atualizadas do usuário do backend
        const userInfo = await authService.getUserInfo();
        setUserData(userInfo);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        // Fallback para dados locais se o servidor não estiver disponível
        const localUserData = authService.getUserData();
        setUserData(localUserData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h1>

        {notification && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{notification}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cabeçalho do perfil */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  {userData?.profilePicture ? (
                    <img 
                      className="mx-auto h-20 w-20 rounded-full" 
                      src={userData.profilePicture} 
                      alt={userData.name || 'Usuário'} 
                    />
                  ) : (
                    <div className="mx-auto h-20 w-20 rounded-full bg-indigo-200 flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-xl">
                        {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 text-center sm:text-left">
                  <p className="text-xl font-bold text-gray-900">{userData?.name || 'Usuário'}</p>
                  <p className="text-sm font-medium text-gray-600">{userData?.email}</p>
                  {userData?.lastLogin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Último acesso: {new Date(userData.lastLogin).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-0 flex justify-center">
                {userData?.hasActiveSubscription ? (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="-ml-1 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                      Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Plano Gratuito
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas do usuário */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Estatísticas da Conta</h3>
          </div>
          <div className="px-6 py-5">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Planos</dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600">-</dd>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Data de Cadastro</dt>
                  <dd className="mt-1 text-md font-semibold text-gray-900">
                    {userData?.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </dd>
                </div>
              </div>
              {/* <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {userData?.hasActiveSubscription ? 'Assinatura Válida Até' : 'Status da Assinatura'}
                  </dt>
                  <dd className="mt-1 text-md font-semibold text-gray-900">
                    {userData?.hasActiveSubscription && userData?.subscriptionExpiry
                      ? new Date(userData.subscriptionExpiry).toLocaleDateString('pt-BR')
                      : 'Sem assinatura ativa'}
                  </dd>
                </div>
              </div> */}
            </dl>
          </div>
        </div>

        {/* Informações da assinatura */}
        {/* <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Plano de Assinatura</h3>
          </div>

          {userData?.hasActiveSubscription ? (
            <div className="p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Plano {userData.subscriptionPlan || 'Pro'} - Ativo
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Acesso a todas as funcionalidades de periodização de treinos.
                  </p>
                  {userData?.subscriptionExpiry && (
                    <p className="mt-1 text-sm text-gray-600">
                      Válido até: {new Date(userData.subscriptionExpiry).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <div className="mt-3 sm:mt-0">
                  <a 
                    href="#" 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Gerenciar Assinatura
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Plano Gratuito</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Assine para ter acesso a todos os recursos da plataforma.
                  </p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <a 
                    href="#" 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Assinar Agora
                  </a>
                </div>
              </div>
            </div>
          )}
        </div> */}
      </div>
    </Layout>
  );
};

export default ProfilePage;