import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlanSelectionPage from './pages/PlanSelectionPage';
import CreateCrossFitPlanPage from './pages/CreateCrossFitPlanPage';
import CreateStrengthPlanPage from './pages/CreateStrengthPlanPage';
import ViewPlanPage from './pages/ViewPlanPage';
import PlansListPage from './pages/PlansListPage';
import PaymentRedirect from './components/payment/PaymentRedirect';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ViewStrengthPlanPage from './pages/ViewStrengthPlanPage';
import CreateRunningPlanPage from './pages/CreateRunningPlanPage';
import ViewRunningPlanPage from './pages/ViewRunningPlanPage';
import CreateBikePlanPage from './pages/CreateBikePlanPage';
import ViewBikePlanPage from './pages/ViewBikePlanPage';

// Páginas administrativas
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminFeedbacksPage from './pages/admin/AdminFeedbacksPage';

// Serviços
import api from './services/api';
import { authService } from './services/auth';

// Auth Guard - componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Guard - componente para proteger rotas administrativas
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userData = authService.getUserData();
  const isAdmin = userData && userData.roles && userData.roles.includes('ROLE_ADMIN');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  // Configurar monitor de atividade quando o componente monta
  useEffect(() => {
    // Apenas configurar se o usuário estiver autenticado
    if (localStorage.getItem('isAuthenticated') === 'true') {
      let inactivityTimer;
      const inactivityTimeout = 30 * 60 * 1000; // 30 minutos
      
      const resetInactivityTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        
        inactivityTimer = setTimeout(async () => {
          // Verificar se o usuário ainda está autenticado
          if (localStorage.getItem('token')) {
            try {
              // Tentar renovar o token silenciosamente
              await api.refreshToken();
              console.log('Token renovado após período de inatividade');
            } catch (error) {
              console.error('Falha ao renovar token após inatividade:', error);
            }
          }
        }, inactivityTimeout);
      };
      
      // Eventos para monitorar atividade do usuário
      const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
      
      // Adicionar listeners para todos os eventos
      activityEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
      });
      
      // Iniciar o timer
      resetInactivityTimer();
      
      // Cleanup ao desmontar
      return () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        activityEvents.forEach(event => {
          document.removeEventListener(event, resetInactivityTimer);
        });
      };
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="861803970932-pc823jj90ajhepjolh06bpnb2atip8k9.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Navigate to="/dashboard" replace />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/create-plan" 
            element={
              <PrivateRoute>
                <PlanSelectionPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/create-crossfit-plan" 
            element={
              <PrivateRoute>
                <CreateCrossFitPlanPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/create-strength-plan" 
            element={
              <PrivateRoute>
                <CreateStrengthPlanPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/create-running-plan" 
            element={
              <PrivateRoute>
                <CreateRunningPlanPage />
              </PrivateRoute>
            }
          />

          <Route 
            path="/create-bike-plan" 
            element={
              <PrivateRoute>
                <CreateBikePlanPage />
              </PrivateRoute>
            }
          />
          
          <Route 
            path="/view-plan/:planId" 
            element={
              <PrivateRoute>
                <ViewPlanPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/view-strength-plan/:planId" 
            element={
              <PrivateRoute>
                <ViewStrengthPlanPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/view-running-plan/:planId" 
            element={
              <PrivateRoute>
                <ViewRunningPlanPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/view-bike-plan/:planId" 
            element={
              <PrivateRoute>
                <ViewBikePlanPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/view-plans" 
            element={
              <PrivateRoute>
                <PlansListPage />
              </PrivateRoute>
            } 
          />
          
          {/* Rota para redirecionamento de pagamento */}
          <Route 
            path="/payment-redirect" 
            element={
              <PrivateRoute>
                <PaymentRedirect />
              </PrivateRoute>
            } 
          />

          {/* Rotas para perfil e configurações */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            } 
          />

          {/* Rotas administrativas */}
          <Route 
            path="/admin/payments" 
            element={
              <AdminRoute>
                <AdminPaymentsPage />
              </AdminRoute>
            } 
          />

          <Route 
            path="/admin/feedbacks" 
            element={
              <AdminRoute>
                <AdminFeedbacksPage />
              </AdminRoute>
            } 
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
