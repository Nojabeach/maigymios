import React, { useState } from 'react';
import { ScreenName } from '../types';
import { supabase } from '../supabaseClient';
import SocialAuth from '../components/SocialAuth';


interface LoginProps {
  onLogin: () => void;
  navigate: (screen: ScreenName) => void;
}

const LoginView: React.FC<LoginProps> = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });
      if (authError) throw authError;
      if (data.session) onLogin();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-white dark:bg-slate-950 px-8 py-12 justify-center relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>

      <div className="flex flex-col gap-3 mb-10 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center mb-4 shadow-2xl">
          <span className="material-symbols-outlined text-white dark:text-slate-900 text-3xl filled">spa</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Bienvenida de nuevo</h1>
        <p className="text-sm font-medium text-slate-400">Tu progreso te espera. Ingresa para continuar cuidando de ti.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary-500 transition-colors">mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-slate-900 dark:text-white font-bold outline-none ring-2 ring-transparent focus:ring-primary-500/30 transition-all placeholder:text-slate-300"
              placeholder="Tu correo electrónico"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contraseña</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary-500 transition-colors">lock</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-slate-900 dark:text-white font-bold outline-none ring-2 ring-transparent focus:ring-primary-500/30 transition-all placeholder:text-slate-300"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button type="button" onClick={() => navigate(ScreenName.FORGOT_PASSWORD)} className="text-[11px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-600 transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-primary-500 text-white font-black text-lg py-5 rounded-[2rem] shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-3"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <>
              Entrar a Mi Espacio
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <SocialAuth />


      <div className="mt-12 text-center relative z-10 flex flex-col gap-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
          ¿Aún no eres parte? <br />
          <button onClick={() => navigate(ScreenName.REGISTER)} className="text-slate-900 dark:text-white font-black hover:text-primary-500 transition-colors mt-2 text-sm">
            Crea tu cuenta gratis
          </button>
        </p>

        <button
          onClick={() => navigate(ScreenName.ONBOARDING)}
          className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] hover:text-primary-500 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          Ver Presentación
        </button>
      </div>
    </div>
  );
};

export default LoginView;
