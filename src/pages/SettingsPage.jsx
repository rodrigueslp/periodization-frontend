import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { authService } from '../services/auth';

const SettingsPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    trainingReminders: true,
    weeklyProgress: true,
    isDarkMode: false,
    language: 'pt-BR',
    dateFormat: 'dd/MM/yyyy'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Buscar usuário do serviço de autenticação
        const userInfo = await authService.getUserInfo();
        setUserData(userInfo);
        
        // Aqui você poderia buscar as configurações do usuário de uma API
        // Por enquanto, vamos simular que recuperamos do localStorage
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Fallback para dados locais
        const localUserData = authService.getUserData();
        setUserData(localUserData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleToggleChange = (setting) => {
    setSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      // Salvar no localStorage
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      return newSettings;
    });
    
    // Mostrar notificação
    setNotification('Configurações salvas com sucesso!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => {
      const newSettings = { ...prev, [name]: value };
      // Salvar no localStorage
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      return newSettings;
    });
    
    // Mostrar notificação
    setNotification('Configurações salvas com sucesso!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // Implemente a lógica de exclusão de conta
      alert('Função de exclusão de conta será implementada no futuro.');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>

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

        {/* Configurações de Notificações */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notificações</h3>
            <p className="mt-1 text-sm text-gray-500">Gerencie suas preferências de notificação</p>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notificações por E-mail</h4>
                <p className="text-xs text-gray-500">Receba novidades e atualizações por e-mail</p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleChange('emailNotifications')}
                className={`${
                  settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Lembretes de Treino</h4>
                <p className="text-xs text-gray-500">Receba lembretes sobre seus treinos</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleChange('trainingReminders')}
                className={`${
                  settings.trainingReminders ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    settings.trainingReminders ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Relatório Semanal</h4>
                <p className="text-xs text-gray-500">Receba um resumo semanal do seu progresso</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleChange('weeklyProgress')}
                className={`${
                  settings.weeklyProgress ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    settings.weeklyProgress ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Configurações de Aparência e Preferências */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Preferências</h3>
            <p className="mt-1 text-sm text-gray-500">Personalize sua experiência</p>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Modo Escuro (Em Breve)</h4>
                <p className="text-xs text-gray-500">Ativar tema escuro para a interface</p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleChange('isDarkMode')}
                disabled={true}
                className={`opacity-50 bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-not-allowed transition-colors ease-in-out duration-200 focus:outline-none`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Idioma</label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleSelectChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US" disabled>English (US) - Em breve</option>
                  <option value="es-ES" disabled>Español - Em breve</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">Formato de Data</label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleSelectChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                  <option value="MM/dd/yyyy" disabled>MM/DD/AAAA - Em breve</option>
                  <option value="yyyy-MM-dd" disabled>AAAA-MM-DD - Em breve</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Conta e Segurança */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Conta e Segurança</h3>
            <p className="mt-1 text-sm text-gray-500">Gerencie suas informações de conta</p>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Informações da Conta</h4>
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium">{userData?.email}</span>
              </p>
              <p className="text-sm text-gray-600">
                Conta vinculada ao Google
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-red-700 mb-2">Zona de Perigo</h4>
              <button
                disabled
                type="button"
                onClick={handleDeleteAccount}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Excluir Minha Conta - Em breve
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;