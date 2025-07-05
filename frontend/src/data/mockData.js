export const daysOfWeek = [
  { key: 'monday', name: 'Monday', short: 'Mon' },
  { key: 'tuesday', name: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', name: 'Wednesday', short: 'Wed' },
  { key: 'thursday', name: 'Thursday', short: 'Thu' },
  { key: 'friday', name: 'Friday', short: 'Fri' },
  { key: 'saturday', name: 'Saturday', short: 'Sat' },
  { key: 'sunday', name: 'Sunday', short: 'Sun' }
];

// Mock localStorage functions
export const saveWorkoutData = (data) => {
  localStorage.setItem('workoutData', JSON.stringify(data));
};

export const loadWorkoutData = () => {
  const saved = localStorage.getItem('workoutData');
  return saved ? JSON.parse(saved) : {};
};

export const addExercise = (day, exercise) => {
  const data = loadWorkoutData();
  const dayExercises = data[day] || [];

  // Enforce 10 exercise limit per day
  if (dayExercises.length >= 10) {
    throw new Error('Maximum 10 exercises per day reached');
  }

  const newExercise = {
    id: Date.now(),
    completed: false,
    ...exercise
  };
  data[day] = [...dayExercises, newExercise];
  saveWorkoutData(data);
  return newExercise;
};

export const toggleExerciseCompletion = (day, exerciseId) => {
  const data = loadWorkoutData();
  data[day] = data[day].map(exercise =>
    exercise.id === exerciseId ? { ...exercise, completed: !exercise.completed } : exercise
  );
  saveWorkoutData(data);
};

export const updateExercise = (day, exerciseId, updates) => {
  const data = loadWorkoutData();
  data[day] = data[day].map(exercise =>
    exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
  );
  saveWorkoutData(data);
};

export const deleteExercise = (day, exerciseId) => {
  const data = loadWorkoutData();
  data[day] = data[day].filter(exercise => exercise.id !== exerciseId);
  saveWorkoutData(data);
};