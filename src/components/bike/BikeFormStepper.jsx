import React, { useState } from 'react';
import BikePersonalInfoStep from './BikePersonalInfoStep';
import BikeTrainingInfoStep from './BikeTrainingInfoStep';
import BikePlanSummary from './BikePlanSummary';
import PaymentStep from '../periodization/PaymentStep';
import { bikeTrainingService } from '../../services/bikeTraining';

const BikeFormStepper = ({ onSubmit, initialStep = 1, formData: initialFormData }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialFormData || {
    nome: '',
    idade: '',
    peso: '',
    altura: '',
    experiencia: '',
    objetivo: '',
    diasDisponiveis: '',
    volumeSemanalAtual: '',
    tipoBike: '',
    ftpAtual: '',
    potenciaMediaAtual: '',
    melhorTempo40km: '',
    melhorTempo100km: '',
    melhorTempo160km: '',
    tempoObjetivo: '',
    dataProva: '',
    historicoLesoes: '',
    experienciaAnterior: '',
    preferenciaTreino: '',
    equipamentosDisponiveis: '',
    zonaTreinoPreferida: '',
    planDuration: 4,
    startDate: '',
    planType: 'BIKE'
  });

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const nextStep = async () => {
    // Se estiver indo para o passo de pagamento (step 3 -> 4)
    if (currentStep === 3) {
      try {
        // Se já temos um planId, não precisamos criar um novo plano pendente
        if (formData.planId) {
          setCurrentStep(currentStep + 1);
          return;
        }
        
        // Construir o objeto de requisição
        const requestData = {
          athleteData: {
            nome: formData.nome,
            idade: parseInt(formData.idade),
            peso: parseFloat(formData.peso),
            altura: parseInt(formData.altura),
            experiencia: formData.experiencia,
            objetivo: formData.objetivo,
            diasDisponiveis: parseInt(formData.diasDisponiveis),
            volumeSemanalAtual: parseInt(formData.volumeSemanalAtual),
            tipoBike: formData.tipoBike,
            ftpAtual: formData.ftpAtual ? parseInt(formData.ftpAtual) : null,
            potenciaMediaAtual: formData.potenciaMediaAtual ? parseInt(formData.potenciaMediaAtual) : null,
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

        console.log('Criando plano pendente de bike:', requestData);
        
        // Criar plano pendente de pagamento
        const response = await bikeTrainingService.createPendingPlan(requestData);
        console.log('Resposta da criação do plano:', response);
        
        if (response.planId) {
          // Salvar o planId no formData
          updateFormData({ planId: response.planId });
        }
        
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error('Erro ao criar plano pendente:', error);
        alert('Erro ao criar plano: ' + (error.response?.data?.message || error.message));
        return; // Não avança o step em caso de erro
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = (data) => {
    updateFormData(data);
    onSubmit({ ...formData, ...data });
  };

  const steps = [
    { number: 1, title: 'Informações Pessoais', description: 'Dados básicos' },
    { number: 2, title: 'Informações de Treino', description: 'Experiência e objetivos' },
    { number: 3, title: 'Resumo', description: 'Confirme os dados' },
    { number: 4, title: 'Pagamento', description: 'Finalize seu plano' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        {/* Versão para desktop do stepper */}
        <div className="hidden sm:block">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number}
                </div>
                <div className="text-xs mt-2 text-center">
                  {step.title}
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
        </div>
        
        {/* Versão móvel do stepper */}
        <div className="sm:hidden">
          <div className="flex items-center justify-around bg-gray-100 rounded-lg p-2">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= step.number
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number}
                </div>
                <div className="text-xs text-center">
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {currentStep === 1 && (
          <BikePersonalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <BikeTrainingInfoStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <BikePlanSummary
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        
        {currentStep === 4 && (
          <PaymentStep
            formData={formData}
            onSubmit={handleFormSubmit}
            prevStep={prevStep}
          />
        )}
      </div>
    </div>
  );
};

export default BikeFormStepper;
