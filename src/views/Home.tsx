import React, { useEffect, useState } from "react";
import { ScreenName, type UserStats } from "../types";
import { IMAGES } from "../constants";
import { supabase } from "../supabaseClient";

interface HomeProps {
  stats: UserStats;
  navigate: (screen: ScreenName) => void;
  user: any;
}


const HomeView: React.FC<HomeProps> = ({ stats, navigate, user }) => {

  const [greeting, setGreeting] = useState("Buenos días");
  const [fastingSession, setFastingSession] = useState<any>(null);
  const [fastingElapsed, setFastingElapsed] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 20) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, []);

  // Load Fasting Session
  useEffect(() => {
    const loadFasting = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("fasting_sessions")
        .select("*")
        .eq("user_id", user.id)
        .is("end_time", null)
        .order("start_time", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setFastingSession(data);
      }
    };
    loadFasting();
    const interval = setInterval(loadFasting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any;
    if (fastingSession) {
      const updateTimer = () => {
        const start = new Date(fastingSession.start_time).getTime();
        const now = new Date().getTime();
        const diff = now - start;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setFastingElapsed({ h, m, s });
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setFastingElapsed({ h: 0, m: 0, s: 0 });
    }
    return () => clearInterval(interval);
  }, [fastingSession]);

  // Calculations
  const activityGoal = 60; // Minutes
  const progressPercentage = Math.min(
    100,
    Math.round((stats.activityMin / activityGoal) * 100)
  );

  const hydrationPercentage =
    stats.hydrationGoal > 0
      ? (stats.hydrationCurrent / stats.hydrationGoal) * 100
      : 0;

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header - Modern Glassmorphism */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 safe-top">
        <div
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-all"
          onClick={() => navigate(ScreenName.PROFILE)}
        >
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full bg-center bg-cover border-2 border-primary-500 shadow-sm ring-4 ring-primary-500/10"
              style={{ backgroundImage: `url("${user?.user_metadata?.avatar_url || IMAGES.USER_AVATAR}")` }}
            ></div>

            <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-slate-950"></div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              {greeting}
            </p>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Hola, {user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.name || 'Atleta'}
            </h2>

          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90"
            onClick={() => navigate(ScreenName.SETTINGS)}
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-8 px-6 pt-6 pb-24 overflow-y-auto w-full max-w-lg mx-auto">
        {/* Main Progress - Large Apple Health Style */}
        <section className="card-premium animate-slide-up bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden relative">
          <div className="flex flex-col items-center">
            <div className="flex w-full justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Resumen Diario</h3>
                <p className="text-sm text-slate-400 font-medium">Mantén el ritmo</p>
              </div>
              <div className="bg-primary-500/10 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                Activo hoy
              </div>
            </div>

            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="transform -rotate-90 w-full h-full drop-shadow-2xl">
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  cx="112"
                  cy="112"
                  fill="transparent"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="14"
                ></circle>
                <circle
                  cx="112"
                  cy="112"
                  fill="transparent"
                  r="92"
                  stroke="url(#gradient-green)"
                  strokeDasharray="578"
                  strokeDashoffset={578 - (progressPercentage / 100) * 578}
                  strokeLinecap="round"
                  strokeWidth="14"
                  className="transition-all duration-1000 ease-out"
                ></circle>
                <defs>
                  <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-slate-900 dark:text-white tabular-nums">
                  {progressPercentage}<span className="text-2xl opacity-50">%</span>
                </span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Meta Actividad</p>
              </div>
            </div>

            <div className="grid grid-cols-3 w-full gap-4 mt-10">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl filled">local_fire_department</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">cal</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{stats.calories}</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl filled">monitor_heart</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">min</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{stats.activityMin}</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl filled">spa</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">mente</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{stats.mindMin}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Row */}
        <section className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div
            className="card-premium p-4 flex flex-col gap-3 cursor-pointer active:scale-95 group"
            onClick={() => navigate(ScreenName.FASTING)}
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                <span className="material-symbols-outlined filled">timer</span>
              </div>
              {fastingSession && <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>}
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">Ayuno</h4>
              <p className="text-lg font-black mt-1 text-slate-900 dark:text-white tabular-nums">
                {fastingSession
                  ? `${String(fastingElapsed.h).padStart(2, '0')}:${String(fastingElapsed.m).padStart(2, '0')}`
                  : "00:00"
                }
              </p>
            </div>
          </div>

          <div
            className="card-premium p-4 flex flex-col gap-3 cursor-pointer active:scale-95 group"
            onClick={() => navigate(ScreenName.HYDRATION)}
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <span className="material-symbols-outlined filled">water_drop</span>
              </div>
              <span className="text-[11px] font-black text-blue-600">{Math.round(hydrationPercentage)}%</span>
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">Agua</h4>
              <p className="text-lg font-black mt-1 text-slate-900 dark:text-white tabular-nums">
                {stats.hydrationCurrent}<span className="text-xs opacity-40 ml-0.5">L</span>
              </p>
            </div>
          </div>
        </section>

        {/* Featured Content - Workout */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Entrenamiento</h3>
            <button className="text-xs font-black uppercase text-primary-600 tracking-tighter" onClick={() => navigate(ScreenName.WORKOUT)}>Ver todo</button>
          </div>

          <div
            className="relative rounded-3xl overflow-hidden h-40 shadow-soft group cursor-pointer active:scale-[0.98] transition-all"
            onClick={() => navigate(ScreenName.WORKOUT)}
          >
            <img src={IMAGES.WORKOUT_YOGA} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Yoga" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Nivel Intermedio</span>
              <h4 className="text-xl font-black text-white leading-none">Fuerza en casa</h4>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  20 min
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  350 kcal
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nutrition Suggestion */}
        <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Cuidando tu dieta</h3>
          </div>

          <div
            className="card-premium p-4 flex gap-4 cursor-pointer active:scale-[0.98] transition-all"
            onClick={() => navigate(ScreenName.NUTRITION)}
          >
            <img src={IMAGES.MEAL_SALAD} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="Salad" />
            <div className="flex-1 py-1 flex flex-col justify-between">
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">Ensalada César Fit</h4>
                <p className="text-xs text-slate-400 font-medium">Equilibrio perfecto de macros</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">Proteína 25g</span>
                <span className="text-[11px] font-black text-slate-400">450 kcal</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeView;
