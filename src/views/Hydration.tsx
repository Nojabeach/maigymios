import React from "react";
import { ScreenName, type UserStats } from "../types";
import { supabase } from "../supabaseClient";

interface HydrationProps {
  stats: UserStats;
  updateHydration: (amount: number) => void;
  navigate: (screen: ScreenName) => void;
}

const HydrationView: React.FC<HydrationProps> = ({
  stats,
  updateHydration,
  navigate,
}) => {
  const percentage = Math.min(
    100,
    Math.round((stats.hydrationCurrent / stats.hydrationGoal) * 100)
  );
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleAddWater = async (amount: number) => {
    updateHydration(amount);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("hydration_logs").insert({
          user_id: user.id,
          amount_liters: amount,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err) {
      console.error("Error logging hydration:", err);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Hidratación</h1>
        </div>
        <button className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col gap-8 p-6 pb-24 animate-fade-in w-full max-w-lg mx-auto">
        {/* Main Progress Circle */}
        <section className="flex flex-col items-center pt-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.hydrationCurrent >= stats.hydrationGoal ? "¡Meta Lograda! 🎉" : "Casi lo tienes"}
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Día de entrenamiento intenso</p>
          </div>

          <div className="relative size-72 flex items-center justify-center">
            <svg className="absolute size-full -rotate-90 transform drop-shadow-2xl" viewBox="0 0 100 100">
              <circle
                className="text-slate-100 dark:text-slate-900"
                cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="9"
              ></circle>
              <circle
                className="text-blue-500 transition-all duration-1000 ease-out"
                cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="9"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-full m-8 shadow-inner z-10 border border-slate-50 dark:border-slate-800">
              <span className="material-symbols-outlined text-4xl text-blue-500 mb-1 filled">water_drop</span>
              <div className="text-5xl font-black text-slate-900 dark:text-white tabular-nums">
                {stats.hydrationCurrent.toFixed(1)}<span className="text-xl opacity-30">L</span>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                Meta: {stats.hydrationGoal}L
              </div>
            </div>
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[80px] -z-10"></div>
          </div>
        </section>

        {/* Quick Add Grid */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Registrar Ingreso</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              className="card-premium p-4 flex flex-col items-center gap-3 active:scale-95 group"
              onClick={() => handleAddWater(0.25)}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-all">
                <span className="material-symbols-outlined">water_full</span>
              </div>
              <span className="text-xs font-black dark:text-white">+250ml</span>
            </button>

            <button
              className="card-premium p-4 flex flex-col items-center gap-3 active:scale-95 group"
              onClick={() => handleAddWater(0.5)}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-all">
                <span className="material-symbols-outlined">water_bottle</span>
              </div>
              <span className="text-xs font-black dark:text-white">+500ml</span>
            </button>

            <button
              className="card-premium p-4 flex flex-col items-center gap-3 active:scale-95 group"
              onClick={() => handleAddWater(1.0)}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-all">
                <span className="material-symbols-outlined">local_drink</span>
              </div>
              <span className="text-xs font-black dark:text-white">+1.0L</span>
            </button>
          </div>
        </section>

        {/* Info Card */}
        <section className="card-premium bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl text-blue-300">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm uppercase tracking-wider">Sabías que...</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Beber agua antes de las comidas puede ayudar a mejorar tu metabolismo y digestión significativamente.</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
        </section>
      </div>
    </div>
  );
};

export default HydrationView;
