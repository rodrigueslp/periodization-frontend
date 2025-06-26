import React, { useState } from 'react';
import StrengthPersonalInfoStep from './StrengthPersonalInfoStep';
import StrengthTrainingInfoStep from './StrengthTrainingInfoStep';
import StrengthPlanSummary from './StrengthPlanSummary';
import PaymentStep from '../periodization/PaymentStep';
import { strengthTrainingService } from '../../services/strengthTraining';

const StrengthFormStepper = ({ onSubmit, initialStep = 1, formData: initialFormData }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialFormData || {
    nome: '',
    idade: '',
    peso: '',
    altura: '',
    experiencia: '',
    objetivo: '',
    objetivoDetalhado: '',
    disponibilidade: '',
    lesoes: '',
    historico: '',
    trainingFocus: '',
    periodoTreino: '',
    equipmentAvailable: '',
    sessionsPerWeek: '',
    sessionDuration: '',
    planDuration: 4,
    startDate: '',
    planType: 'STRENGTH' // Adicione essa propriedade para identificar o tipo de plano
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
            altura: parseFloat(formData.altura.replace(".", "").replace(",", "")),
            experiencia: formData.experiencia,
            objetivo: formData.objetivo,
            objetivoDetalhado: formData.objetivoDetalhado,
            disponibilidade: parseInt(formData.disponibilidade),
            lesoes: formData.lesoes,
            historico: formData.historico,
            periodoTreino: formData.periodoTreino || null,
            trainingFocus: formData.trainingFocus,
            equipmentAvailable: formData.equipmentAvailable,
            sessionsPerWeek: parseInt(formData.sessionsPerWeek),
            sessionDuration: parseInt(formData.sessionDuration)
          },
          planDuration: formData.planDuration,
          startDate: formData.startDate
        };

        // Criar plano pendente usando o serviço de musculação
        const response = await strengthTrainingService.createPendingPlan(requestData);
        
        // Armazenar o planId no formData para uso no PaymentStep
        setFormData({ 
          ...formData, 
          planId: response.planId,
          planType: 'STRENGTH' // Garantir que o tipo de plano está definido
        });
        
        // Agora avançar para o passo de pagamento
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Erro ao criar plano pendente:", error);
        // Mostrar mensagem de erro, se necessário
      }
    } else {
      // Comportamento normal para outros passos
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Converte os valores numéricos
    const processedData = {
      ...formData,
      idade: parseInt(formData.idade),
      peso: parseFloat(formData.peso),
      altura: parseInt(formData.altura),
      disponibilidade: parseInt(formData.disponibilidade),
      sessionsPerWeek: parseInt(formData.sessionsPerWeek),
      sessionDuration: parseInt(formData.sessionDuration),
      periodoTreino: formData.periodoTreino || null,
      planType: 'STRENGTH' // Garantir que o tipo de plano está definido
    };
    
    // Passa os dados para o callback de envio
    onSubmit(processedData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StrengthPersonalInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        return <StrengthTrainingInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <StrengthPlanSummary formData={formData} prevStep={prevStep} nextStep={nextStep} />;
      case 4:
        return <PaymentStep formData={formData} prevStep={initialStep === 4 ? null : prevStep} onSubmit={handleSubmit} />;
      default:
        return <StrengthPersonalInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    }
  };

  // Definir os passos com seus rótulos
  const steps = [
    { number: 1, label: 'Dados Pessoais' },
    { number: 2, label: 'Informações de Treino' },
    { number: 3, label: 'Revisão' },
    { number: 4, label: 'Pagamento' }
  ];

  // Filtrar os passos a serem exibidos
  const stepsToShow = initialStep === 4 ? steps.filter(step => step.number === 4) : steps;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        {/* Versão para desktop do stepper */}
        <div className="hidden sm:block">
          <div className="flex justify-between items-center">
            {stepsToShow.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number}
                </div>
                <div className="text-xs mt-2 text-center">
                  {step.label}
                </div>
              </div>
            ))}
          </div>
          {stepsToShow.length > 1 && (
            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Versão móvel do stepper */}
        <div className="sm:hidden">
          <div className="flex items-center justify-around bg-gray-100 rounded-lg p-2">
            {stepsToShow.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number}
                </div>
                <span className={`text-xs text-center w-16 truncate ${
                  currentStep >= step.number ? 'text-green-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default StrengthFormStepper;
