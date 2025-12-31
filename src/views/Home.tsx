import React, { useEffect, useState } from "react";
import { ScreenName, type UserStats } from "../types";
import { IMAGES } from "../constants";
import { supabase } from "../supabaseClient";

interface HomeProps {
  stats: UserStats;
  navigate: (screen: ScreenName) => void;
}

const HomeView: React.FC<HomeProps> = ({ stats, navigate }) => {
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
      const { data: { user } } = await supabase.auth.getUser();
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
  const progressPercentage = Math.min(100, Math.round((stats.activityMin / activityGoal) * 100));
  const circleCircumference = 552;
  const strokeDashoffset = circleCircumference - (progressPercentage / 100) * circleCircumference;

  const hydrationPercentage = stats.hydrationGoal > 0 ? (stats.hydrationCurrent / stats.hydrationGoal) * 100 : 0;
  const dropletsCount = 5;
  const activeDroplets = Math.floor((hydrationPercentage / 100) * dropletsCount);

  return (
    <>
      {/* Header */}
      <header className="flex items-center px-6 pt-12 pb-4 justify-between sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm transition-all duration-300">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate(ScreenName.PROFILE)}
        >
          <div className="relative group-active:scale-95 transition-transform">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full w-12 h-12 border-2 border-primary shadow-sm"
              style={{ backgroundImage: `url("${IMAGES.USER_AVATAR}")` }}
            ></div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white dark:border-background-dark"></div>
          </div>
          <div>
            <p
              className="text-sm text-text-sub dark:text-gray-400 font-normal opacity-0 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              {greeting},
            </p>
            <h2 className="text-xl font-bold leading-tight dark:text-white">
              Maria
            </h2>
          </div>
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative active:scale-90"
          onClick={() => navigate(ScreenName.SETTINGS)}
        >
          <span className="material-symbols-outlined text-2xl dark:text-white">
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse"></span>
        </button>
      </header>

      <div className="flex flex-col gap-6 px-6 pb-6 animate-fade-in">
        {/* Daily Progress Chart Section */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg dark:text-white">
              Resumen Diario
            </h3>
            <span className="bg-primary/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Hoy
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Background Circle */}
              <svg className="transform -rotate-90 w-full h-full drop-shadow-md">
                <circle
                  className="text-gray-100 dark:text-gray-800"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="#22c55e"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="12"
                  className="transition-all duration-1000 ease-out"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-extrabold tracking-tighter dark:text-white">
                  {progressPercentage}<span className="text-2xl">%</span>
                </span>
                <span className="text-sm text-text-sub dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md mt-1">
                  Completado
                </span>
              </div>
            </div>
            <div className="flex w-full justify-between gap-2 mt-2 bg-gray-50 dark:bg-black/20 p-4 rounded-2xl">
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="material-symbols-outlined text-orange-500">
                  local_fire_department
                </span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Calorías
                </p>
                <p className="text-sm font-bold dark:text-white">
                  {stats.calories}
                </p>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700 h-8 self-center"></div>
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="material-symbols-outlined text-blue-500">
                  monitor_heart
                </span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Actividad
                </p>
                <p className="text-sm font-bold dark:text-white">
                  {stats.activityMin} min
                </p>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700 h-8 self-center"></div>
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="material-symbols-outlined text-purple-500">
                  spa
                </span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Mente
                </p>
                <p className="text-sm font-bold dark:text-white">
                  {stats.mindMin} min
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mini Challenges */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-1">
            <h3 className="font-bold text-lg dark:text-white">Mini-Retos</h3>
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 px-3 py-1 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-sm fill-1">
                military_tech
              </span>
              <span className="text-xs font-bold text-yellow-800 dark:text-yellow-200">
                Nivel 3
              </span>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-4 shadow-sm flex flex-col gap-3 border border-gray-100 dark:border-gray-800">
            <div className="group flex items-center gap-3 p-3 bg-white dark:bg-black/20 rounded-2xl border-l-4 border-primary shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-[0.99]">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-full text-blue-500">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm dark:text-white">
                    Hidratación Plus
                  </h4>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px] filled">
                      bolt
                    </span>
                    50 pts
                  </span>
                </div>
                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                  Bebe 8 vasos de agua hoy
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-blue-400 h-1.5 rounded-full relative overflow-hidden"
                    style={{ width: `${hydrationPercentage}%` }}
                  >
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex items-center gap-3 p-3 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:border-primary/50 transition-all active:scale-[0.99]" onClick={() => navigate(ScreenName.CHALLENGES)}>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-full text-orange-500">
                <span className="material-symbols-outlined">
                  directions_walk
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm dark:text-white">
                    Desafíos Activos
                  </h4>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px] filled">
                      bolt
                    </span>
                    Ver todos
                  </span>
                </div>
                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                  Completa tus retos diarios
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fasting Timer Widget */}
        <section
          className="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4 border-l-4 border-primary cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
          onClick={() => navigate(ScreenName.FASTING)}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl filled">
                timer
              </span>
              <h4 className="font-bold text-base dark:text-white">
                {fastingSession ? `Ayuno ${fastingSession.protocol || '16:8'}` : 'Ayuno Intermitente'}
              </h4>
            </div>
            <p className="text-sm text-text-sub dark:text-gray-400">
              {fastingSession ? "En ventana de ayuno" : "No has iniciado ayuno"}
            </p>
            <p className="text-xl font-bold font-display mt-1 dark:text-white tabular-nums tracking-tight">
              {fastingSession
                ? `${String(fastingElapsed.h).padStart(2, '0')}:${String(fastingElapsed.m).padStart(2, '0')}:${String(fastingElapsed.s).padStart(2, '0')}`
                : "Iniciar Ahora"
              }
              {fastingSession &&
                <span className="text-xs font-normal text-text-sub dark:text-gray-400 ml-1">
                  tiempo
                </span>
              }
            </p>
          </div>
          <div className="relative w-16 h-16 shrink-0">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                className="text-gray-100 dark:text-gray-700"
                cx="32"
                cy="32"
                fill="transparent"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
              ></circle>
              {fastingSession &&
                <circle
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="28"
                  stroke="#22c55e"
                  strokeDasharray="175"
                  strokeDashoffset={175 - (175 * 0.2)} // Mock slight progress for visual
                  strokeLinecap="round"
                  strokeWidth="6"
                  className="animate-pulse"
                ></circle>
              }
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`material-symbols-outlined text-lg ${fastingSession ? "text-primary animate-pulse" : "text-gray-400 text-3xl"}`}>
                {fastingSession ? "bolt" : "play_arrow"}
              </span>
            </div>
          </div>
        </section>

        {/* Workout Card */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-1">
            <h3 className="font-bold text-lg dark:text-white">
              Entrenamiento de hoy
            </h3>
            <button
              className="text-primary text-sm font-semibold hover:underline"
              onClick={() => navigate(ScreenName.WORKOUT)}
            >
              Ver todo
            </button>
          </div>
          <div
            className="bg-surface-light dark:bg-surface-dark rounded-3xl p-4 shadow-sm flex gap-4 cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => navigate(ScreenName.WORKOUT)}
          >
            <div
              className="w-24 h-24 shrink-0 rounded-2xl bg-cover bg-center shadow-md"
              style={{ backgroundImage: `url("${IMAGES.WORKOUT_YOGA}")` }}
            ></div>
            <div className="flex flex-col justify-between flex-1 py-1">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Día 12
                </span>
                <h4 className="font-bold text-base leading-tight mt-1 dark:text-white">
                  Fuerza en casa
                </h4>
                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                  20 min • Intensidad Media
                </p>
              </div>
              <button className="bg-primary text-black font-bold text-sm py-2 px-4 rounded-xl w-fit flex items-center gap-1 hover:bg-green-400 transition-colors mt-2 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-lg">
                  play_arrow
                </span>
                Iniciar
              </button>
            </div>
          </div>
        </section>

        {/* Meal Plan Card */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-1">
            <h3 className="font-bold text-lg dark:text-white">Nutrición</h3>
            <button
              className="text-primary text-sm font-semibold hover:underline"
              onClick={() => navigate(ScreenName.NUTRITION)}
            >
              Plan semanal
            </button>
          </div>
          <div
            className="bg-surface-light dark:bg-surface-dark rounded-3xl p-4 shadow-sm flex gap-4 cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => navigate(ScreenName.NUTRITION)}
          >
            <div
              className="w-24 h-24 shrink-0 rounded-2xl bg-cover bg-center shadow-md"
              style={{ backgroundImage: `url("${IMAGES.MEAL_SALAD}")` }}
            ></div>
            <div className="flex flex-col justify-between flex-1 py-1">
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">
                  Almuerzo Sugerido
                </span>
                <h4 className="font-bold text-base leading-tight mt-1 dark:text-white">
                  Ensalada César
                </h4>
                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                  450 Kcal • 25g Proteína
                </p>
              </div>
              <button className="bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white font-medium text-sm py-2 px-4 rounded-xl w-fit flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mt-2">
                <span className="material-symbols-outlined text-lg">
                  restaurant_menu
                </span>
                Ver Receta
              </button>
            </div>
          </div>
        </section>

        {/* Hydration Tracker */}
        <section
          className="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 shadow-sm cursor-pointer active:scale-[0.99] transition-transform border border-gray-100 dark:border-gray-800"
          onClick={() => navigate(ScreenName.HYDRATION)}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-500">
                <span className="material-symbols-outlined text-xl">
                  water_drop
                </span>
              </div>
              <h3 className="font-bold text-base dark:text-white">
                Hidratación
              </h3>
            </div>
            <p className="text-sm font-bold text-text-sub dark:text-gray-300">
              {stats.hydrationCurrent}L{" "}
              <span className="text-xs font-normal opacity-70">
                / {stats.hydrationGoal}L
              </span>
            </p>
          </div>
          {/* Water Droplets Visual */}
          <div className="flex justify-between items-center gap-2 px-1 mb-2">
            {[...Array(5)].map((_, i) => {
              const active = i < activeDroplets; // Dynamic based on %
              return (
                <button
                  key={i}
                  className={`flex-1 aspect-[2/3] rounded-full flex items-center justify-center transition-all ${active
                      ? "bg-blue-400 text-white shadow-sm hover:scale-105"
                      : "bg-gray-100 dark:bg-gray-800 opacity-50"
                    }`}
                >
                  {active && (
                    <span className="material-symbols-outlined text-sm font-bold">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-center text-text-sub dark:text-gray-500 mt-2">
            {(stats.hydrationGoal - stats.hydrationCurrent) > 0
              ? `Faltan ${(stats.hydrationGoal - stats.hydrationCurrent).toFixed(1)}L para tu meta.`
              : "¡Meta diaria cumplida! 🎉"}
          </p>
        </section>
      </div>
      <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
      `}</style>
    </>
  );
};

export default HomeView;
