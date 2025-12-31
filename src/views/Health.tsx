import React from "react";
import { ScreenName } from "../types";
import { HealthDashboard } from "../components/HealthDashboard";

interface HealthViewProps {
  navigate: (screen: ScreenName) => void;
  toggleDarkMode: () => void;
}

const HealthView: React.FC<HealthViewProps> = ({
  navigate,
  toggleDarkMode,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Centro de Salud
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Datos sincronizados desde Apple Health
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            🌙
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <HealthDashboard />

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            💡 <strong>Tip:</strong> Conecta tu Apple Health para ver datos
            reales de tu actividad, sueño y frecuencia cardíaca. Los datos se
            sincronizan automáticamente cuando actualizas esta vista.
          </p>
        </div>

        {/* Features Info */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">📊</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Gráficos Detallados
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Visualiza tendencias semanales
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">🎯</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Metas Personalizadas
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Establece y monitorea objetivos
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">⏱️</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Historial Completo
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Última sinc. hace 5 min
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">🔐</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Privacidad Total
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tus datos están protegidos
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(ScreenName.PROFILE)}
          className="w-full mt-8 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default HealthView;
