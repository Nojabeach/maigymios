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
      console.error(e);
    }
    navigate(ScreenName.WORKOUT);
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all font-black text-xs"
            onClick={() => navigate(ScreenName.WORKOUT)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Ejercicio 1</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Siguiente: Flexiones</p>
          </div>
        </div>
        <button className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600">
          <span className="material-symbols-outlined filled">volume_up</span>
        </button>
      </header>

      <div className="flex flex-col gap-8 pb-32 animate-fade-in w-full max-w-lg mx-auto">
        {/* Video Player Placeholder */}
        <section className="relative w-full aspect-video bg-slate-900 overflow-hidden shadow-2xl">
          <img src={IMAGES.EXERCISE_SQUAT} className="w-full h-full object-cover opacity-80" alt="Squat" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full bg-primary-500/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md active:scale-90 transition-all">
              <span className="material-symbols-outlined text-4xl filled">play_arrow</span>
            </button>
          </div>

          {/* Progress UI */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-primary-500 w-1/3 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
            <div className="flex justify-between items-center text-white/70 text-[10px] font-black uppercase tracking-widest">
              <span>00:37</span>
              <span>- 01:23</span>
            </div>
          </div>
        </section>

        {/* Title & Description */}
        <section className="px-6 flex flex-col gap-4">
          <div>
            <span className="text-[11px] font-black text-primary-500 uppercase tracking-widest mb-2 block">Técnica Correcta</span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Sentadilla Asistida</h2>
          </div>

          <div className="flex gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500 text-sm filled">fitness_center</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">12 Reps</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500 text-sm filled">bolt</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">Medio</span>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-400 leading-relaxed mt-2">Mantén la espalda recta y utiliza la silla únicamente para mantener el equilibrio, evitando apoyarte totalmente en ella.</p>
        </section>

        {/* Steps List */}
        <section className="px-6 flex flex-col gap-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight px-1">Instrucciones</h3>
          <div className="flex flex-col gap-8 relative pl-10 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
            {[
              "Coloca los pies a la altura de los hombros con las puntas hacia afuera.",
              "Desciende lentamente imaginando que vas a sentarte en la silla.",
              "Mantén la mirada al frente y el core activado en todo momento."
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[54px] top-0 w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center font-black text-slate-900 dark:text-white shadow-sm ring-4 ring-white dark:ring-slate-950">
                  {i + 1}
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Analysis Promotion */}
        <section className="px-6 mt-8">
          <div className="card-premium bg-slate-950 p-6 flex flex-col gap-4 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-primary-500/20 border border-primary-500/30 rounded-2xl flex items-center justify-center text-primary-500 mx-auto mb-4 group-hover:scale-110 transition-all">
                <span className="material-symbols-outlined text-3xl filled">smart_toy</span>
              </div>
              <h4 className="font-black text-white text-lg">¿Dudas con tu técnica?</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed px-4">Utiliza nuestra IA para analizar tu postura en tiempo real y evitar lesiones.</p>
              <button className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl mt-6 active:scale-95 transition-all text-xs uppercase tracking-widest">
                Activar Cámara IA
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/50 p-6 pb-10 z-30 safe-bottom">
        <div className="flex gap-4 max-w-lg mx-auto">
          <button className="w-16 h-16 rounded-[2rem] bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">skip_previous</span>
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 bg-primary-500 text-white font-black py-4 rounded-[2rem] shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Completar Ejercicio
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailView;