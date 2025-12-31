import React from 'react';
import { supabase } from '../supabaseClient';

const SocialAuth: React.FC = () => {
    const [socialLoading, setSocialLoading] = React.useState<'google' | 'apple' | null>(null);

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        setSocialLoading(provider);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error: any) {
            console.error(`OAuth Error [${provider}]:`, error);
            alert(`Error: El proveedor ${provider} no está configurado en tu panel de Supabase aún. Debes añadir las credenciales en el Dashboard de Supabase.`);
        } finally {
            setSocialLoading(null);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-8">
            <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                <span className="absolute px-4 bg-white dark:bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">O continúa con</span>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => handleSocialLogin('google')}
                    disabled={!!socialLoading}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all group disabled:opacity-50"
                >
                    {socialLoading === 'google' ? (
                        <span className="material-symbols-outlined animate-spin text-primary-500">progress_activity</span>
                    ) : (
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    )}
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Google</span>
                </button>

                <button
                    onClick={() => handleSocialLogin('apple')}
                    disabled={!!socialLoading}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all group disabled:opacity-50"
                >
                    {socialLoading === 'apple' ? (
                        <span className="material-symbols-outlined animate-spin text-slate-900 dark:text-white">progress_activity</span>
                    ) : (
                        <svg className="w-5 h-5 fill-current text-slate-900 dark:text-white" viewBox="0 0 384 512">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.1 24.5-.8 35.3-15.5 65.8-15.5s40.5 15.5 66.2 15.5c48.2 0 88.6-86.2 101.5-121.1-61.9-25.7-80.2-90.1-80.4-118c-.1-.3-.1-.6-.1-1zM232 56c.1-41.5 35-74.8 74.2-76 2 42-32.8 81.2-74.2 76z" />
                        </svg>
                    )}
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Apple</span>
                </button>
            </div>
        </div>
    );
};

export default SocialAuth;
