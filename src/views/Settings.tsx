import React, { useState, useEffect } from "react";
import { ScreenName } from "../types";

interface SettingsProps {
  navigate: (screen: ScreenName) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ navigate }) => {
  const [hydrationReminder, setHydrationReminder] = useState(() => localStorage.getItem("setting_hydrationReminder") !== "false");
  const [workoutReminder, setWorkoutReminder] = useState(() => localStorage.getItem("setting_workoutReminder") === "true");
  const [mfaEnabled, setMfaEnabled] = useState(() => localStorage.getItem("setting_mfa") === "true");
  const [captchaEnabled, setCaptchaEnabled] = useState(() => localStorage.getItem("setting_captcha") === "true");


  useEffect(() => {
    localStorage.setItem("setting_mfa", String(mfaEnabled));
  }, [mfaEnabled]);

  useEffect(() => {
    localStorage.setItem("setting_captcha", String(captchaEnabled));
  }, [captchaEnabled]);

  const toggleHydration = () => setHydrationReminder(!hydrationReminder);
  const toggleWorkout = () => setWorkoutReminder(!workoutReminder);
  const toggleMfa = () => setMfaEnabled(!mfaEnabled);
  const toggleCaptcha = () => setCaptchaEnabled(!captchaEnabled);


  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all font-black text-xs"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ajustes</h1>
        </div>
      </header>

      <div className="flex flex-col gap-10 p-6 pb-24 animate-fade-in w-full max-w-lg mx-auto overflow-y-auto">

        {/* Notifications Section */}
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Notificaciones Push</h3>
          <div className="card-premium overflow-hidden border-none p-0 divide-y divide-slate-100 dark:divide-slate-800/50">
            <div className="flex items-center justify-between p-5 group cursor-pointer" onClick={toggleHydration}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined filled">water_drop</span>
                </div>
                <p className="font-black text-slate-900 dark:text-white">Recordatorios de Agua</p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${hydrationReminder ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${hydrationReminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 group cursor-pointer" onClick={toggleWorkout}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center">
                  <span className="material-symbols-outlined filled">fitness_center</span>
                </div>
                <p className="font-black text-slate-900 dark:text-white">Rutinas Sugeridas</p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${workoutReminder ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${workoutReminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Seguridad Avanzada</h3>
          <div className="card-premium overflow-hidden border-none p-0 divide-y divide-slate-100 dark:divide-slate-800/50">
            <div className="flex items-center justify-between p-5 group cursor-pointer" onClick={toggleMfa}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center">
                  <span className="material-symbols-outlined filled">verified_user</span>
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white leading-none">Doble Factor (MFA)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Extra seguridad por SMS o App</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${mfaEnabled ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${mfaEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 group cursor-pointer" onClick={toggleCaptcha}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center">
                  <span className="material-symbols-outlined filled">security</span>
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white leading-none">Bot Protection</p>
                  <p className="text-[10px] text-slate-400 mt-1">ReCaptcha en accesos sensibles</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${captchaEnabled ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${captchaEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </section>


        {/* Account Section */}
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Mi Suscripción</h3>
          <div className="card-premium p-6 bg-slate-900 text-white relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10">
              <h4 className="font-black text-lg">Vitality Elite</h4>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">Plan Familiar • Activo</p>
            </div>
            <button className="relative z-10 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md">Gestionar</button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-[50px] translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </section>

        {/* More Options */}
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">General</h3>
          <div className="card-premium overflow-hidden border-none p-0 divide-y divide-slate-100 dark:divide-slate-800/50">
            {[
              { icon: 'restaurant', title: 'Preferencias Dietéticas', color: 'orange' },
              { icon: 'share', title: 'Compartir con Amigos', color: 'blue' },
              { icon: 'help', title: 'Ayuda y Soporte', color: 'slate' },
              { icon: 'privacy_tip', title: 'Privacidad y Seguridad', color: 'red' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 group hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-900/30 text-${item.color}-500 flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <p className="font-black text-slate-900 dark:text-white">{item.title}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center mt-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Vitality App v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
