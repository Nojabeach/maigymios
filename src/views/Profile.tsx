import React, { useState } from 'react';
import { ScreenName } from '../types';
import { IMAGES } from '../constants';
import { supabase } from '../supabaseClient';

interface ProfileProps {
  navigate: (screen: ScreenName) => void;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileProps> = ({ navigate, toggleDarkMode, onLogout }) => {
  const [showHistory, setShowHistory] = useState(false);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="relative flex h-full flex-col bg-surface-light dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <button 
          className="flex size-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          onClick={() => navigate(ScreenName.HOME)}
        >
          <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Mi Perfil</h2>
        <button 
          className="flex h-10 px-3 items-center justify-center rounded-full hover:bg-primary/10 active:bg-primary/20 transition-colors"
          onClick={toggleDarkMode}
        >
          <span className="material-symbols-outlined text-primary-dark dark:text-primary">dark_mode</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex p-4 flex-col gap-4 items-center">
        <div className="flex gap-4 flex-col items-center">
          <div className="relative group cursor-pointer transition-transform active:scale-95">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 shadow-lg ring-4 ring-white dark:ring-surface-dark" 
                 style={{ backgroundImage: `url("${IMAGES.USER_AVATAR}")` }}></div>
            <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-white dark:border-background-dark flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-black text-[18px]">edit</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="text-text-main dark:text-white text-2xl font-bold leading-tight text-center">Maria González</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-green-800 dark:text-green-100">
                Miembro Activo
              </span>
              <p className="text-text-sub dark:text-gray-400 text-sm font-normal text-center">Unida en 2023</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 gap-6 pb-24">
        <section className="animate-fade-in">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight">Métricas Corporales</h3>
            <button 
                onClick={() => setShowHistory(true)}
                className="text-primary-dark dark:text-primary text-sm font-semibold hover:underline"
            >
                Historial
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 relative group">
              <div className="flex justify-between items-start">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined text-[20px]">cake</span>
                </div>
              </div>
              <div>
                <p className="text-text-sub dark:text-gray-400 text-sm font-medium mb-1">Edad</p>
                <p className="text-text-main dark:text-white text-2xl font-bold tracking-tight">52 <span className="text-sm font-normal text-gray-500">años</span></p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 relative group">
              <div className="flex justify-between items-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-[20px]">height</span>
                </div>
              </div>
              <div>
                <p className="text-text-sub dark:text-gray-400 text-sm font-medium mb-1">Altura</p>
                <p className="text-text-main dark:text-white text-2xl font-bold tracking-tight">165 <span className="text-sm font-normal text-gray-500">cm</span></p>
              </div>
            </div>

            <div className="col-span-2 flex flex-row items-center justify-between gap-4 rounded-2xl p-5 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-primary/20 p-1.5 rounded-lg text-green-700 dark:text-green-300">
                    <span className="material-symbols-outlined text-[20px]">monitor_weight</span>
                  </div>
                  <p className="text-text-sub dark:text-gray-400 text-sm font-medium">Peso Actual</p>
                </div>
                <p className="text-text-main dark:text-white text-3xl font-bold tracking-tight">68.5 <span className="text-lg font-normal text-gray-500">kg</span></p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 p-2 rounded-xl">
                <button className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm text-text-main dark:text-white active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-gray-600">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <button className="size-10 flex items-center justify-center rounded-lg bg-primary text-black shadow-lg shadow-primary/30 active:scale-95 transition-transform hover:bg-primary-dark">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight pb-3">Mi "Porqué"</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="cursor-pointer relative overflow-hidden rounded-2xl bg-primary/10 border-2 border-primary p-4 flex flex-col gap-2 transition-all active:scale-[0.98]">
              <div className="absolute top-2 right-2">
                <span className="material-symbols-outlined text-primary text-[20px] bg-white rounded-full">check_circle</span>
              </div>
              <span className="material-symbols-outlined text-green-800 dark:text-green-400 text-[28px]">fitness_center</span>
              <p className="text-sm font-bold text-text-main dark:text-white">Ganar Fuerza</p>
            </div>
            
            <div className="cursor-pointer rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2 hover:border-gray-300 dark:hover:border-gray-500 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined text-gray-400 text-[28px]">self_improvement</span>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Flexibilidad</p>
            </div>
          </div>
        </section>
        
        <button 
          className="w-full bg-surface-light dark:bg-surface-dark text-red-500 font-bold py-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-4 active:scale-[0.98] transition-transform hover:bg-red-50 dark:hover:bg-red-900/10"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* History Modal Overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold dark:text-white">Progreso de Peso</h3>
                    <button 
                        onClick={() => setShowHistory(false)}
                        className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined dark:text-white">close</span>
                    </button>
                </div>
                
                {/* Mock Chart */}
                <div className="h-48 flex items-end justify-between gap-2 mb-6 px-2">
                    {[72, 71.5, 71, 70.2, 69.8, 69, 68.5].map((val, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                            <div 
                                className="w-full bg-primary/30 dark:bg-primary/20 rounded-t-lg relative group-hover:bg-primary transition-colors"
                                style={{ height: `${((val - 65) / 10) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val}kg
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400">{['L','M','X','J','V','S','D'][i]}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-700 dark:text-primary">trending_down</span>
                    <div>
                        <p className="text-sm font-bold text-green-900 dark:text-green-100">¡Tendencia Positiva!</p>
                        <p className="text-xs text-green-800 dark:text-green-200/70">Has bajado 3.5kg este mes. Sigue así.</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowHistory(false)}
                    className="w-full mt-6 bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-primary-dark transition-colors"
                >
                    Entendido
                </button>
            </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default ProfileView;