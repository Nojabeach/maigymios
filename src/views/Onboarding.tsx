import React from "react";
import { IMAGES } from "../constants";

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    {
      title: "Fitness a tu Ritmo",
      description: "Entrenamientos en casa diseñados para potenciar tu cuerpo y renovar tu energía cada día.",
      image: IMAGES.ONBOARDING_HERO,
      tag: "Premium Training"
    },
    {
      title: "Nutrición con IA",
      description: "Monitorea lo que comes y recibe consejos personalizados para equilibrar tu dieta diaria.",
      image: IMAGES.MEAL_SALAD,
      tag: "Smart Nutrition"
    },
    {
      title: "Tu Coach Vital",
      description: "Habla con nuestro avanzado asistente IA para resolver dudas y optimizar tus metas.",
      image: IMAGES.AI_COACH,
      tag: "AI Coaching"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="flex h-full min-h-screen flex-col bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Absolute Decorative elements */}
      <div className="absolute top-0 right-0 w-full h-[65%] z-0 transition-opacity duration-1000">
        <img
          key={currentStep}
          src={step.image}
          className="w-full h-full object-cover brightness-105 saturate-110 animate-fade-in"
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
        <div key={currentStep} className="flex flex-col gap-5 animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="w-10 h-1 rounded-full bg-primary-500"></span>
            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none">{step.tag}</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {step.title.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word} {i === 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-base font-medium text-slate-400 leading-relaxed max-w-[280px]">
            {step.description}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-500 rounded-full h-2 ${i === currentStep ? 'w-8 bg-primary-500' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}
              ></div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-primary-500 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-primary-500/30 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            {currentStep === steps.length - 1 ? 'Empezar ahora' : 'Siguiente'}
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
