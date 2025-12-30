import React from "react";
import { IMAGES } from "../constants";

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark overflow-hidden sm:border-x sm:border-gray-200 dark:sm:border-gray-800">
      {/* Decorative Background Blur */}
      <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Top Bar: Skip Action */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-end p-6 pt-12 sm:pt-8">
        <button
          className="group flex items-center justify-center gap-1 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md px-4 py-2 transition-all hover:bg-white/80 dark:hover:bg-black/40"
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
      <div className="relative h-[60%] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url("${IMAGES.ONBOARDING_HERO}")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light dark:to-background-dark"></div>
      </div>

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col justify-between px-8 pb-10 -mt-8 z-10">
        <div className="flex flex-col gap-2">
          <div className="w-fit rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 px-3 py-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary">
              Personalizado
            </p>
          </div>
          <h1 className="text-[#102210] dark:text-white text-[36px] font-extrabold leading-[1.1] tracking-tight">
            Fitness <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102210] to-[#102210]/60 dark:from-white dark:to-white/60">
              a tu Ritmo
            </span>
          </h1>
          <p className="text-[#102210]/70 dark:text-gray-300 text-lg font-normal leading-relaxed mt-3">
            Ejercicios en casa diseñados específicamente para potenciar tu
            cuerpo y renovar tu energía.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <div className="h-2 w-8 rounded-full bg-primary shadow-glow transition-all duration-300"></div>
            <div className="h-2 w-2 rounded-full bg-[#102210]/10 dark:bg-white/20"></div>
            <div className="h-2 w-2 rounded-full bg-[#102210]/10 dark:bg-white/20"></div>
          </div>

          <button
            className="rounded-2xl bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all duration-200 py-4 px-6 flex items-center justify-center group shadow-lg shadow-primary/20"
            onClick={onComplete}
          >
            <span className="text-[#102210] text-lg font-bold mr-2">
              Siguiente
            </span>
            <span className="material-symbols-outlined text-[#102210] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
