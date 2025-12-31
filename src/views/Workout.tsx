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
    sets: '3 x 10 rep',
    image: IMAGES.EXERCISE_SQUAT
  },
  {
    id: 'pushups',
    name: 'Flexiones en Pared',
    description: 'Pecho y brazos sin impacto.',
    tags: ['Brazos'],
    sets: '3 x 8 rep',
    image: IMAGES.EXERCISE_PUSHUP
  },
  {
    id: 'lunges',
    name: 'Zancadas Alternas',
    description: 'Fortalece piernas y glúteos.',
    tags: ['Piernas'],
    sets: '3 x 10 rep',
    image: IMAGES.WORKOUT_YOGA
  },
  {
    id: 'plank',
    name: 'Plancha Abdominal',
    description: 'Fortalece el core.',
    tags: ['Core'],
    sets: '3 x 30 seg',
    image: IMAGES.WORKOUT_HEADER
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
        setCompletedExercises(new Set(data.map((w: any) => w.exercise_name)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExercise = async (exercise: typeof EXERCISES[0]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (completedExercises.has(exercise.name)) return;

    setCompletedExercises(prev => new Set(prev).add(exercise.name));

    const today = new Date().toISOString().split('T')[0];
    await supabase.from('workouts').insert({
      user_id: user.id,
      exercise_name: exercise.name,
      duration_minutes: 10,
      calories_burned: 30,
      intensity: 'moderate',
      date: today
    });
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Entrenar</h1>
        </div>
        <button className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">analytics</span>
        </button>
      </header>

      <div className="flex flex-col gap-8 p-6 pb-24 animate-fade-in w-full max-w-lg mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col gap-4">
          <div className="px-1">
            <span className="text-[11px] font-black text-primary-500 uppercase tracking-widest mb-1 block">Tu bienestar primero</span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Cuerpo Fuerte,<br />Mente Activa</h2>
          </div>

          <div
            className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer active:scale-[0.98] transition-all h-[260px] shadow-strong"
            onClick={() => navigate(ScreenName.WORKOUT_DETAIL)}
          >
            <img src={IMAGES.WORKOUT_HEADER} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Workout" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-8 flex flex-col justify-end">
              <div className="bg-primary-500 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-3">DESTACADO HOY</div>
              <h3 className="text-2xl font-black text-white leading-tight mb-2">Movilidad Total y Fuerza</h3>
              <div className="flex items-center gap-6 text-white/80 text-xs font-bold">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">timer</span> 20 min</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">fitness_center</span> Principiante</span>
              </div>
            </div>
          </div>
        </section>

        {/* Exercises List */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1 mb-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Rutina del Día</h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{EXERCISES.length} Pasos</span>
          </div>

          <div className="flex flex-col gap-4">
            {EXERCISES.map((ex, i) => {
              const isCompleted = completedExercises.has(ex.name);
              return (
                <div
                  key={ex.id}
                  className={`card-premium p-4 flex items-center gap-4 group transition-all ${isCompleted ? 'opacity-60 bg-slate-50 border-none shadow-none' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={ex.image} className="w-full h-full object-cover" alt={ex.name} />
                    {!isCompleted && (
                      <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">play_circle</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-primary-500 uppercase tracking-tighter bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md">
                        {ex.tags[0]}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{ex.sets}</span>
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white truncate">{ex.name}</h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">{ex.description}</p>
                  </div>

                  <button
                    onClick={() => toggleExercise(ex)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-primary-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}
                  >
                    <span className="material-symbols-outlined filled">{isCompleted ? 'check_circle' : 'circle'}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Motivation Card */}
        <section className="card-premium bg-slate-950 text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-black text-lg mb-2">¡Sigue así, Maria!</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">Has completado el 75% de tus entrenamientos semanales. Estás a muy poco de tu mejor racha.</p>
            <button className="text-primary-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              Ver progreso semanal <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          {/* Abstract glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-[60px]"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>
        </section>
      </div>
    </div>
  );
};

export default WorkoutView;