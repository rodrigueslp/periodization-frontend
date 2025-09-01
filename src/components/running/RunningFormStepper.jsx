import React, { useState } from 'react';
import RunningPersonalInfoStep from './RunningPersonalInfoStep';
import RunningTrainingInfoStep from './RunningTrainingInfoStep';
import RunningPlanSummary from './RunningPlanSummary';
import PaymentStep from '../periodization/PaymentStep';
import { runningTrainingService } from '../../services/runningTraining';

const RunningFormStepper = ({ onSubmit, initialStep = 1, formData: initialFormData }) => {
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
    paceAtual5k: '',
    paceAtual10k: '',
    melhorTempo5k: '',
    melhorTempo10k: '',
    melhorTempo21k: '',
    melhorTempo42k: '',
    tempoObjetivo: '',
    dataProva: '',
    historicoLesoes: '',
    experienciaAnterior: '',
    preferenciaTreino: '',
    localTreino: '',
    equipamentosDisponiveis: '',
    planDuration: 4,
    startDate: '',
    planType: 'RUNNING' // Adicione essa propriedade para identificar o tipo de plano
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
            paceAtual5k: formData.paceAtual5k,
            paceAtual10k: formData.paceAtual10k,
            melhorTempo5k: formData.melhorTempo5k,
            melhorTempo10k: formData.melhorTempo10k,
            melhorTempo21k: formData.melhorTempo21k,
            melhorTempo42k: formData.melhorTempo42k,
            tempoObjetivo: formData.tempoObjetivo,
            dataProva: formData.dataProva,
            historicoLesoes: formData.historicoLesoes,
            experienciaAnterior: formData.experienciaAnterior,
            preferenciaTreino: formData.preferenciaTreino,
            localTreino: formData.localTreino,
            equipamentosDisponiveis: formData.equipamentosDisponiveis
          },
          planDuration: formData.planDuration,
          startDate: formData.startDate
        };

        // Criar plano pendente usando o serviço de corrida
        const response = await runningTrainingService.createPendingPlan(requestData);
        
        // Armazenar o planId no formData para uso no PaymentStep
        setFormData({ 
          ...formData, 
          planId: response.planId,
          planType: 'RUNNING' // Garantir que o tipo de plano está definido
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
      diasDisponiveis: parseInt(formData.diasDisponiveis),
      volumeSemanalAtual: parseInt(formData.volumeSemanalAtual),
      planType: 'RUNNING' // Garantir que o tipo de plano está definido
    };
    
    // Passa os dados para o callback de envio
    onSubmit(processedData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RunningPersonalInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        return <RunningTrainingInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <RunningPlanSummary formData={formData} prevStep={prevStep} nextStep={nextStep} />;
      case 4:
        return <PaymentStep formData={formData} prevStep={initialStep === 4 ? null : prevStep} onSubmit={handleSubmit} />;
      default:
        return <RunningPersonalInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    }
  };

  // Definir os passos com seus rótulos
  const steps = [
    { number: 1, title: 'Informações Pessoais', description: 'Dados básicos' },
    { number: 2, title: 'Informações de Treino', description: 'Experiência e objetivos' },
    { number: 3, title: 'Resumo', description: 'Confirme os dados' },
    { number: 4, title: 'Pagamento', description: 'Finalize seu plano' }
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
                      ? 'bg-orange-600 text-white'
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
            {stepsToShow.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= step.number
                      ? 'bg-orange-600 text-white'
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
        {renderStep()}
      </div>
    </div>
  );
};

export default RunningFormStepper;