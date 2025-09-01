import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BikeFormStepper from '../components/bike/BikeFormStepper';
import { bikeTrainingService } from '../services/bikeTraining';
import { paymentService } from '../services/payment';

const CreateBikePlanPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
  
    try {
      // Construir o objeto de requisição
      const requestData = {
        athleteData: {
          nome: formData.nome,
          idade: formData.idade,
          peso: formData.peso,
          altura: formData.altura,
          experiencia: formData.experiencia,
          objetivo: formData.objetivo,
          diasDisponiveis: formData.diasDisponiveis,
          volumeSemanalAtual: formData.volumeSemanalAtual,
          tipoBike: formData.tipoBike,
          ftpAtual: formData.ftpAtual,
          potenciaMediaAtual: formData.potenciaMediaAtual,
          melhorTempo40km: formData.melhorTempo40km,
          melhorTempo100km: formData.melhorTempo100km,
          melhorTempo160km: formData.melhorTempo160km,
          tempoObjetivo: formData.tempoObjetivo,
          dataProva: formData.dataProva,
          historicoLesoes: formData.historicoLesoes,
          experienciaAnterior: formData.experienciaAnterior,
          preferenciaTreino: formData.preferenciaTreino,
          equipamentosDisponiveis: formData.equipamentosDisponiveis,
          zonaTreinoPreferida: formData.zonaTreinoPreferida
        },
        planDuration: formData.planDuration,
        startDate: formData.startDate
      };

      console.log('Enviando dados para criar plano de bike:', requestData);
      
      // Passo 1: Criar plano pendente
      const planResponse = await bikeTrainingService.createPendingPlan(requestData);
      const planId = planResponse.planId;
      
      // Passo 2: Iniciar pagamento para este plano
      const paymentRequest = {
        planId: planId,
        description: "Plano de Treino de Bike",
        amount: 29.90
      };
      
      const paymentResponse = await paymentService.createPayment(paymentRequest);
      
      // Armazenar informações importantes no localStorage para recuperação
      localStorage.setItem('pendingPlan', JSON.stringify({
        planId: planId,
        externalReference: paymentResponse.externalReference,
        planType: 'BIKE'
      }));
      
      // Redirecionar para a página de pagamento
      navigate(`/payment-redirect?planId=${planId}&externalReference=${paymentResponse.externalReference}&planType=BIKE`);
    } catch (err) {
      console.error('Erro ao criar plano de bike:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao criar plano de bike');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Criar Plano de Bike</h1>
          <p className="mt-1 text-sm text-gray-600">
            Preencha as informações para gerar seu plano personalizado de treino de bike
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao criar plano
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <BikeFormStepper 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default CreateBikePlanPage;
