import React from 'react';

const ExerciseCard = ({ exercise }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm leading-6 font-medium text-gray-900">
          {exercise.name}
        </h3>
      </div>
      <div className="px-4 py-3">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-xs font-medium text-gray-500">Séries</dt>
            <dd className="mt-1 text-sm text-gray-900">{exercise.sets}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-xs font-medium text-gray-500">Repetições</dt>
            <dd className="mt-1 text-sm text-gray-900">{exercise.reps}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-xs font-medium text-gray-500">Carga</dt>
            <dd className="mt-1 text-sm text-gray-900">{exercise.weight}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-xs font-medium text-gray-500">Tempo de Descanso</dt>
            <dd className="mt-1 text-sm text-gray-900">{exercise.rest}</dd>
          </div>
          {exercise.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-gray-500">Observações</dt>
              <dd className="mt-1 text-sm text-gray-900">{exercise.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default ExerciseCard;
