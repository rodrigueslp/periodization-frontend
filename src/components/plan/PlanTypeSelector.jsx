import React from 'react';
import { Link } from 'react-router-dom';
import { PersonSimpleRun, Barbell, PersonSimple } from "phosphor-react";

const PlanTypeSelector = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Escolha o tipo de plano
        </h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-indigo-500 hover:border-indigo-600 transition-colors">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <PersonSimple size={24} color="#6366F1" weight="duotone" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">CrossFit</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Plano de periodização para CrossFit com treinos específicos e WODs.</p>
                  </div>
                  <div className="mt-3">
                    <Link
                      to="/create-crossfit-plan"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Criar plano de CrossFit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-green-500 hover:border-green-600 transition-colors">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Barbell size={24} color="#22C55E" weight="duotone" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Musculação</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Plano de treino para musculação com foco em hipertrofia, força ou definição.</p>
                  </div>
                  <div className="mt-3">
                    <Link
                      to="/create-strength-plan"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Criar plano de Musculação
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-orange-500 hover:border-orange-600 transition-colors">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                  <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                    <PersonSimpleRun size={24} color="#EA580C" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Corrida</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Plano de corrida com progressão personalizada por nível, objetivo e disponibilidade.</p>
                  </div>
                  <div className="mt-3">
                    <Link
                      to="/create-running-plan"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                    >
                      Criar plano de Corrida
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlanTypeSelector;
