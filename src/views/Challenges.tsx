import React from "react";
import { ScreenName } from "../types";
import { ChallengesDashboard } from "../components/ChallengesUI";

interface ChallengesViewProps {
  navigate: (screen: ScreenName) => void;
  toggleDarkMode: () => void;
  userId?: string;
}

const ChallengesView: React.FC<ChallengesViewProps> = ({
  navigate,
  toggleDarkMode,
  userId,
}) => {
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
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Desafíos</h1>
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
          <p className="text-[11px] font-black text-primary-500 uppercase tracking-widest mb-2">Comunidad Vitality</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Retos & Competencias</h2>
          <p className="text-sm font-medium text-slate-400 mt-2">Pon a prueba tus límites y compite con la comunidad para ganar badges exclusivos.</p>
        </section>

        <ChallengesDashboard userId={userId} />

        {/* Features Grid */}
        <section className="grid grid-cols-2 gap-4">
          {[
            { icon: 'target', title: 'Retos Diarios', desc: 'Nuevos cada mañana' },
            { icon: 'groups', title: 'Multiplayer', desc: 'Compite con amigos' },
            { icon: 'military_tech', title: 'Premios', desc: 'Gana puntos y badges' },
            { icon: 'rocket_launch', title: 'Progresión', desc: 'Sube de nivel élite' }
          ].map((item, i) => (
            <div key={i} className="card-premium p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Motivational Banner */}
        <section className="card-premium bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-strong">
          <h4 className="font-black text-lg mb-1">¡Nuevo Reto Global!</h4>
          <p className="text-xs text-white/80 leading-relaxed mb-4">Únete a los 10,000 pasos diarios esta semana y desbloquea el badge "Explorador Pro".</p>
          <button className="bg-white text-purple-600 font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest shadow-lg active:scale-95 transition-all">
            Aceptar Desafío
          </button>
        </section>

        <button
          className="w-full bg-slate-50 dark:bg-slate-900 text-slate-400 font-black py-5 rounded-[2rem] active:scale-95 transition-all"
          onClick={() => navigate(ScreenName.HOME)}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ChallengesView;
