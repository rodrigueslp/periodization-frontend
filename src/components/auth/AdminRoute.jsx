import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/auth';

/**
 * Componente para proteger rotas administrativas
 * Verifica se o usuário está autenticado E possui a role ADMIN
 */
const AdminRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserData();
  const isAdmin = userData && userData.roles && userData.roles.includes('ROLE_ADMIN');
  
  if (!isAuthenticated) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    // Redirecionar para dashboard se não for admin
    return <Navigate to="/dashboard" />;
  }
  
  // Renderizar as rotas filhas se estiver autenticado e for admin
  return <Outlet />;
};

export default AdminRoute;
