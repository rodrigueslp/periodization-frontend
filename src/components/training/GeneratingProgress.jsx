// src/components/training/GeneratingProgress.jsx
import React, { useState, useEffect, useLayoutEffect } from 'react';

const GeneratingProgress = ({ status, compact = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Define as etapas do processo de geração
  const steps = [
    { name: 'Coletando parâmetros', description: 'Analisando suas informações' },
    { name: 'Estruturando periodização', description: 'Criando blocos de treino' },
    { name: 'Ajustando cargas', description: 'Calculando volume e intensidade' },
    { name: 'Montando planilha', description: 'Finalizando seu plano' },
  ];

  // Detecta se está em tela móvel
  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    // Verificar tamanho inicial da tela
    checkMobile();
    
    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);
    
    // Cleanup do listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Reseta quando o status não é de geração
    if (status !== 'QUEUED' && status !== 'GENERATING') {
      setCurrentStep(0);
      setProgressValue(0);
      return;
    }
    
    // Certifique-se de que currentStep não exceda o índice máximo do array steps
    if (currentStep >= steps.length) {
      setCurrentStep(steps.length - 1);
    }
    
    // Configura animação de progresso
    let stepDuration = 12000 / steps.length; // 12 segundos total dividido pelo número de etapas
    let increment = 100 / (steps.length * 10); // Incrementos menores para animação mais suave
    let timer;
    
    // Anima o progresso
    timer = setInterval(() => {
      setProgressValue(prev => {
        const newValue = prev + increment;
        
        // Avança para a próxima etapa quando atingir o limiar
        if (newValue >= (currentStep + 1) * (100 / steps.length)) {
          if (currentStep < steps.length - 1) {
            setCurrentStep(prevStep => prevStep + 1);
          }
        }
        
        // Limita o valor máximo a 95% para manter a impressão de processamento
        return Math.min(newValue, 95);
      });
    }, stepDuration / 10);
    
    return () => clearInterval(timer);
  }, [status, currentStep, steps.length]);

  // Se não estiver gerando, não renderiza nada
  if (status !== 'QUEUED' && status !== 'GENERATING') {
    return null;
  }

  // Versão compacta para dispositivos móveis ou quando solicitado explicitamente
  if (isMobile || compact) {
    // Garantir que não acessamos um índice fora do array
    const safeCurrentStep = Math.min(currentStep, steps.length - 1);
    const currentStepData = steps[safeCurrentStep] || steps[0];
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 my-2">
        <div className="flex items-center mb-2">
          <div className="mr-2">
            <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h4 className="font-medium text-sm text-indigo-700 truncate">
            {status === 'QUEUED' ? 'Na fila...' : 'Gerando plano...'}
          </h4>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div 
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
        
        {/* Etapa atual simplificada */}
        <div className="flex items-center">
          <div className="h-3.5 w-3.5 rounded-full bg-indigo-600 animate-pulse flex items-center justify-center mr-2"></div>
          <p className="text-xs font-medium text-gray-700 truncate">{currentStepData.name}</p>
        </div>
      </div>
    );
  }

  // Versão original (completa) para desktop
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 my-4">
      <div className="flex items-center mb-2">
        <div className="mr-3">
          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h4 className="font-medium text-indigo-700">
          {status === 'QUEUED' ? 'Na fila de processamento...' : 'Gerando seu plano de periodização'}
        </h4>
      </div>
      
      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressValue}%` }}
        ></div>
      </div>
      
      {/* Etapas do processo */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 ${
              index < currentStep 
                ? 'bg-indigo-600' 
                : index === currentStep 
                  ? 'bg-indigo-600 animate-pulse' 
                  : 'bg-gray-200'
            }`}>
              {index < currentStep && (
                <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.name}
              </p>
              <p className={`text-xs ${
                index <= currentStep ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 italic">
        A geração completa pode levar alguns minutos. Você pode navegar pelo sistema enquanto isso.
      </p>
    </div>
  );
};

export default GeneratingProgress;