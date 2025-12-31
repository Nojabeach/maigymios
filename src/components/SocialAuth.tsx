import React from 'react';
import { supabase } from '../supabaseClient';

const SocialAuth: React.FC = () => {
    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error: any) {
            alert(error.message || `Error al iniciar sesión con ${provider}`);
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
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all group"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Google</span>
                </button>

                <button
                    onClick={() => handleSocialLogin('apple')}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all group"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">apple</span>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Apple</span>
                </button>
            </div>
        </div>
    );
};

export default SocialAuth;
