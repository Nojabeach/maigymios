import React from "react";
import { IMAGES } from "../constants";

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="flex h-full min-h-screen flex-col bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Absolute Decorative elements */}
      <div className="absolute top-0 right-0 w-full h-[65%] z-0">
        <img
          src={IMAGES.ONBOARDING_HERO}
          className="w-full h-full object-cover brightness-105 saturate-110"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-white/50 dark:via-slate-950/50 to-transparent"></div>
      </div>

      {/* Top Action */}
      <div className="absolute top-0 left-0 w-full p-8 pt-14 flex justify-end z-20">
        <button
          onClick={onComplete}
          className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          Omitir
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-auto relative z-10 p-8 pb-16 flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <span className="w-10 h-1 rounded-full bg-primary-500"></span>
            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Premium Training</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Fitness a <br />tu Ritmo
          </h1>
          <p className="text-base font-medium text-slate-400 leading-relaxed max-w-[280px]">
            Entrenamientos en casa diseñados para potenciar tu cuerpo y renovar tu energía cada día.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            <div className="w-8 h-2 rounded-full bg-primary-500"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-primary-500 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-primary-500/30 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            Siguiente
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
};

export default OnboardingView;
