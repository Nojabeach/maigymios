import React from "react";
import { ScreenName } from "../types";
import { HealthDashboard } from "../components/HealthDashboard";

interface HealthViewProps {
  navigate: (screen: ScreenName) => void;
  toggleDarkMode: () => void;
}

const HealthView: React.FC<HealthViewProps> = ({
  navigate,
  toggleDarkMode,
}) => {
  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
            onClick={() => navigate(ScreenName.PROFILE)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Centro de Salud</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-primary-500"
        >
          <span className="material-symbols-outlined filled">dark_mode</span>
        </button>
      </header>

      <div className="flex flex-col gap-8 p-6 pb-24 animate-fade-in w-full max-w-lg mx-auto overflow-y-auto">
        {/* Intro */}
        <section className="px-1 text-center">
          <p className="text-[11px] font-black text-primary-500 uppercase tracking-widest mb-2">Sincronización Inteligente</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Tus Datos de Apple Health</h2>
          <p className="text-sm font-medium text-slate-400 mt-2">Visualiza tu actividad, sueño y salud cardiovascular en un solo lugar.</p>
        </section>

        <HealthDashboard />

        {/* Tip Section */}
        <section className="card-premium bg-slate-950 text-white p-6 relative overflow-hidden">
          <div className="relative z-10 flex gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined filled">lightbulb</span>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-1">Dato Clave</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Conectar tu Apple Watch permite a Vitality IA darte consejos mucho más precisos sobre tu recuperación.</p>
            </div>
          </div>
        </section>

        {/* Grid Info */}
        <section className="grid grid-cols-2 gap-4">
          {[
            { icon: 'bar_chart', title: 'Tendencias', desc: 'Análisis Semanal' },
            { icon: 'track_changes', title: 'Objetivos', desc: 'Personalizados' },
            { icon: 'history', title: 'Historial', desc: 'Última sinc. 5m' },
            { icon: 'encrypted', title: 'Privacidad', desc: '100% Protegido' }
          ].map((item, i) => (
            <div key={i} className="card-premium p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary-500">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Action Button */}
        <button
          className="w-full bg-primary-500 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary-500/20 active:scale-95 transition-all mt-4"
        >
          Sincronizar Datos Ahora
        </button>
      </div>
    </div>
  );
};

export default HealthView;
