import React from 'react';
import { ScreenName } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigate }) => {
  const getIconClass = (screen: ScreenName) => {
    const isActive = currentScreen === screen;
    return `flex flex-col items-center gap-1.5 w-14 py-2 px-2 rounded-xl transition-smooth ${
      isActive 
      ? 'text-primary bg-primary/10 dark:bg-primary/20 scale-110' 
      : 'text-gray-500 dark:text-gray-400 hover:text-text-main dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-dark'
    }`;
  };

  const navItems = [
    { screen: ScreenName.HOME, icon: 'home', label: 'Inicio' },
    { screen: ScreenName.WORKOUT, icon: 'fitness_center', label: 'Entrenar' },
    { screen: ScreenName.NUTRITION, icon: 'restaurant', label: 'Nutrición' },
    { screen: ScreenName.HYDRATION, icon: 'water_drop', label: 'Agua' },
    { screen: ScreenName.PROFILE, icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:static w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 px-2 py-2 flex justify-between items-center z-50 md:justify-center md:gap-2 md:py-4 md:border-t-0 md:border-b">
      {navItems.map((item) => (
        <button
          key={item.screen}
          className={getIconClass(item.screen)}
          onClick={() => navigate(item.screen)}
          aria-label={item.label}
          title={item.label}
        >
          <span className={`material-symbols-outlined text-xl ${currentScreen === item.screen ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-semibold tracking-tight hidden md:block">
            {item.label}
          </span>
        </button>
      ))}

      {/* Chat FAB */}
      <div className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto md:ml-auto">
        <button
          className="bg-gradient-primary text-white p-4 rounded-full shadow-lg shadow-primary/40 hover:scale-110 transition-smooth active:scale-95 md:p-3 md:rounded-lg"
          onClick={() => navigate(ScreenName.CHAT)}
          title="Chat con IA"
        >
          <span className="material-symbols-outlined text-3xl md:text-xl">smart_toy</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
