import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = authService.getUserData();
    setUserData(user);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getActiveClass = (path) => {
    return location.pathname === path 
      ? "inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
      : "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-2xl font-extrabold text-indigo-600">
                ExtraBox
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link
                to="/dashboard"
                className={getActiveClass('/dashboard')}
              >
                Dashboard
              </Link>
              <Link
                to="/create-plan"
                className={getActiveClass('/create-plan')}
              >
                Nova Periodização
              </Link>
              <Link
                to="/view-plans"
                className={getActiveClass('/view-plans')}
              >
                Minhas Periodizações
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <span className="sr-only">Abrir menu do usuário</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-semibold">
                    {userData && userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
              </div>
              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  {userData && (
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Logado como<br/>
                      <span className="font-medium text-gray-700">{userData.email || 'Usuário'}</span>
                    </div>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Configurações
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;