import React, { useState, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import planilizeLogo from '../../assets/images/planilize-logo.png';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = authService.getUserData();
    setUserData(user);
  }, []);

  // Fechar os menus quando clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Fechar o menu móvel ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getActiveClass = (path) => {
    return location.pathname === path 
      ? "inline-flex items-center border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
      : "inline-flex items-center border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700";
  };

  const getMobileActiveClass = (path) => {
    return location.pathname === path 
      ? "block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50"
      : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            {/* <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl sm:text-2xl font-extrabold text-indigo-600">
                Planilize
              </Link>
            </div> */}

            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard">
                <img src={planilizeLogo} alt="Planilize" className="h-14 w-auto" />
              </Link>
            </div>
            
            {/* Menu para desktop */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/dashboard"
                className={`${getActiveClass('/dashboard')} px-1 pt-1`}
              >
                Dashboard
              </Link>
              <Link
                to="/create-plan"
                className={`${getActiveClass('/create-plan')} px-1 pt-1`}
              >
                Nova Periodização
              </Link>
              <Link
                to="/view-plans"
                className={`${getActiveClass('/view-plans')} px-1 pt-1`}
              >
                Minhas Periodizações
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Botão de menu para mobile */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
            
            {/* Avatar do usuário e menu de perfil */}
            <div className="ml-3 relative profile-menu-container">
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
              
              {/* Menu de perfil dropdown */}
              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  {userData && (
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Logado como<br/>
                      <span className="font-medium text-gray-700 truncate block">{userData.email || 'Usuário'}</span>
                    </div>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

      {/* Menu móvel */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={getMobileActiveClass('/dashboard')}
            >
              Dashboard
            </Link>
            <Link
              to="/create-plan"
              className={getMobileActiveClass('/create-plan')}
            >
              Nova Periodização
            </Link>
            <Link
              to="/view-plans"
              className={getMobileActiveClass('/view-plans')}
            >
              Minhas Periodizações
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;