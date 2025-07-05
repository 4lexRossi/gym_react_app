// Mock data for the workout app
export const mockWorkoutData = {
  monday: [
    { id: 1, name: "Push-ups", sets: 3, reps: 15, completed: false },
    { id: 2, name: "Squats", sets: 4, reps: 12, completed: true },
    { id: 3, name: "Plank", sets: 3, reps: 60, completed: false }
  ],
  tuesday: [
    { id: 4, name: "Pull-ups", sets: 3, reps: 8, completed: false },
    { id: 5, name: "Lunges", sets: 3, reps: 12, completed: false },
  ],
  wednesday: [
    { id: 6, name: "Bench Press", sets: 4, reps: 10, completed: true },
    { id: 7, name: "Deadlifts", sets: 3, reps: 8, completed: false },
  ],
  thursday: [],
  friday: [
    { id: 8, name: "Shoulder Press", sets: 3, reps: 12, completed: false },
  ],
  saturday: [],
  sunday: [
    { id: 9, name: "Yoga Flow", sets: 1, reps: 30, completed: false },
  ]
};

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
  return saved ? JSON.parse(saved) : mockWorkoutData;
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
    ...exercise
  };
  data[day] = [...dayExercises, newExercise];
  saveWorkoutData(data);
  return newExercise;
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