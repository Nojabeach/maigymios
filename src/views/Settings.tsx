import React, { useState, useEffect } from "react";
import { ScreenName } from "../types";

interface SettingsProps {
  navigate: (screen: ScreenName) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ navigate }) => {
  // Inicializar estado desde LocalStorage o por defecto
  const [pushEnabled, setPushEnabled] = useState(() => {
    return localStorage.getItem("setting_pushEnabled") === "true";
  });
  const [hydrationReminder, setHydrationReminder] = useState(() => {
    const val = localStorage.getItem("setting_hydrationReminder");
    return val ? val === "true" : true;
  });
  const [workoutReminder, setWorkoutReminder] = useState(() => {
    return localStorage.getItem("setting_workoutReminder") === "true";
  });

  // Guardar cambios cuando ocurren
  useEffect(() => {
    localStorage.setItem("setting_pushEnabled", String(pushEnabled));
  }, [pushEnabled]);
  useEffect(() => {
    localStorage.setItem(
      "setting_hydrationReminder",
      String(hydrationReminder)
    );
  }, [hydrationReminder]);
  useEffect(() => {
    localStorage.setItem("setting_workoutReminder", String(workoutReminder));
  }, [workoutReminder]);

  const requestPermission = () => {
    // Simular petición real de iOS
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setPushEnabled(true);
          alert("¡Notificaciones activadas!");
        } else {
          alert(
            "Permiso denegado. Por favor habilítalo en los ajustes de tu iPhone."
          );
        }
      });
    } else {
      // Fallback demo
      setPushEnabled(!pushEnabled);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto overflow-x-hidden pb-10 bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background-light/80 dark:bg-background-dark/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center p-4 justify-between h-[52px]">
          <button
            className="text-primary flex items-center justify-center -ml-2 p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined text-[28px]">
              chevron_left
            </span>
            <span className="text-base font-medium ml-[-4px]">Volver</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">
            Ajustes
          </h2>
        </div>
      </header>

      <main className="flex-1 px-4 py-2 w-full flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider ml-4">
            Notificaciones Push
          </h3>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm transition-colors duration-200">
            <div className="group flex items-center gap-4 px-4 py-3.5">
              <div className="flex items-center justify-center rounded-lg bg-cyan-400 shrink-0 size-8 text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  water_drop
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-base font-normal leading-tight dark:text-white">
                  Recordatorios de Agua
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  checked={hydrationReminder}
                  onChange={() => setHydrationReminder(!hydrationReminder)}
                  className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#e5e7eb] dark:border-[#374151] checked:border-primary transition-all duration-300 left-0 checked:left-5 top-0 z-10 shadow-sm"
                  type="checkbox"
                />
                <label className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer transition-colors duration-300"></label>
              </div>
            </div>

            <div className="h-[0.5px] bg-gray-200 dark:bg-gray-700 mx-4"></div>

            <div className="group flex items-center gap-4 px-4 py-3.5">
              <div className="flex items-center justify-center rounded-lg bg-green-500 shrink-0 size-8 text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  fitness_center
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-base font-normal leading-tight dark:text-white">
                  Rutinas Sugeridas
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  checked={workoutReminder}
                  onChange={() => setWorkoutReminder(!workoutReminder)}
                  className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#e5e7eb] dark:border-[#374151] checked:border-primary transition-all duration-300 left-0 checked:left-5 top-0 z-10 shadow-sm"
                  type="checkbox"
                />
                <label className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer transition-colors duration-300"></label>
              </div>
            </div>

            <div className="h-[0.5px] bg-gray-200 dark:bg-gray-700 mx-4"></div>

            <button
              onClick={requestPermission}
              className="w-full text-left group flex items-center gap-4 px-4 py-3.5 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-center rounded-lg bg-purple-500 shrink-0 size-8 text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  notifications_active
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-base font-normal leading-tight dark:text-white">
                  Probar Notificación
                </p>
                <p className="text-xs text-text-sub dark:text-gray-400">
                  Simular envío inmediato
                </p>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-600">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider ml-4">
            General
          </h3>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm transition-colors duration-200">
            <div className="group flex items-center gap-4 px-4 py-3.5 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
              <div className="flex items-center justify-center rounded-lg bg-blue-500 shrink-0 size-8 text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  credit_card
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-base font-normal leading-tight dark:text-white">
                  Gestionar Suscripción
                </p>
                <p className="text-xs text-primary font-medium">
                  Plan Premium Activo
                </p>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-600">
                chevron_right
              </span>
            </div>
            <div className="h-[0.5px] bg-gray-200 dark:bg-gray-700 mx-4"></div>
            <div className="group flex items-center gap-4 px-4 py-3.5 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
              <div className="flex items-center justify-center rounded-lg bg-orange-400 shrink-0 size-8 text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  restaurant
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-base font-normal leading-tight dark:text-white">
                  Preferencias Dietéticas
                </p>
              </div>
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-600">
                chevron_right
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-text-sub dark:text-gray-500 font-medium">
            Vitality AI v2.3.0
          </p>
        </div>
      </main>

      <style>{`
        .toggle-checkbox:checked {
            right: 0;
            border-color: #22c55e;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #22c55e;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SettingsView;
