// Mock data for the workout app
export const mockWorkoutData = {
  monday: [
    { id: 1, name: "Push-ups", sets: 3, reps: 15 },
    { id: 2, name: "Squats", sets: 4, reps: 12 },
    { id: 3, name: "Plank", sets: 3, reps: 60 }
  ],
  tuesday: [
    { id: 4, name: "Pull-ups", sets: 3, reps: 8 },
    { id: 5, name: "Lunges", sets: 3, reps: 12 },
  ],
  wednesday: [
    { id: 6, name: "Bench Press", sets: 4, reps: 10 },
    { id: 7, name: "Deadlifts", sets: 3, reps: 8 },
  ],
  thursday: [],
  friday: [
    { id: 8, name: "Shoulder Press", sets: 3, reps: 12 },
  ],
  saturday: [],
  sunday: [
    { id: 9, name: "Yoga Flow", sets: 1, reps: 30 },
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
  const newExercise = {
    id: Date.now(),
    ...exercise
  };
  data[day] = [...(data[day] || []), newExercise];
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