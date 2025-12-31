import React from "react";
import { ScreenName } from "../types";
import { ChallengesDashboard } from "../components/ChallengesUI";

interface ChallengesViewProps {
  navigate: (screen: ScreenName) => void;
  toggleDarkMode: () => void;
  userId?: string;
}

const ChallengesView: React.FC<ChallengesViewProps> = ({
  navigate,
  toggleDarkMode,
  userId,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Retos & Competencias
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Desafíate con amigos y gana premios
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
        <ChallengesDashboard userId={userId} />

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">🎯</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Retos Diarios
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Nuevos retos cada día
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">👥</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Multiplayer
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Compite con amigos
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">🏆</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Premios
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Gana puntos y badges
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl mb-2">🚀</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Progresión
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sube de nivel
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(ScreenName.HOME)}
          className="w-full mt-8 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default ChallengesView;
