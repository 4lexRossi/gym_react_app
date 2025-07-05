import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { daysOfWeek } from '../data/mockData';

const DayView = ({ workoutData, onUpdateWorkout }) => {
  const { dayKey } = useParams();
  const navigate = useNavigate();
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
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

    if (editingExercise) {
      onUpdateWorkout(dayKey, 'update', editingExercise.id, exerciseData);
      setEditingExercise(null);
    } else {
      onUpdateWorkout(dayKey, 'add', null, exerciseData);
    }

    setFormData({ name: '', sets: '', reps: '' });
    setIsAddingExercise(false);
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
  };

  const handleCancel = () => {
    setIsAddingExercise(false);
    setEditingExercise(null);
    setFormData({ name: '', sets: '', reps: '' });
  };

  const getTotalSets = () => {
    return exercises.reduce((total, exercise) => total + exercise.sets, 0);
  };

  const getTotalReps = () => {
    return exercises.reduce((total, exercise) => total + (exercise.sets * exercise.reps), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-4 hover:bg-gray-100"
            >
              ← Back to Week
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {dayInfo?.name} Workout
            </h1>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {getTotalSets()} total sets
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {getTotalReps()} total reps
              </Badge>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddingExercise(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Add Exercise
          </Button>
        </div>

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
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editingExercise ? 'Update Exercise' : 'Add Exercise'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Exercise List */}
        <div className="space-y-4">
          {exercises.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No exercises yet</h3>
                <p className="text-gray-500 mb-4">Start building your workout by adding your first exercise!</p>
                <Button 
                  onClick={() => setIsAddingExercise(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Your First Exercise
                </Button>
              </CardContent>
            </Card>
          ) : (
            exercises.map((exercise, index) => (
              <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{exercise.name}</h3>
                        <p className="text-gray-600">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-gray-50">
                        {exercise.sets * exercise.reps} total reps
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(exercise)}
                        className="hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(exercise.id)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;