import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { daysOfWeek } from '../data/mockData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import './DayView.css';
import { useRef, useEffect } from 'react';

const DayView = ({ workoutData, onUpdateWorkout }) => {
  const { dayKey } = useParams();
  const navigate = useNavigate();
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sets: '',
    reps: ''
  });

  const dayInfo = daysOfWeek.find(d => d.key === dayKey);
  const exercises = workoutData[dayKey] || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sets || !formData.reps) return;

    const exerciseData = {
      name: formData.name,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps)
    };

    try {
      if (editingExercise) {
        onUpdateWorkout(dayKey, 'update', editingExercise.id, exerciseData);
        setEditingExercise(null);
      } else {
        onUpdateWorkout(dayKey, 'add', null, exerciseData);
      }

      setFormData({ name: '', sets: '', reps: '' });
      setIsAddingExercise(false);
    } catch (error) {
      // Handle the 10 exercise limit error
      alert(error.message);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString()
    });
    setIsAddingExercise(true);
  };

  const handleDelete = (exerciseId) => {
    onUpdateWorkout(dayKey, 'delete', exerciseId);
    setExerciseToDelete(null);
  };

  const confirmDelete = (exercise) => {
    setExerciseToDelete(exercise);
  };

  const handleToggleComplete = (exerciseId) => {
    onUpdateWorkout(dayKey, 'toggle', exerciseId);
  };

  const handleCancel = () => {
    setIsAddingExercise(false);
    setEditingExercise(null);
    setFormData({ name: '', sets: '', reps: '' });
  };

  const handleDayNavigation = (newDayKey) => {
    navigate(`/day/${newDayKey}`);
  };

  const getTotalSets = () => {
    return exercises.reduce((total, exercise) => total + exercise.sets, 0);
  };

  const getTotalReps = () => {
    return exercises.reduce((total, exercise) => total + (exercise.sets * exercise.reps), 0);
  };

  const getCompletedCount = () => {
    return exercises.filter(exercise => exercise.completed).length;
  };

  const getCurrentDayIndex = () => {
    return daysOfWeek.findIndex(d => d.key === dayKey);
  };

  useEffect(() => {
    if (isAddingExercise && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAddingExercise]);

  const bottomRef = useRef(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="mb-4 hover:bg-gray-100"
            >
              ← Week days
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {dayInfo?.name} Workout
            </h1>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {exercises.length}/10 exercises
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {getCompletedCount()}/{exercises.length} completed
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {getTotalSets()} total sets
              </Badge>
            </div>
          </div>
        </div>
        {/* Exercise List */}
        <div className="space-y-4 no-exercise-added">
          {exercises.length === 0 ? (
            <a onClick={() => setIsAddingExercise(true)}>
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No exercises yet</h3>
                <p className="text-gray-500 mb-4">Start building your workout by adding your first exercise!</p>

              </CardContent>
            </Card>
            </a>
          ) : (
            exercises.map((exercise, index) => (
              <Card key={exercise.id} className={`hover:shadow-lg transition-all ${
                exercise.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <Checkbox
                        checked={exercise.completed}
                        onCheckedChange={() => handleToggleComplete(exercise.id)}
                        className="w-6 h-6 flex-shrink-0"
                      />
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-xl font-semibold truncate ${
                          exercise.completed ? 'text-green-700 line-through' : 'text-gray-900'
                        }`}>
                          {exercise.name}
                        </h3>
                        <p className={`${
                          exercise.completed ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 resum-work-numbers">
                      <Badge variant="outline" className={`${
                        exercise.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}>
                        total reps {exercise.sets * exercise.reps}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(exercise)}
                        className="hover:bg-blue-50 w-10 h-10 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 text-red-600 w-10 h-10 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{exercise.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(exercise.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {/* Add/Edit Exercise Form */}
        {isAddingExercise && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl">
                {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Exercise Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Push-ups"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      name="sets"
                      type="number"
                      value={formData.sets}
                      onChange={handleInputChange}
                      placeholder="e.g., 3"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      name="reps"
                      type="number"
                      value={formData.reps}
                      onChange={handleInputChange}
                      placeholder="e.g., 12"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                   <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {'Confirm'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
          {/* Add Exercise Button */}
          <Button
            onClick={() => setIsAddingExercise(true)}
            disabled={exercises.length >= 10 || editingExercise || isAddingExercise}
            variant="outline"
            className={`w-full py-4 border-2 border-dashed transition-all flex items-center justify-center space-x-2 ${
              exercises.length >= 10
                ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                : 'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>{exercises.length >= 10 ? 'Maximum 10 Exercises Reached' : 'Exercise'}</span>
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {daysOfWeek.map((day, index) => {
              const isActive = day.key === dayKey;
              const exerciseCount = (workoutData[day.key] || []).length;
              const completedCount = (workoutData[day.key] || []).filter(e => e.completed).length;
              const isCompleted = exerciseCount > 0 && completedCount === exerciseCount;

              return (
                <button
                  key={day.key}
                  onClick={() => handleDayNavigation(day.key)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <div className="relative">
                    <span className="text-xs font-medium">{day.short}</span>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {exerciseCount > 0 ? `${completedCount}/${exerciseCount}` : '-'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    <div ref={bottomRef} />
    </div>
  );
};

export default DayView;