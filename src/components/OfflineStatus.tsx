/**
 * Offline Status Components
 * Display offline status and sync progress
 */

import React, { useState, useEffect } from "react";
import { offlineSyncService } from "../utils/offlineSync";

interface OfflineStatusBadgeProps {
  variant?: "banner" | "badge" | "card";
}

export const OfflineStatusBadge: React.FC<OfflineStatusBadgeProps> = ({
  variant = "banner",
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({
    pendingOperations: 0,
    failedOperations: 0,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Update sync status periodically
    const statusInterval = setInterval(() => {
      const status = offlineSyncService.getSyncStatus();
      setSyncStatus({
        pendingOperations: status.pendingOperations,
        failedOperations: status.failedOperations,
      });
    }, 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(statusInterval);
    };
  }, []);

  if (isOnline && syncStatus.pendingOperations === 0) {
    return null; // No badge needed when online with no pending operations
  }

  if (variant === "banner") {
    if (!isOnline) {
      return (
        <div className="bg-amber-500 text-white text-xs py-2 px-4 text-center font-semibold sticky top-0 z-[60] animate-pulse">
          📡 Sin conexión. Los cambios se guardarán cuando se restablezca la
          conexión.
        </div>
      );
    }

    if (syncStatus.pendingOperations > 0) {
      return (
        <div className="bg-blue-500 text-white text-xs py-2 px-4 text-center font-semibold sticky top-0 z-[60] animate-pulse">
          🔄 Sincronizando {syncStatus.pendingOperations} cambio
          {syncStatus.pendingOperations !== 1 ? "s" : ""}...
        </div>
      );
    }
  }

  if (variant === "badge") {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-amber-500"
          } animate-pulse`}
        />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {isOnline ? "En línea" : "Sin conexión"}
        </span>
        {syncStatus.pendingOperations > 0 && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
            {syncStatus.pendingOperations} pendiente
          </span>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Estado de Sincronización
          </h3>
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? "bg-green-500" : "bg-amber-500"
            }`}
          />
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Conexión:</strong>{" "}
            <span className={isOnline ? "text-green-600" : "text-amber-600"}>
              {isOnline ? "En línea" : "Sin conexión"}
            </span>
          </p>

          <p className="text-gray-600 dark:text-gray-400">
            <strong>Cambios pendientes:</strong> {syncStatus.pendingOperations}
          </p>

          {syncStatus.failedOperations > 0 && (
            <p className="text-red-600 dark:text-red-400">
              <strong>Cambios fallidos:</strong> {syncStatus.failedOperations}
            </p>
          )}

          {isOnline && syncStatus.pendingOperations > 0 && (
            <p className="text-xs text-blue-600 dark:text-blue-400 animate-pulse">
              🔄 Sincronizando...
            </p>
          )}
        </div>

        {syncStatus.failedOperations > 0 && (
          <button
            onClick={async () => {
              await offlineSyncService.forceSync();
            }}
            className="w-full mt-3 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg active:scale-95 transition-transform"
          >
            Reintentar Sincronización
          </button>
        )}
      </div>
    );
  }

  return null;
};

interface SyncProgressProps {
  onSyncComplete?: () => void;
}

export const SyncProgress: React.FC<SyncProgressProps> = ({
  onSyncComplete,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    setIsSyncing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      await offlineSyncService.forceSync();
      setProgress(100);
      onSyncComplete?.();
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSyncing(false);
        setProgress(0);
      }, 500);
    }
  };

  if (!isSyncing && progress === 0) {
    return (
      <button
        onClick={handleSync}
        disabled={!navigator.onLine}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg active:scale-95 transition-transform disabled:cursor-not-allowed"
      >
        🔄 Sincronizar Ahora
      </button>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Sincronizando...
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface OfflineDashboardProps {
  onClearData?: () => void;
}

export const OfflineDashboard: React.FC<OfflineDashboardProps> = ({
  onClearData,
}) => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    pendingOperations: 0,
    failedOperations: 0,
  });

  useEffect(() => {
    const updateStatus = () => {
      const syncStatus = offlineSyncService.getSyncStatus();
      setStatus({
        isOnline: syncStatus.isOnline,
        pendingOperations: syncStatus.pendingOperations,
        failedOperations: syncStatus.failedOperations,
      });
    };

    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const statusInterval = setInterval(updateStatus, 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-2xl mb-1">{status.isOnline ? "🟢" : "🔴"}</p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {status.isOnline ? "En línea" : "Offline"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {status.pendingOperations}
          </p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Pendiente
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
            {status.failedOperations}
          </p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Fallida
          </p>
        </div>
      </div>

      {/* Sync Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <SyncProgress />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={async () => {
            await offlineSyncService.clearExpiredCache();
            alert("Cache expirada limpiada");
          }}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg active:scale-95 transition-transform"
        >
          Limpiar Cache
        </button>

        <button
          onClick={async () => {
            await offlineSyncService.clearAllData();
            onClearData?.();
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg active:scale-95 transition-transform"
        >
          Borrar Todo
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          💡 <strong>Modo Offline:</strong> Tus cambios se guardan localmente y
          se sincronizan automáticamente cuando recuperes la conexión.
        </p>
      </div>
    </div>
  );
};
