// src/components/periodization/FormStepper.jsx
import React, { useState } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import TrainingInfoStep from './TrainingInfoStep';
import BenchmarksStep from './BenchmarksStep';
import PlanSummary from './PlanSummary';
import PaymentStep from './PaymentStep';
import { periodizationService } from '../../services/periodization';

const FormStepper = ({ onSubmit, initialStep = 1, formData: initialFormData }) => {
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
    benchmarks: {
      backSquat: '',
      deadlift: '',
      clean: '',
      snatch: '',
      fran: '',
      grace: ''
    },
    planDuration: 4
  });

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  // Modificar o método nextStep para o caso de ir do PlanSummary para o PaymentStep
  const nextStep = async () => {
    // Se estiver indo para o passo de pagamento (step 4 -> 5)
    if (currentStep === 4) {
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
            altura: parseFloat(formData.altura),
            experiencia: formData.experiencia,
            objetivo: formData.objetivo,
            objetivoDetalhado: formData.objetivoDetalhado,
            disponibilidade: parseInt(formData.disponibilidade),
            lesoes: formData.lesoes,
            historico: formData.historico,
            benchmarks: {
              backSquat: formData.benchmarks.backSquat ? parseFloat(formData.benchmarks.backSquat) : null,
              deadlift: formData.benchmarks.deadlift ? parseFloat(formData.benchmarks.deadlift) : null,
              clean: formData.benchmarks.clean ? parseFloat(formData.benchmarks.clean) : null,
              snatch: formData.benchmarks.snatch ? parseFloat(formData.benchmarks.snatch) : null,
              fran: formData.benchmarks.fran,
              grace: formData.benchmarks.grace
            }
          },
          planDuration: formData.planDuration
        };

        // Criar plano pendente
        const response = await periodizationService.createPendingPlan(requestData);
        
        // Armazenar o planId no formData para uso no PaymentStep
        setFormData({ ...formData, planId: response.planId });
        
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
      benchmarks: {
        ...formData.benchmarks,
        backSquat: formData.benchmarks.backSquat ? parseFloat(formData.benchmarks.backSquat) : null,
        deadlift: formData.benchmarks.deadlift ? parseFloat(formData.benchmarks.deadlift) : null,
        clean: formData.benchmarks.clean ? parseFloat(formData.benchmarks.clean) : null,
        snatch: formData.benchmarks.snatch ? parseFloat(formData.benchmarks.snatch) : null
      }
    };
    
    // Passa os dados para o callback de envio
    onSubmit(processedData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        return <TrainingInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <BenchmarksStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <PlanSummary formData={formData} prevStep={prevStep} nextStep={nextStep} />;
      case 5:
        return <PaymentStep formData={formData} prevStep={initialStep === 5 ? null : prevStep} onSubmit={handleSubmit} />;
      default:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    }
  };

  // Mostrar apenas as etapas relevantes
  // Se iniciar na etapa de pagamento, só mostraremos essa etapa
  const stepsToShow = initialStep === 5 ? [5] : [1, 2, 3, 4, 5];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {stepsToShow.map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              <div className="text-xs mt-2 text-center">
                {step === 1 && 'Dados Pessoais'}
                {step === 2 && 'Informações de Treino'}
                {step === 3 && 'Benchmarks'}
                {step === 4 && 'Revisão'}
                {step === 5 && 'Pagamento'}
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

      {renderStep()}
    </div>
  );
};

export default FormStepper;
