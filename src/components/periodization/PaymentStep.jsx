import React, { useState, useEffect } from 'react';
import { periodizationService } from '../../services/periodization';
import { paymentService } from '../../services/payment';
import { useNavigate } from 'react-router-dom';

const PaymentStep = ({ formData, prevStep, onSubmit }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [externalReference, setExternalReference] = useState('');
  const [timer, setTimer] = useState(900); // 15 minutos em segundos
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const simulatePaymentApproval = async () => {
    if (!externalReference) {
      setError('Não há referência de pagamento para aprovar');
      return;
    }
    
    try {
      setPaymentStatus('processing');
      
      // Usando o serviço de pagamento para simular a aprovação
      await paymentService.simulatePaymentApproval(externalReference);
      
      setPaymentStatus('success');
    } catch (error) {
      console.error('Erro ao simular aprovação:', error);
      setPaymentStatus('failed');
      setError('Falha ao simular aprovação. Tente novamente.');
    }
  };
  
  useEffect(() => {
    // Gerar pagamento ao carregar o componente
    // Em PaymentStep.jsx - modificar o método generatePayment
    const generatePayment = async () => {
      try {
        setPaymentStatus('processing');
        
        // Verificar se temos um planId
        if (!formData.planId) {
          throw new Error('ID do plano não encontrado');
        }
        
        // Chamada para o backend para criar o pagamento
        const response = await paymentService.createPayment({
          planId: formData.planId,
          description: "Plano de Periodização CrossFit",
          amount: 9.90
        });
        
        setPaymentData(response);
        setExternalReference(response.externalReference);
        setPaymentStatus('pending');
        
        // Iniciar timer para expiração
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 15);
        const timeRemaining = Math.floor((expirationTime.getTime() - new Date().getTime()) / 1000);
        setTimer(timeRemaining > 0 ? timeRemaining : 900);
        
      } catch (error) {
        console.error('Erro ao gerar pagamento:', error);
        setError('Não foi possível gerar o pagamento. Por favor, tente novamente.');
        setPaymentStatus('failed');
      }
    };
    
    generatePayment();
    
    // Iniciar timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    // Limpar intervalo no unmount
    return () => clearInterval(interval);
  }, [formData.planId]);
  
  // Formatar o timer para MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Verificar status do pagamento
  const checkPaymentStatus = async () => {
    if (!externalReference) {
      setError('Referência de pagamento não encontrada.');
      return;
    }
    
    setPaymentStatus('processing');
    
    try {
      const response = await paymentService.checkPaymentStatus(externalReference);
      
      if (response.status === 'approved') {
        setPaymentStatus('success');
      } else if (response.status === 'pending') {
        setPaymentStatus('pending');
        setError('Pagamento ainda não foi confirmado. Aguarde alguns instantes e tente novamente.');
      } else {
        setPaymentStatus('failed');
        setError('Não foi possível confirmar o pagamento.');
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      setPaymentStatus('failed');
      setError('Ocorreu um erro ao verificar o pagamento. Por favor, tente novamente.');
    }
  };
  
  // Função para redirecionar para URL de pagamento (se não for PIX)
  const redirectToPayment = () => {
    if (paymentData && paymentData.paymentUrl) {
      window.open(paymentData.paymentUrl, '_blank');
    }
  };
  
  const handleCopyPixCode = () => {
    if (paymentData && paymentData.pixCopiaECola) {
      navigator.clipboard.writeText(paymentData.pixCopiaECola);
      alert('Código PIX copiado para a área de transferência!');
    }
  };
  
  const handleContinue = async () => {
    try {
      setPaymentStatus('generating');
      
      // Gerar o plano após o pagamento aprovado
      const response = await periodizationService.generateApprovedPlan(formData.planId);

      // Log para debug
      console.log("Plano gerado com sucesso:", response);

      // Redirecionar diretamente para a página do plano
      navigate(`/view-plan/${formData.planId}`);
      
      // Chamar o callback de conclusão
      // onSubmit();
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      setError('Ocorreu um erro ao gerar o plano. Você pode tentar gerar novamente posteriormente.');
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-6 py-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pagamento</h2>
        
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Para gerar seu plano de periodização, realize o pagamento de:
          </p>
          <div className="text-3xl font-bold text-indigo-600 mb-4">R$ 9,90</div>
        </div>
        
        {(paymentStatus === 'pending' && paymentData) && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pague com PIX</h3>
            
            <div className="flex flex-col items-center mb-6">
              {paymentData.qrCodeBase64 && (
                <div className="border-2 border-indigo-500 p-3 rounded-lg mb-3">
                  <img 
                    src={`data:image/png;base64,${paymentData.qrCodeBase64}`} 
                    alt="QR Code PIX" 
                    className="h-52 w-52 object-contain"
                  />
                </div>
              )}
              
              {paymentData.pixCopiaECola && (
                <>
                  <div className="border-2 border-indigo-500 p-3 rounded-lg mb-3 w-full max-w-md">
                    <div className="bg-white p-2 rounded">
                      <div className="font-mono text-sm text-center p-2 bg-gray-100 rounded break-all">
                        {paymentData.pixCopiaECola}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPixCode}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                    Copiar código
                  </button>
                </>
              )}
              
              {paymentData.paymentUrl && (
                <button
                  type="button"
                  onClick={redirectToPayment}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Pagar com Cartão de Crédito
                </button>
              )}
            </div>
            
            <div className="rounded-md bg-blue-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Abra o app do seu banco, selecione PIX e escaneie o código ou cole o código de pagamento.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bloco de simulação de pagamento */}
            <div className="rounded-md bg-yellow-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Modo de teste</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Este QR code é para fins de teste. Para simular um pagamento aprovado, clique no botão abaixo:</p>
                    <button
                      type="button"
                      onClick={simulatePaymentApproval}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-yellow-300 shadow-sm text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                    >
                      Simular pagamento aprovado
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">
                O código expira em: <span className="font-medium">{formatTime(timer)}</span>
              </p>
              <p className="text-xs text-gray-500">
                Após realizar o pagamento, clique no botão abaixo para verificar
              </p>
              <button
                type="button"
                onClick={checkPaymentStatus}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Verifiquei o pagamento
              </button>
            </div>
          </div>
        )}
        
        {paymentStatus === 'processing' && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processando pagamento...</h3>
            <p className="text-sm text-gray-600">Estamos processando seu pagamento. Isso pode levar alguns instantes.</p>
          </div>
        )}

        {paymentStatus === 'generating' && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gerando sua periodização...</h3>
            <p className="text-sm text-gray-600">Estamos criando seu plano personalizado. Isso pode levar alguns minutos.</p>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div className="bg-green-50 p-6 rounded-lg mb-6 text-center">
            <div className="rounded-full bg-green-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pagamento confirmado!</h3>
            <p className="text-sm text-gray-600 mb-4">Você já pode gerar seu plano de periodização personalizado.</p>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Gerar minha periodização
            </button>
          </div>
        )}
        
        {paymentStatus === 'failed' && (
          <div className="bg-red-50 p-6 rounded-lg mb-6 text-center">
            <div className="rounded-full bg-red-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Falha no pagamento</h3>
            <p className="text-sm text-gray-600 mb-4">{error || 'Não foi possível confirmar seu pagamento. Por favor, tente novamente.'}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
  
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={paymentStatus === 'processing'}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Voltar
        </button>
      </div>
    </div>
  );

};

export default PaymentStep;