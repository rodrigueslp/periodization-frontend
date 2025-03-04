import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreatePlanPage from './pages/CreatePlanPage';
import ViewPlanPage from './pages/ViewPlanPage';
import PlansListPage from './pages/PlansListPage';

// Auth Guard - componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
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
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
