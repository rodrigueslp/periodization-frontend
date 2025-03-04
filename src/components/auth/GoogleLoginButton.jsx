import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/validate?token=${credentialResponse.credential}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          profilePicture: data.profilePicture,
          subscriptionPlan: data.subscriptionPlan,
          hasActiveSubscription: data.hasActiveSubscription,
        })
      );

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
        shape="rectangular" // Mudança de "pill" para "rectangular"
        size="large"
        width="300" // Largura fixa para consistência
        className="shadow-md hover:shadow-lg transition-shadow duration-200"
      />
    </div>
  );
};

export default GoogleLoginButton;