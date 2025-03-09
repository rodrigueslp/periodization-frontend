import React from 'react';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import planilizeLogo from '../assets/images/planilize-logo.png';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-md w-full">
        {/* Logo */}
        {/* <div className="flex justify-center mb-8">
          <div className="w-64 h-16 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-indigo-600 tracking-tight">Planilize</span>
          </div>
        </div> */}
        <div className="flex justify-center mb-8">
          <div className="w-64 h-20 flex items-center justify-center">
            <img src={planilizeLogo} alt="Planilize" className="logo-login-page w-auto" />
          </div>
        </div>

        {/* Frase */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-10">
          Periodize seus treinos e evolua
        </h2>

        {/* Área do Botão com Sombra */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm mx-auto">
          <p className="text-gray-600 text-sm mb-6">Entre com sua conta Google para começar</p>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;