import React from 'react';
import { supabase } from '../supabaseClient';

const SocialAuth: React.FC = () => {
    const [socialLoading, setSocialLoading] = React.useState<'google' | null>(null);

    const handleSocialLogin = async (provider: 'google') => {
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
            alert(`Error: El proveedor ${provider} no está configurado correctamente en tu panel de Supabase.`);
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
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all group disabled:opacity-50"
                >
                    {socialLoading === 'google' ? (
                        <span className="material-symbols-outlined animate-spin text-primary-500">progress_activity</span>
                    ) : (
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    )}
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Google</span>
                </button>
            </div>
        </div>
    );
};

export default SocialAuth;
