import React from "react";
import { IMAGES } from "../constants";

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark overflow-hidden sm:border-x sm:border-gray-200 dark:sm:border-gray-800">
      {/* Decorative Background Blur */}
      <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* Top Bar: Skip Action */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-end p-6 pt-12 sm:pt-8">
        <button
          className="group flex items-center justify-center gap-1 rounded-full bg-white/70 dark:bg-black/30 backdrop-blur-md px-4 py-2 transition-all hover:bg-white/90 dark:hover:bg-black/50 shadow-lg"
          onClick={onComplete}
        >
          <span className="text-[#102210] dark:text-white text-sm font-semibold tracking-wide">
            Omitir
          </span>
          <span className="material-symbols-outlined text-[#102210] dark:text-white text-[18px]">
            chevron_right
          </span>
        </button>
      </div>

      {/* Main Image Area */}
      <div className="relative h-[60%] w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        <img
          src={IMAGES.ONBOARDING_HERO}
          alt="Fitness a tu ritmo"
          className="absolute inset-0 w-full h-full object-cover brightness-105 saturate-125 contrast-110"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light dark:to-background-dark"></div>
      </div>

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col justify-between px-8 pb-12 -mt-6 z-10">
        <div className="flex flex-col gap-4">
          <div className="w-fit rounded-full bg-primary/15 dark:bg-primary/25 border border-primary/30 px-4 py-2 mb-2 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary/90">
              ✨ Personalizado
            </p>
          </div>
          <h1 className="text-[#102210] dark:text-white text-4xl font-black leading-tight tracking-tight">
            Fitness <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80 dark:from-primary dark:via-primary dark:to-primary/70">
              a tu Ritmo
            </span>
          </h1>
          <p className="text-[#102210]/75 dark:text-gray-200 text-base font-medium leading-relaxed mt-2">
            Ejercicios en casa diseñados específicamente para potenciar tu
            cuerpo y renovar tu energía.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex w-full flex-row items-center justify-start gap-3">
            <div className="h-2.5 w-10 rounded-full bg-primary shadow-lg shadow-primary/40 transition-all duration-300"></div>
            <div className="h-2 w-2 rounded-full bg-[#102210]/15 dark:bg-white/25"></div>
            <div className="h-2 w-2 rounded-full bg-[#102210]/15 dark:bg-white/25"></div>
          </div>

          <button
            className="rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary active:scale-95 transition-all duration-200 py-5 px-8 flex items-center justify-center group shadow-xl shadow-primary/30 font-bold text-base"
            onClick={onComplete}
          >
            <span className="text-white dark:text-[#102210]">Siguiente</span>
            <span className="material-symbols-outlined text-white dark:text-[#102210] ml-2 group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
