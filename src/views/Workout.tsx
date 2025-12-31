import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { IMAGES } from '../constants';
import { supabase } from '../supabaseClient';

interface WorkoutProps {
  navigate: (screen: ScreenName) => void;
}

const EXERCISES = [
  {
    id: 'squats',
    name: 'Sentadillas Asistidas',
    description: 'Usa una silla para equilibrio.',
    tags: ['Piernas'],
    sets: '3 series x 10 rep',
    image: IMAGES.EXERCISE_SQUAT
  },
  {
    id: 'pushups',
    name: 'Flexiones en Pared',
    description: 'Pecho y brazos sin impacto.',
    tags: ['Brazos'],
    sets: '3 series x 8 rep',
    image: IMAGES.EXERCISE_PUSHUP
  },
  {
    id: 'lunges',
    name: 'Zancadas Alternas',
    description: 'Fortalece piernas y glúteos.',
    tags: ['Piernas'],
    sets: '3 series x 10 rep',
    image: IMAGES.WORKOUT_YOGA
  },
  {
    id: 'plank',
    name: 'Plancha Abdominal',
    description: 'Fortalece el core.',
    tags: ['Core'],
    sets: '3 series x 30 seg',
    image: IMAGES.WORKOUT_HEADER
  },
  {
    id: 'stretching',
    name: 'Estiramiento Final',
    description: 'Relaja los músculos.',
    tags: ['Flexibilidad'],
    sets: '5 min',
    image: IMAGES.EXERCISE_SQUAT
  }
];

const WorkoutView: React.FC<WorkoutProps> = ({ navigate }) => {
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCompletedWorkouts();
  }, []);

  const fetchCompletedWorkouts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('workouts')
        .select('exercise_name')
        .eq('user_id', user.id)
        .eq('date', today);

      if (data) {
        const completed = new Set(data.map((w: any) => w.exercise_name));
        setCompletedExercises(completed);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const toggleExercise = async (exercise: typeof EXERCISES[0]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isCompleted = completedExercises.has(exercise.name);

      if (isCompleted) {
        // Optimistically remove
        const newSet = new Set(completedExercises);
        newSet.delete(exercise.name);
        setCompletedExercises(newSet);
        return;
      }

      // Optimistically add
      setCompletedExercises(prev => new Set(prev).add(exercise.name));

      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase.from('workouts').insert({
        user_id: user.id,
        exercise_name: exercise.name,
        duration_minutes: 10,
        calories_burned: 30,
        intensity: 'moderate',
        date: today
      });

      if (error) {
        // Revert if error
        setCompletedExercises(prev => {
          const newSet = new Set(prev);
          newSet.delete(exercise.name);
          return newSet;
        });
        console.error("Error saving workout:", error);
      } else {
        // Also update User Stats (adding calories/activity)
        // Ideally this should be server-side trigger or separate call, 
        // but for now let's leave it to the backend or manual sync if needed.
        // The App.tsx realtime subscription might handle total stats updates if we had a trigger.
      }
    } catch (error) {
      console.error("Error toggling exercise:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800/50">
        <div
          className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => navigate(ScreenName.HOME)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Calistenia en Casa</h2>
        <div className="flex size-10 items-center justify-center">
          <button className="relative flex cursor-pointer items-center justify-center rounded-full text-slate-900 dark:text-white transition-transform hover:scale-105">
            <span className="material-symbols-outlined filled">donut_large</span>
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-white dark:border-background-dark"></span>
          </button>
        </div>
      </header>

      <div className="flex flex-col pb-6">
        {/* Hero */}
        <div className="px-5 pt-6 pb-2">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-1 block">Tu bienestar primero</span>
          <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Fortalece tu cuerpo <br />sin pesas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base leading-relaxed">
            Rutinas diseñadas para mantenerte activa, mejorar tu movilidad y fortalecerte a tu propio ritmo.
          </p>
        </div>

        {/* Featured Routine Card */}
        <div className="px-5 py-2">
          <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => navigate(ScreenName.WORKOUT_DETAIL)}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url("${IMAGES.WORKOUT_HEADER}")` }}>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end h-64 p-5 text-white">
              <div className="bg-primary/90 text-background-dark text-xs font-bold px-2 py-1 rounded w-fit mb-2">RECOMENDADO HOY</div>
              <h3 className="text-2xl font-bold mb-1">Movilidad y Fuerza Suave</h3>
              <p className="text-gray-200 text-sm mb-4 line-clamp-2">Una sesión de 20 min enfocada en articulaciones y tonificación ligera para empezar el día.</p>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">schedule</span> 20 min</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">bar_chart</span> Principiante</span>
              </div>
              <button className="mt-4 w-full bg-primary text-background-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined">play_arrow</span>
                Iniciar Rutina
              </button>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="px-5 pt-8 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Ejercicios del día
            <span className="bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 text-xs py-0.5 px-2 rounded-full font-normal">{EXERCISES.length} Total</span>
          </h2>
          <div className="space-y-4">
            {EXERCISES.map((exercise) => {
              const isCompleted = completedExercises.has(exercise.name);
              return (
                <div key={exercise.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${exercise.image}")` }}></div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-black/60 rounded-full p-1 flex items-center justify-center backdrop-blur-sm">
                        <span className="material-symbols-outlined text-primary text-xl">play_arrow</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 dark:text-white font-bold text-lg truncate">{exercise.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 line-clamp-1">{exercise.description}</p>
                    <div className="flex items-center gap-3">
                      {exercise.tags.map(tag => (
                        <span key={tag} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded font-medium">{tag}</span>
                      ))}
                      <span className="text-xs text-slate-400">{exercise.sets}</span>
                    </div>
                  </div>
                  <button
                    className={`shrink-0 transition-colors ${isCompleted ? "text-primary" : "text-slate-400 hover:text-primary"}`}
                    onClick={() => toggleExercise(exercise)}
                  >
                    <span className="material-symbols-outlined">{isCompleted ? "check_circle" : "radio_button_unchecked"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkoutView;