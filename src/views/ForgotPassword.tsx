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
        <div className="flex h-full min-h-screen flex-col bg-background-light dark:bg-background-dark px-6 py-10 justify-center items-center text-center">
             <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-4xl">mark_email_read</span>
            </div>
            <h1 className="text-2xl font-extrabold text-text-main dark:text-white mb-2">¡Revisa tu correo!</h1>
            <p className="text-text-sub dark:text-gray-400 mb-8 max-w-xs">
                Hemos enviado las instrucciones para restablecer tu contraseña.
            </p>
            <button 
                onClick={() => navigate(ScreenName.LOGIN)}
                className="w-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
                Volver al inicio
            </button>
        </div>
      );
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-background-light dark:bg-background-dark px-6 py-10 justify-center">
      <button 
        onClick={() => navigate(ScreenName.LOGIN)}
        className="self-start mb-8 text-text-sub dark:text-gray-400 hover:text-primary flex items-center gap-1"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Volver
      </button>

      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Recuperar Acceso</h1>
        <p className="text-text-sub dark:text-gray-400">Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-text-sub dark:text-gray-500 ml-1">Email</label>
            <div className="relative">
                <span className="absolute left-4 top-3.5 material-symbols-outlined text-gray-400">mail</span>
                <input 
                    type="email" 
                    required
                    className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-text-main dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="maria@ejemplo.com"
                />
            </div>
        </div>

        <button 
            type="submit" 
            className="mt-4 w-full bg-primary hover:bg-primary-dark text-black font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
            Enviar Enlace
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordView;
