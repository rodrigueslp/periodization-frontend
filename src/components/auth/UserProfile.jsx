import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Tentar carregar do localStorage primeiro
        const localUserData = authService.getUserData();
        
        if (localUserData) {
          setUserData(localUserData);
          setLoading(false);
        }
        
        // Buscar dados atualizados do servidor
        const response = await authService.getUserInfo();
        setUserData(response);
        
        // Atualizar localStorage
        localStorage.setItem('userInfo', JSON.stringify(response));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  if (!userData) {
    return <div className="text-center py-4 text-red-500">Erro ao carregar perfil</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        {userData.profilePicture ? (
          <img 
            src={userData.profilePicture} 
            alt={userData.fullName} 
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            {userData.fullName?.charAt(0) || 'U'}
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">{userData.fullName}</h3>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-500">Plano atual:</span>
            <span className="ml-2 text-sm font-semibold">
              {userData.subscriptionPlan || "Gratuito"}
            </span>
          </div>
          
          <div>
            {userData.hasActiveSubscription ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
            ) : (
              <button
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {/* Implementar lógica para upgrade */}}
              >
                Fazer upgrade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;