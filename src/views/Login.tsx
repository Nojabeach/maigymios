import React, { useState } from 'react';
import { ScreenName } from '../types';
import { supabase } from '../supabaseClient';

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
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background-light dark:bg-background-dark px-6 py-10 justify-center">
      <div className="flex flex-col gap-2 mb-10">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-glow">
            <span className="material-symbols-outlined text-black text-3xl">spa</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Bienvenida de nuevo</h1>
        <p className="text-text-sub dark:text-gray-400">Ingresa tus datos para continuar tu progreso.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-text-sub dark:text-gray-500 ml-1">Email</label>
            <div className="relative">
                <span className="absolute left-4 top-3.5 material-symbols-outlined text-gray-400">mail</span>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-text-main dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="maria@ejemplo.com"
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-text-sub dark:text-gray-500 ml-1">Contraseña</label>
            <div className="relative">
                <span className="absolute left-4 top-3.5 material-symbols-outlined text-gray-400">lock</span>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-text-main dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                />
            </div>
            <div className="flex justify-end pt-1">
                <button type="button" onClick={() => navigate(ScreenName.FORGOT_PASSWORD)} className="text-sm font-medium text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </div>
        
        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

        <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-primary hover:bg-primary-dark text-black font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
        >
            {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-text-sub dark:text-gray-400">
            ¿No tienes cuenta?{' '}
            <button onClick={() => navigate(ScreenName.REGISTER)} className="font-bold text-text-main dark:text-white hover:text-primary transition-colors">
                Regístrate gratis
            </button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
