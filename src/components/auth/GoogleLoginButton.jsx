import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Validar o token no backend
      const response = await fetch(`${API_BASE_URL}/api/auth/validate?token=` + credentialResponse.credential, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data = await response.json();
      
      // Guardar o token JWT do backend (não o token do Google)
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userInfo', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        profilePicture: data.profilePicture,
        subscriptionPlan: data.subscriptionPlan,
        hasActiveSubscription: data.hasActiveSubscription
      }));

      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro de login:', error);
      alert('Falha no login: ' + error.message);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log('Login Failed');
          alert('Falha no login com Google');
        }}
        useOneTap
        theme="filled_blue"
        text="signin_with"
        shape="pill"
        size="large"
      />
    </div>
  );
};

export default GoogleLoginButton;