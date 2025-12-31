import React, { useState, useEffect } from "react";
import { ScreenName } from "../types";
import { IMAGES } from "../constants";
import {
  WeeklyProgressChart,
  CaloriesChart,
  HydrationChart,
} from "../components/Charts";
import { supabase } from "../supabaseClient";

interface ProfileProps {
  navigate: (screen: ScreenName) => void;
  toggleDarkMode: () => void;
  onLogout: () => void;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  user: any;
}

const ProfileView: React.FC<ProfileProps> = ({
  navigate,
  toggleDarkMode,
  onLogout,
  user,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [weeklyProgressData, setWeeklyProgressData] = useState<any[]>([]);
  const [caloriesData, setCaloriesData] = useState<any[]>([]);
  const [hydrationData, setHydrationData] = useState<any[]>([]);

  useEffect(() => {
    const loadCharts = async () => {
      if (!user?.id) return;

      const { data: stats } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order("date", { ascending: true });

      if (stats) {
        const mapData = (key: string) => stats.map(s => ({
          date: new Date(s.date).toLocaleDateString("es-ES", { weekday: "short" }),
          value: s[key] || 0
        }));

        setWeeklyProgressData(mapData("activity_minutes"));
        setCaloriesData(mapData("calories"));
        setHydrationData(mapData("hydration_liters"));
      }
    };
    loadCharts();
  }, [user?.id]);

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Mi Perfil</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-primary-500 shadow-sm"
        >
          <span className="material-symbols-outlined filled">dark_mode</span>
        </button>
      </header>

      <div className="flex flex-col gap-8 p-6 pb-24 animate-fade-in w-full max-w-lg mx-auto overflow-y-auto">
        {/* User Info Section */}
        <section className="flex flex-col items-center pt-4">
          <div className="relative mb-6">
            <div
              className="w-32 h-32 rounded-full bg-center bg-cover border-4 border-white dark:border-slate-900 shadow-2xl ring-4 ring-primary-500/20"
              style={{ backgroundImage: `url("${IMAGES.USER_AVATAR}")` }}
            ></div>
            <button className="absolute bottom-0 right-0 p-2.5 bg-primary-500 text-white rounded-full shadow-lg border-4 border-white dark:border-slate-900 active:scale-90 transition-all">
              <span className="material-symbols-outlined text-sm filled">edit</span>
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Maria González</h2>
            <div className="flex items-center gap-2 mt-2 justify-center">
              <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full uppercase tracking-tighter ring-1 ring-primary-500/20">Miembro Elite</span>
              <p className="text-xs font-bold text-slate-400">Unida en 2023</p>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="card-premium p-5 flex flex-col gap-1 items-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Edad</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">52 <span className="text-xs opacity-50 font-bold">años</span></h3>
          </div>
          <div className="card-premium p-5 flex flex-col gap-1 items-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Altura</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">165 <span className="text-xs opacity-50 font-bold">cm</span></h3>
          </div>
          <div className="col-span-2 card-premium p-6 flex flex-col items-center gap-4 relative overflow-hidden group">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peso Actual</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">68.5 <span className="text-lg opacity-30 font-bold">kg</span></h3>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center shadow-soft active:scale-90 transition-all">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <button className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-90 transition-all">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            <button
              onClick={() => setShowHistory(true)}
              className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-2 px-4 py-2 hover:bg-primary-50 rounded-full transition-all"
            >
              Ver historial
            </button>
          </div>
        </section>

        {/* Charts Section */}
        <section className="flex flex-col gap-10">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Actividad Semanal</h3>
              <span className="material-symbols-outlined text-slate-300">show_chart</span>
            </div>
            <div className="card-premium p-2">
              <WeeklyProgressChart data={weeklyProgressData} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6">Calorías Totales</h3>
              <div className="card-premium p-2">
                <CaloriesChart data={caloriesData} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6">Nivel Hidratación</h3>
              <div className="card-premium p-2">
                <HydrationChart data={hydrationData} />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <section className="flex flex-col gap-4 mt-6">
          <button
            onClick={() => navigate(ScreenName.HEALTH)}
            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-black py-5 rounded-[2rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined filled">health_metrics</span>
            Apple Health Connect
          </button>

          <button
            onClick={onLogout}
            className="w-full py-5 text-red-500 font-black text-sm uppercase tracking-widest"
          >
            Cerrar Sesión
          </button>
        </section>
      </div>

      {/* Modern Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 safe-bottom">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Historial de Peso</h3>
              <button onClick={() => setShowHistory(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 mb-10 px-2 group">
              {[72, 71.5, 71, 70.2, 69.8, 69, 68.5].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full bg-primary-500/10 rounded-2xl relative transition-all group-hover:bg-primary-500/30" style={{ height: `${((val - 65) / 10) * 100}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1.5 px-3 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                      {val}kg
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 tracking-tighter">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}</span>
                </div>
              ))}
            </div>

            <div className="bg-primary-500/5 border border-primary-500/20 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <span className="material-symbols-outlined filled">trending_down</span>
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white">¡Vas por buen camino!</h4>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Bajaste 3.5kg en los últimos 30 días.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHistory(false)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-4 rounded-2xl mt-8 active:scale-95 transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
