import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WeekOverview from './components/WeekOverview';
import DayView from './components/DayView';
import { loadWorkoutData, saveWorkoutData, addExercise, updateExercise, deleteExercise } from './data/mockData';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import './App.css';

function App() {
  const [workoutData, setWorkoutData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const data = loadWorkoutData();
    setWorkoutData(data);
  }, []);

  const handleUpdateWorkout = (day, action, exerciseId, exerciseData) => {
    let updatedData = { ...workoutData };

    switch (action) {
      case 'add':
        try {
          const newExercise = addExercise(day, exerciseData);
          updatedData[day] = [...(updatedData[day] || []), newExercise];
          toast({
            title: "Exercise Added",
            description: `Added ${exerciseData.name} to ${day}`,
          });
        } catch (error) {
          toast({
            title: "Cannot Add Exercise",
            description: error.message,
            variant: "destructive",
          });
          return; // Don't update state if there's an error
        }
        break;
      case 'update':
        updateExercise(day, exerciseId, exerciseData);
        updatedData[day] = updatedData[day].map(exercise => 
          exercise.id === exerciseId ? { ...exercise, ...exerciseData } : exercise
        );
        toast({
          title: "Exercise Updated",
          description: `Updated ${exerciseData.name}`,
        });
        break;
      case 'delete':
        deleteExercise(day, exerciseId);
        updatedData[day] = updatedData[day].filter(exercise => exercise.id !== exerciseId);
        toast({
          title: "Exercise Deleted",
          description: "Exercise has been removed from your workout",
        });
        break;
      case 'toggle':
        toggleExerciseCompletion(day, exerciseId);
        updatedData[day] = updatedData[day].map(exercise => 
          exercise.id === exerciseId ? { ...exercise, completed: !exercise.completed } : exercise
        );
        const exercise = updatedData[day].find(e => e.id === exerciseId);
        toast({
          title: exercise.completed ? "Exercise Completed!" : "Exercise Marked Incomplete",
          description: `${exercise.name} ${exercise.completed ? 'completed' : 'marked as incomplete'}`,
        });
        break;
      default:
        break;
    }

    setWorkoutData(updatedData);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={<WeekOverview workoutData={workoutData} />} 
          />
          <Route 
            path="/day/:dayKey" 
            element={
              <DayView 
                workoutData={workoutData} 
                onUpdateWorkout={handleUpdateWorkout} 
              />
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;