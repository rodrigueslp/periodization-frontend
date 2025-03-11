import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.validateGoogleToken(credentialResponse.credential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro de login:', error);
      setError('Falha no login: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {loading ? (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md shadow-md w-full">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
          <span className="text-blue-700 font-medium">Autenticando...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log('Login Failed');
            setError('Falha no login com Google');
          }}
          useOneTap
          theme="filled_blue"
          text="signin_with"
          shape="rectangular"
          size="large"
          width="300"
          className="shadow-md hover:shadow-lg transition-shadow duration-200"
        />
      )}
      
      {error && (
        <div className="mt-3 text-sm text-center text-red-600 w-full">
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;