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
    // 1. Update UI immediately (Optimistic)
    updateHydration(amount);

    try {
      // 2. Persist log
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("hydration_logs").insert({
          user_id: user.id,
          amount_liters: amount,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        });
        if (error) console.error("Error logging hydration:", error);
      }
    } catch (err) {
      console.error("Error in handleAddWater:", err);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <button
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-main dark:text-white"
          onClick={() => navigate(ScreenName.HOME)}
        >
          <span className="material-symbols-outlined text-[24px]">
            arrow_back
          </span>
        </button>
        <h1 className="text-text-main dark:text-white text-lg font-bold leading-tight">
          Hidratación
        </h1>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-main dark:text-white">
          <span className="material-symbols-outlined text-[24px]">
            settings
          </span>
        </button>
      </header>

      <div className="flex-1 flex flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex flex-col items-center pt-2">
          <h2 className="text-text-main dark:text-white text-2xl font-bold text-center">
            {stats.hydrationCurrent >= stats.hydrationGoal ? "¡Objetivo Cumplido!" : "¡Sigue así!"}
          </h2>
          <p className="text-text-sub dark:text-gray-400 text-sm font-medium mt-1">
            Has alcanzado el {percentage}% de tu meta hoy
          </p>
        </div>

        {/* Circular Progress */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative size-64 flex items-center justify-center">
            <svg
              className="absolute size-full -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-gray-200 dark:text-surface-dark"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
              ></circle>
              <circle
                className="text-primary drop-shadow-[0_0_10px_rgba(19,236,19,0.5)] transition-all duration-1000 ease-out"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full m-4 bg-white dark:bg-surface-dark shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-none z-10">
              <span className="material-symbols-outlined text-4xl text-primary mb-1 fill-1">
                water_drop
              </span>
              <div className="text-4xl font-bold text-text-main dark:text-white">
                {stats.hydrationCurrent}L
              </div>
              <div className="text-sm font-medium text-text-sub dark:text-gray-400 mt-1">
                Meta: {stats.hydrationGoal}L
              </div>
            </div>
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Quick Add Grid */}
        <div className="grid grid-cols-3 gap-3">
          <button
            className="group flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-transparent hover:border-primary/50 hover:shadow-md active:scale-95 transition-all duration-200"
            onClick={() => handleAddWater(0.25)}
          >
            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-blue-500 dark:text-blue-300 group-hover:text-primary transition-colors">
                water_full
              </span>
            </div>
            <span className="text-text-main dark:text-white font-bold text-sm">
              +250ml
            </span>
          </button>

          <button
            className="group flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-transparent hover:border-primary/50 hover:shadow-md active:scale-95 transition-all duration-200"
            onClick={() => handleAddWater(0.5)}
          >
            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-blue-500 dark:text-blue-300 group-hover:text-primary transition-colors">
                water_bottle
              </span>
            </div>
            <span className="text-text-main dark:text-white font-bold text-sm">
              +500ml
            </span>
          </button>

          <button className="group flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-transparent hover:border-primary/50 hover:shadow-md active:scale-95 transition-all duration-200"
            onClick={() => handleAddWater(0.25)}
          >
            <div className="size-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 group-hover:text-primary transition-colors">
                local_cafe
              </span>
            </div>
            <span className="text-text-main dark:text-white font-bold text-sm">
              +Té/Café
            </span>
          </button>
        </div>

        {/* History Timeline */}
        <div className="flex flex-col gap-3">
          <h3 className="text-text-main dark:text-white font-bold text-base px-1">
            Historial de Hoy
          </h3>
          <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-4 text-center text-text-sub dark:text-gray-400 text-sm shadow-sm">
            El historial detallado estará disponible próximamente.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HydrationView;
