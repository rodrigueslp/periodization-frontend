import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreatePlanPage from './pages/CreatePlanPage';
import ViewPlanPage from './pages/ViewPlanPage';
import PlansListPage from './pages/PlansListPage';
// Importe o novo componente de redirecionamento de pagamento
import PaymentRedirect from './components/payment/PaymentRedirect';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Serviços
import api from './services/api';

// Auth Guard - componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
                <CreatePlanPage />
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
            path="/view-plans" 
            element={
              <PrivateRoute>
                <PlansListPage />
              </PrivateRoute>
            } 
          />
          
          {/* Nova rota para redirecionamento de pagamento */}
          <Route 
            path="/payment-redirect" 
            element={
              <PrivateRoute>
                <PaymentRedirect />
              </PrivateRoute>
            } 
          />

          {/* Novas rotas para perfil e configurações */}
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
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
