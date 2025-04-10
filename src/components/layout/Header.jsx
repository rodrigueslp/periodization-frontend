import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import planilizeLogo from '../../assets/images/planilize-logo.png';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = authService.getUserData();
    setUserData(user);
    
    // Verificar se o usuário tem role de ADMIN
    if (user && user.roles) {
      setIsAdmin(user.roles.includes('ROLE_ADMIN'));
    }
  }, []);

  // Fechar os menus quando clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
      if (isAdminMenuOpen && !event.target.closest('.admin-menu-container')) {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, isAdminMenuOpen]);

  // Fechar o menu móvel ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAdminMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getActiveClass = (path) => {
    if (location.pathname.startsWith(path) && path !== '/') {
      return "inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900";
    }
    return "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700";
  };

  const isActiveAdmin = () => {
    return location.pathname.startsWith('/admin/') 
      ? "inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
      : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700";
  };

  const getMobileActiveClass = (path) => {
    return location.pathname === path 
      ? "block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50"
      : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800";
  };

  const getMobileActiveAdminClass = () => {
    return location.pathname.startsWith('/admin/') 
      ? "block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50"
      : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard">
                <img src={planilizeLogo} alt="Planilize" className="h-14 w-auto" />
              </Link>
            </div>
            
            {/* Menu para desktop */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8 items-center">
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
                Novo Plano
              </Link>
              <Link
                to="/view-plans"
                className={getActiveClass('/view-plans')}
              >
                Meus Planos
              </Link>
              
              {/* Menu administrativo - apenas para admins */}
              {isAdmin && (
                <div className="relative admin-menu-container">
                  <button
                    className={`${isActiveAdmin()} flex items-center focus:outline-none`}
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    aria-expanded={isAdminMenuOpen}
                  >
                    Admin
                    <svg className={`ml-1 h-4 w-4 transition-transform ${isAdminMenuOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isAdminMenuOpen && (
                    <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <Link 
                        to="/admin/payments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Gerenciar Pagamentos
                      </Link>
                      <Link 
                        to="/admin/feedbacks"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Feedbacks dos Usuários
                      </Link>
                    </div>
                  )}
                </div>
              )}
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
                  {userData && userData.profilePicture ? (
                    <img 
                      className="h-8 w-8 rounded-full object-cover"
                      src={userData.profilePicture}
                      alt={userData.name || 'Usuário'}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-semibold">
                      {userData && userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
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
              Novo Plano
            </Link>
            <Link
              to="/view-plans"
              className={getMobileActiveClass('/view-plans')}
            >
              Meus Planos
            </Link>
            
            {/* Links administrativos para mobile - apenas para admins */}
            {isAdmin && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-3 py-1 text-xs font-medium text-gray-500">
                  ADMINISTRAÇÃO
                </div>
                
                {/* Opção para expandir o menu de admin no mobile */}
                <button 
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className={`${getMobileActiveAdminClass()} w-full text-left flex justify-between items-center`}
                >
                  <span>Admin</span>
                  <svg 
                    className={`h-5 w-5 transform transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isAdminMenuOpen && (
                  <div className="pl-4">
                    <Link
                      to="/admin/payments"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    >
                      Gerenciar Pagamentos
                    </Link>
                    <Link
                      to="/admin/feedbacks"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    >
                      Feedbacks dos Usuários
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
