// src/components/ui/MiniProgress.jsx
import React, { useState, useEffect, useLayoutEffect } from 'react';

const MiniProgress = ({ className = '', text = 'Processando...' }) => {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detecta se está em tela móvel
  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        // Anima entre 0 e 95%, depois volta para 0
        if (prev >= 95) {
          return 0;
        }
        return prev + 2;
      });
    }, 150);
    
    return () => clearInterval(timer);
  }, []);
  
  if (isMobile) {
    return (
      <div className={`inline-flex items-center text-white text-xs ${className}`}>
        <svg className="animate-spin mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="mr-1.5">{text}</span>
      </div>
    );
  }
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div className="relative w-16 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-white transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MiniProgress;
