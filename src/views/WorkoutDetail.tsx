import React from 'react';
import { ScreenName } from '../types';
import { IMAGES } from '../constants';
import { supabase } from '../supabaseClient';

interface WorkoutDetailProps {
  navigate: (screen: ScreenName) => void;
}

const WorkoutDetailView: React.FC<WorkoutDetailProps> = ({ navigate }) => {
  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('workouts').insert({
          user_id: user.id,
          exercise_name: 'Sentadilla Asistida',
          duration_minutes: 2,
          calories_burned: 5,
          intensity: 'moderate',
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (e) {
      console.error("Error saving exercise:", e);
    }
    navigate(ScreenName.WORKOUT);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2">
        <button
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-neutral-900 dark:text-white"
          onClick={() => navigate(ScreenName.WORKOUT)}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-neutral-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Ejercicio 1 de 5</h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-neutral-900 dark:text-white">
          <span className="material-symbols-outlined">volume_up</span>
        </button>
      </header>

      <main className="flex-1 pb-32">
        {/* Video Player Placeholder */}
        <div className="w-full relative group">
          <div className="relative w-full aspect-[4/3] bg-neutral-900 flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("${IMAGES.EXERCISE_SQUAT}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
            <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-primary/90 text-neutral-900 hover:scale-105 transition-transform shadow-lg shadow-primary/20 backdrop-blur-sm">
              <span className="material-symbols-outlined filled text-3xl">play_arrow</span>
            </button>

            <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex h-1.5 items-center justify-center gap-1 mb-2 w-full cursor-pointer group/progress">
                <div className="h-full flex-1 rounded-full bg-primary shadow-[0_0_10px_rgba(19,236,19,0.5)]"></div>
                <div className="relative">
                  <div className="absolute -left-1.5 -top-1 size-3.5 rounded-full bg-white shadow-md scale-0 group-hover/progress:scale-100 transition-transform"></div>
                </div>
                <div className="h-full flex-1 rounded-full bg-white/30"></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white text-xs font-medium tracking-wide">0:37</p>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-white text-[20px] cursor-pointer hover:text-primary">replay</span>
                  <span className="material-symbols-outlined text-white text-[20px] cursor-pointer hover:text-primary">fullscreen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title & Quick Stats */}
        <div className="px-5 pt-6">
          <h1 className="text-neutral-900 dark:text-white text-[28px] font-extrabold leading-tight mb-4">Sentadilla Asistida</h1>
          <div className="flex gap-2 flex-wrap mb-6">
            <div className="flex h-8 items-center justify-center gap-x-1.5 rounded-full bg-primary/10 dark:bg-primary/20 pl-3 pr-4 border border-primary/20">
              <span className="material-symbols-outlined text-green-700 dark:text-primary text-[18px]">fitness_center</span>
              <p className="text-green-900 dark:text-green-100 text-sm font-semibold">12 Reps</p>
            </div>
            <div className="flex h-8 items-center justify-center gap-x-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 pl-3 pr-4 border border-neutral-200 dark:border-neutral-700">
              <span className="material-symbols-outlined text-neutral-600 dark:text-neutral-400 text-[18px]">speed</span>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">Bajo Impacto</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-5">
          <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-3">Técnica Correcta</h3>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-6 relative">
            <div className="absolute left-[11px] top-2 bottom-8 w-0.5 bg-neutral-200 dark:bg-neutral-800"></div>

            <div className="relative z-10">
              <div className="size-6 rounded-full bg-primary text-neutral-900 flex items-center justify-center text-xs font-bold shadow-sm">1</div>
            </div>
            <div>
              <p className="text-neutral-800 dark:text-neutral-200 text-base font-normal leading-relaxed">Coloca una silla estable detrás de ti, asegurando que no se deslice.</p>
            </div>

            <div className="relative z-10">
              <div className="size-6 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-xs font-bold">2</div>
            </div>
            <div>
              <p className="text-neutral-800 dark:text-neutral-200 text-base font-normal leading-relaxed">Separa los pies a la anchura de los hombros con la punta de los pies ligeramente hacia afuera.</p>
            </div>
          </div>
        </div>

        {/* AI Feedback Section */}
        <div className="px-5 mt-8 mb-4">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-100 dark:border-neutral-800 flex flex-col items-center text-center">
            <div className="bg-primary/20 dark:bg-primary/10 p-3 rounded-full mb-3">
              <span className="material-symbols-outlined text-green-700 dark:text-primary text-3xl">smart_toy</span>
            </div>
            <h4 className="text-neutral-900 dark:text-white font-bold text-base mb-1">¿No estás segura de tu postura?</h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 max-w-[280px]">Deja que nuestra IA analice tu movimiento en tiempo real para evitar lesiones.</p>
            <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
              <span className="material-symbols-outlined text-[20px]">videocam</span>
              Analizar mi postura
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full bg-background-light dark:bg-background-dark border-t border-neutral-100 dark:border-neutral-800 p-4 pb-8 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <button className="flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 gap-1 p-2">
            <span className="material-symbols-outlined">skip_previous</span>
            <span className="text-[10px] font-medium">Anterior</span>
          </button>
          <button
            className="flex-1 bg-primary text-neutral-900 font-bold text-lg h-14 rounded-xl shadow-[0_4px_14px_rgba(19,236,19,0.4)] flex items-center justify-center gap-2 hover:bg-[#0fdc0f] transition-colors active:scale-[0.98]"
            onClick={handleComplete}
          >
            ¡Buen trabajo! Siguiente
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailView;