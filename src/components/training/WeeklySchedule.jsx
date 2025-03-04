import React from 'react';

const WeeklySchedule = ({ week, weekNumber }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 bg-indigo-50">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Semana {weekNumber}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {week.objective}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
          {week.days.map((day, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h4 className="text-sm font-medium text-gray-900">Dia {index + 1} - {day.focus}</h4>
              </div>
              <div className="px-4 py-4">
                {day.workouts.map((workout, wIndex) => (
                  <div key={wIndex} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium text-gray-700">{workout.type}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        workout.intensity === 'Alta' 
                          ? 'bg-red-100 text-red-800' 
                          : workout.intensity === 'Média'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {workout.intensity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {workout.description}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t">
                <p className="text-xs text-gray-500">
                  Foco: {day.recovery ? 'Recuperação' : 'Treino'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;