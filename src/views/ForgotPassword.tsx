import React, { useState } from 'react';
import { ScreenName } from '../types';

interface ForgotPasswordProps {
  navigate: (screen: ScreenName) => void;
}

const ForgotPasswordView: React.FC<ForgotPasswordProps> = ({ navigate }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full min-h-screen flex-col bg-white dark:bg-slate-950 px-8 py-12 justify-center items-center text-center relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]"></div>

        <div className="w-24 h-24 rounded-[2rem] bg-primary-500/10 flex items-center justify-center mb-8 text-primary-500 shadow-inner">
          <span className="material-symbols-outlined text-5xl filled">mark_email_read</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">¡Email Enviado!</h1>
        <p className="text-sm font-medium text-slate-400 mb-10 max-w-xs leading-relaxed">
          Hemos enviado las instrucciones para restablecer tu contraseña a tu correo electrónico.
        </p>
        <button
          onClick={() => navigate(ScreenName.LOGIN)}
          className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-white dark:bg-slate-950 px-8 py-12 justify-center relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]"></div>

      <div className="flex flex-col gap-3 mb-10 relative z-10">
        <button
          onClick={() => navigate(ScreenName.LOGIN)}
          className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 mb-4 active:scale-90 transition-all font-black text-xs"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Recuperar Acceso</h1>
        <p className="text-sm font-medium text-slate-400">Introduce tu email y te enviaremos un enlace seguro para restablecer tu cuenta.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Registrado</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary-500 transition-colors">mail</span>
            <input
              type="email"
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-slate-900 dark:text-white font-bold outline-none ring-2 ring-transparent focus:ring-primary-500/30 transition-all placeholder:text-slate-300"
              placeholder="Tu correo de Vitality"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-primary-500 text-white font-black text-lg py-5 rounded-[2rem] shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          Enviar Enlace Seguro
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordView;
