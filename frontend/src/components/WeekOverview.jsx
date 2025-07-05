import { useNavigate } from 'react-router-dom';
import { daysOfWeek } from '../data/mockData';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const WeekOverview = ({ workoutData }) => {
  const navigate = useNavigate();

  const handleDayClick = (dayKey) => {
    navigate(`/day/${dayKey}`);
  };

  const getExerciseCount = (dayKey) => {
    return workoutData[dayKey]?.length || 0;
  };

  const getCompletedCount = (dayKey) => {
    return workoutData[dayKey]?.filter(exercise => exercise.completed).length || 0;
  };

  const getTotalSets = (dayKey) => {
    return workoutData[dayKey]?.reduce((total, exercise) => total + exercise.sets, 0) || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Your Weekly Workout
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your fitness journey day by day. Click on any day to view and manage your exercises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {daysOfWeek.map((day) => {
            const exerciseCount = getExerciseCount(day.key);
            const completedCount = getCompletedCount(day.key);
            const totalSets = getTotalSets(day.key);
            const hasWorkout = exerciseCount > 0;
            const isFullyCompleted = hasWorkout && completedCount === exerciseCount;

            return (
              <Card
                key={day.key}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  isFullyCompleted
                    ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                    : hasWorkout
                      ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                onClick={() => handleDayClick(day.key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {day.short}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {hasWorkout && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {isFullyCompleted && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Done
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 font-medium">
                    {day.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {hasWorkout ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-bold text-green-600">{completedCount}/{exerciseCount} completed</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Sets:</span>
                        <span className="font-bold text-blue-600">{totalSets}</span>
                      </div>
                      <div className="space-y-1">
                        {workoutData[day.key]?.slice(0, 3).map((exercise, index) => (
                          <div key={index} className={`text-sm truncate flex items-center space-x-2 ${
                            exercise.completed ? 'text-green-600' : 'text-gray-700'
                          }`}>
                            {exercise.completed && <span className="text-green-500">✓</span>}
                            <span>{exercise.name} ({exercise.sets}x{exercise.reps})</span>
                          </div>
                        ))}
                        {workoutData[day.key]?.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{workoutData[day.key].length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No exercises yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Active Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Rest Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekOverview;