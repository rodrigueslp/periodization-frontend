// import React, { useState } from 'react';
// import LoginForm from '../components/auth/LoginForm';
// import GoogleLoginButton from '../components/auth/GoogleLoginButton';

// const LoginPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="w-64 h-16 flex items-center justify-center">
//             <span className="text-4xl font-extrabold text-indigo-600">Planilize</span>
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Entre na sua conta
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Personalize seus treinos de CrossFit
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <LoginForm />
          
//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Ou continue com</span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <GoogleLoginButton />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

import React from 'react';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-64 h-16 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-indigo-600 tracking-tight">Planilize</span>
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